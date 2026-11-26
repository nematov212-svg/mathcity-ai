import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';

describe('MathCity AI — 3D House Building Sandbox & Economy System Tests', () => {
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'Builder Usta',
        loginOrEmail: `builder_${Date.now()}`,
        password: 'password123',
      });

    userToken = regRes.body.data.token;
    userId = regRes.body.data.user.id;

    // Grant 1000 coins for testing
    repository.creditCoins(userId, 1000, 'Test setup for house building');
  });

  it('1. GET /api/games/house-building returns full catalog, roof colors, and initialized state', async () => {
    const res = await request(app)
      .get('/api/games/house-building')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.catalog)).toBe(true);
    expect(res.body.data.catalog.length).toBeGreaterThanOrEqual(40);
    expect(res.body.data.roofColors.length).toBe(5);
    expect(res.body.data.myState).toBeDefined();
    expect(Array.isArray(res.body.data.myState.stages)).toBe(true);
    expect(res.body.data.myState.stages.length).toBe(6);
  });

  it('2. POST /api/games/house-building/buy rejects when coins are insufficient', async () => {
    // Register poor user with 0 coins
    const poorRes = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'Poor User',
        loginOrEmail: `poor_${Date.now()}`,
        password: 'password123',
      });
    const poorToken = poorRes.body.data.token;

    const res = await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${poorToken}`)
      .send({ itemId: 'red_brick_wall' }); // costs 150

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Tangalar yetarli emas');
  });

  it('3. POST /api/games/house-building/buy buys items and debits exact coins atomically', async () => {
    const userBefore = repository.getUserById(userId)!;
    const coinsBefore = userBefore.coinBalance;

    const res = await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'concrete_foundation' }); // costs 30

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.coinsSpent).toBe(30);
    expect(res.body.data.newCoinBalance).toBe(coinsBefore - 30);
  });

  it('4. Placement rules: cannot place wall without foundation', async () => {
    // Buy a wall
    await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'red_brick_wall' });

    // Try placing wall before placing any foundation
    const placeRes = await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'red_brick_wall', cellX: 5, cellY: 5 });

    expect(placeRes.status).toBe(400);
    expect(placeRes.body.success).toBe(false);
    expect(placeRes.body.error).toContain('Avval poydevor quring');
  });

  it('5. Step-by-step construction advances stages 1 to 6 properly', async () => {
    // Place foundation -> Stage 1
    const fRes = await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'concrete_foundation', cellX: 5, cellY: 5 });
    expect(fRes.status).toBe(200);
    expect(fRes.body.data.completedStages).toContain(1);

    // Place wall -> Stage 2
    const wRes = await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'red_brick_wall', cellX: 5, cellY: 5 });
    expect(wRes.status).toBe(200);
    expect(wRes.body.data.completedStages).toContain(2);

    // Buy and place roof -> Stage 3
    await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'gable_roof' });
    const rRes = await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'gable_roof', cellX: 5, cellY: 5, color: '#DC2626' });
    expect(rRes.status).toBe(200);
    expect(rRes.body.data.completedStages).toContain(3);

    // Buy and place door and window -> Stage 4
    await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'standard_door' });
    await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'standard_door', cellX: 5, cellY: 5 });

    await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'standard_window' });
    const winRes = await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'standard_window', cellX: 6, cellY: 5 });
    expect(winRes.status).toBe(200);
    expect(winRes.body.data.completedStages).toContain(4);

    // Buy and place yard item -> Stage 5
    await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'tree' });
    const treeRes = await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'tree', cellX: 1, cellY: 1 });
    expect(treeRes.status).toBe(200);
    expect(treeRes.body.data.completedStages).toContain(5);

    // Buy and place vehicle -> Stage 6
    await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'standard_car' });
    const carRes = await request(app)
      .post('/api/games/house-building/place')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'standard_car', cellX: 1, cellY: 6 });
    expect(carRes.status).toBe(200);
    expect(carRes.body.data.completedStages).toContain(6);
    expect(carRes.body.data.isFinished).toBe(true);
  });

  it('6. POST /api/games/house-building/sell refunds exactly 50% coins', async () => {
    // Buy a sofa for 40 coins
    await request(app)
      .post('/api/games/house-building/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'sofa' });

    const balanceBefore = repository.getUserById(userId)!.coinBalance;

    const sellRes = await request(app)
      .post('/api/games/house-building/sell')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'sofa' });

    expect(sellRes.status).toBe(200);
    expect(sellRes.body.success).toBe(true);
    expect(sellRes.body.data.refundCoins).toBe(20); // 50% of 40
    expect(sellRes.body.data.newCoinBalance).toBe(balanceBefore + 20);
  });
});
