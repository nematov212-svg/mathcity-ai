import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';

describe('Google, Apple & Complete Profile Comprehensive Test Suite', () => {
  let googleUserToken = '';
  let appleUserToken = '';
  const testGoogleSub = 'google_user_998877';
  const testAppleSub = 'apple_user_112233';

  it('1. POST /api/auth/google rejects completely invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'invalid.google.token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Google tokeni yaroqsiz');
  });

  it('2. POST /api/auth/google succeeds with verified token and sets profileCompleted=false', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: `mock-google-${testGoogleSub}` });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.isNewUser).toBe(true);
    expect(res.body.data.profileCompleted).toBe(false);
    expect(res.body.data.user.profileCompleted).toBe(false);

    googleUserToken = res.body.data.token;
  });

  it('3. User with incomplete profile cannot access /api/ai/quota (returns 403 PROFILE_INCOMPLETE)', async () => {
    const res = await request(app)
      .get('/api/ai/quota')
      .set('Authorization', `Bearer ${googleUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('PROFILE_INCOMPLETE');
    expect(res.body.error).toContain('profilingizni to‘ldiring');
  });

  it('4. POST /api/auth/apple rejects invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/apple')
      .send({ identityToken: 'invalid.apple.jwt' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Apple tokeni yaroqsiz');
  });

  it('5. POST /api/auth/apple succeeds with verified token, captures full name and sets profileCompleted=false', async () => {
    const res = await request(app)
      .post('/api/auth/apple')
      .send({
        identityToken: `mock-apple-${testAppleSub}`,
        fullName: { givenName: 'Temur', familyName: 'Bek' },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.profileCompleted).toBe(false);
    expect(res.body.data.user.displayName).toBe('Temur Bek');

    appleUserToken = res.body.data.token;
  });

  it('6. GET /api/auth/username-available validates format, length, reserved and taken words', async () => {
    // Too short
    const resShort = await request(app).get('/api/auth/username-available?username=ab');
    expect(resShort.status).toBe(400);

    // Reserved word
    const resAdmin = await request(app).get('/api/auth/username-available?username=admin');
    expect(resAdmin.status).toBe(400);
    expect(resAdmin.body.error).toContain('band qilingan');

    // Contains @
    const resEmail = await request(app).get('/api/auth/username-available?username=test@user');
    expect(resEmail.status).toBe(400);

    // Taken by demo user
    const resTaken = await request(app).get('/api/auth/username-available?username=ali');
    expect(resTaken.status).toBe(200);
    expect(resTaken.body.data.available).toBe(false);

    // Free valid username
    const resFree = await request(app).get('/api/auth/username-available?username=jasur_2026');
    expect(resFree.status).toBe(200);
    expect(resFree.body.data.available).toBe(true);
  });

  it('7. POST /api/auth/complete-profile rejects invalid calendar dates (e.g. Feb 30, future)', async () => {
    // Feb 30
    const resFeb30 = await request(app)
      .post('/api/auth/complete-profile')
      .set('Authorization', `Bearer ${googleUserToken}`)
      .send({
        username: 'jasur_2026',
        birthDay: 30,
        birthMonth: 2,
        birthYear: 2015,
      });

    expect(resFeb30.status).toBe(400);
    expect(resFeb30.body.error).toContain('mavjud emas');

    // Future date
    const resFuture = await request(app)
      .post('/api/auth/complete-profile')
      .set('Authorization', `Bearer ${googleUserToken}`)
      .send({
        username: 'jasur_2026',
        birthDay: 1,
        birthMonth: 1,
        birthYear: 2099,
      });

    expect(resFuture.status).toBe(400);
    expect(resFuture.body.error).toContain('kelajakda');
  });

  it('8. POST /api/auth/complete-profile accepts any age without restriction', async () => {
    const res = await request(app)
      .post('/api/auth/complete-profile')
      .set('Authorization', `Bearer ${googleUserToken}`)
      .send({
        username: 'jasur_2026',
        birthDay: 1,
        birthMonth: 1,
        birthYear: 2024,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('9. POST /api/auth/complete-profile successfully completes profile for Google user with parental advisory', async () => {
    const res = await request(app)
      .post('/api/auth/complete-profile')
      .set('Authorization', `Bearer ${googleUserToken}`)
      .send({
        username: 'jasur_2026',
        birthDay: 15,
        birthMonth: 5,
        birthYear: 2017, // 9 years old -> KIDS mode & minor (< 13)
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profileCompleted).toBe(true);
    expect(res.body.data.requiresParentalConsent).toBe(true);
    expect(res.body.data.parentalNotice).toContain('Ota-onangiz bilan birga');
    expect(res.body.data.user.username).toBe('jasur_2026');
    expect(res.body.data.user.mode).toBe('KIDS');
  });

  it('10. After complete-profile, /api/ai/quota is accessible', async () => {
    const res = await request(app)
      .get('/api/ai/quota')
      .set('Authorization', `Bearer ${googleUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.remaining).toBe(5);
  });

  it('11. Subsequent login for the same Google user returns profileCompleted=true', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: `mock-google-${testGoogleSub}` });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isNewUser).toBe(false);
    expect(res.body.data.profileCompleted).toBe(true);
    expect(res.body.data.user.username).toBe('jasur_2026');
  });

  it('12. In-App account deletion (DELETE /api/auth/account) completely wipes user data', async () => {
    const delRes = await request(app)
      .delete('/api/auth/account')
      .set('Authorization', `Bearer ${googleUserToken}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);
    expect(delRes.body.message).toContain('butunlay o‘chirildi');

    // Future calls with the deleted user's token fail with 401
    const checkRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${googleUserToken}`);

    expect(checkRes.status).toBe(401);
  });

  describe('Google Access Token (Web GIS) Verification Suite', () => {
    it('13. POST /api/auth/google rejects invalid/expired accessToken', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ accessToken: 'mock-access-token-invalid_key' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('yaroqsiz');
    });

    it('14. POST /api/auth/google rejects accessToken with wrong audience/client_id', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ accessToken: 'mock-access-token-wrong-aud_sub' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('boshqa mijozga');
    });

    it('15. POST /api/auth/google rejects accessToken when email is unverified', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ accessToken: 'mock-access-token-unverified_sub' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('tasdiqlanmagan');
    });

    it('16. POST /api/auth/google succeeds with valid accessToken and creates session', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ accessToken: 'mock-access-token-web_user_7788' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('web_user_7788@gmail.com');
      expect(res.body.data.profileCompleted).toBe(false);
    });
  });
});
