const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { Pool } = require('pg');
const createApp = require('../../src/app');

// Tests d'intégration : nécessitent une vraie base PostgreSQL (DATABASE_URL)
const hasDb = Boolean(process.env.DATABASE_URL);
const describeIfDb = hasDb ? describe : describe.skip;

describeIfDb("API (tests d'intégration avec PostgreSQL)", () => {
  let pool;
  let app;

  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const sql = fs.readFileSync(path.join(__dirname, '../../../db/init.sql'), 'utf8');
    await pool.query(sql);
    app = createApp(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  test('GET /health confirme la connexion à la base', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.database).toBe('up');
  });

  test('GET /products renvoie les produits de la base', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
  });

  test('GET /products/1 renvoie un produit existant', async () => {
    const res = await request(app).get('/products/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test('GET /products/999999 renvoie 404', async () => {
    const res = await request(app).get('/products/999999');
    expect(res.status).toBe(404);
  });
});
