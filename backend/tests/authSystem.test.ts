import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';

describe('Production Authentication System Tests', () => {
  const testUsername = 'sarvar_dev';
  const testEmail = 'sarvar@mathcity.ai';
  const testPassword = 'Password123!';
  const newPassword = 'NewPassword456!';

  it('Test 1: Registration with valid credentials succeeds and creates user with 0 coins and 0 XP', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'Sarvar',
        loginOrEmail: testUsername,
        password: testPassword,
        confirmPassword: testPassword,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.displayName).toBe('Sarvar');
    expect(res.body.data.user.coinBalance).toBe(0);
    expect(res.body.data.user.totalXP).toBe(0);
  });

  it('Test 2: Registration rejects mismatching confirm password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'TestUser',
        loginOrEmail: 'testuser123',
        password: 'Password123!',
        confirmPassword: 'MismatchPassword!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Parollar bir xil emas');
  });

  it('Test 3: Registration rejects duplicate username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'Sarvar Copy',
        loginOrEmail: testUsername,
        password: testPassword,
        confirmPassword: testPassword,
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('band');
  });

  it('Test 4: Registration rejects passwords shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'ShortPass',
        loginOrEmail: 'shortpass_user',
        password: '123',
        confirmPassword: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('kamida 8 ta');
  });

  it('Test 5: Login with username succeeds', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUsername,
        password: testPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.displayName).toBe('Sarvar');
  });

  it('Test 6: Login with incorrect password is rejected with Uzbek message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUsername,
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Login yoki parol noto‘g‘ri.');
  });

  it('Test 7: Token refresh endpoint succeeds with valid session token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUsername,
        password: testPassword,
      });

    const token = loginRes.body.data.token;

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.token).toBeDefined();
    expect(refreshRes.body.data.user.displayName).toBe('Sarvar');
  });

  it('Test 8: Forgot password generates code and reset password updates credential', async () => {
    // 1. Request forgot password
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testUsername });

    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.success).toBe(true);
    const code = forgotRes.body.debugCode;
    expect(code).toBeDefined();

    // 2. Reset password
    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: testUsername,
        resetToken: code,
        newPassword: newPassword,
      });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // 3. Old password now rejected
    const oldLogin = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUsername,
        password: testPassword,
      });
    expect(oldLogin.status).toBe(401);

    // 4. New password now accepted
    const newLogin = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUsername,
        password: newPassword,
      });
    expect(newLogin.status).toBe(200);
    expect(newLogin.body.success).toBe(true);
  });

  it('Test 9: GET /api/users/check-username validates uniqueness case-insensitively', async () => {
    // 1. Taken username (same case)
    const takenRes = await request(app).get(`/api/users/check-username?u=${testUsername}`);
    expect(takenRes.status).toBe(200);
    expect(takenRes.body.data.available).toBe(false);
    expect(takenRes.body.data.message).toContain('band');

    // 2. Taken username (UPPERCASE)
    const upperRes = await request(app).get(`/api/users/check-username?u=${testUsername.toUpperCase()}`);
    expect(upperRes.status).toBe(200);
    expect(upperRes.body.data.available).toBe(false);
    expect(upperRes.body.data.message).toContain('band');

    // 3. Available username
    const freeRes = await request(app).get('/api/users/check-username?u=MathUniqueHero99');
    expect(freeRes.status).toBe(200);
    expect(freeRes.body.data.available).toBe(true);
    expect(freeRes.body.data.message).toContain('bo‘sh');

    // 4. Registration with case-insensitive collision returns 409
    const collisionRes = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'Sarvar Collision',
        loginOrEmail: testUsername.toUpperCase(),
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
    expect(collisionRes.status).toBe(409);
    expect(collisionRes.body.error).toContain('band');
  });
});
