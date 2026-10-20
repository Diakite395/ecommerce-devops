const request = require('supertest');
const createApp = require('../../src/app');

// Tests unitaires : le pool PostgreSQL est simulé (aucune base requise)
describe('API (tests unitaires)', () => {
  let pool;
  let app;

  beforeEach(() => {
    pool = { query: jest.fn() };
    app = createApp(pool);
  });

  test('GET /health renvoie 200 quand la base répond', async () => {
    pool.query.mockResolvedValue({ rows: [{ '?column?': 1 }] });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', database: 'up' });
  });

  test('GET /health renvoie 503 quand la base est down', async () => {
    pool.query.mockRejectedValue(new Error('down'));
    const res = await request(app).get('/health');
    expect(res.status).toBe(503);
  });

  test('GET /products renvoie la liste', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1, name: 'A', price: '10.00', stock: 5 }] });
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test("GET /products renvoie 500 en cas d'erreur base", async () => {
    pool.query.mockRejectedValue(new Error('boom'));
    const res = await request(app).get('/products');
    expect(res.status).toBe(500);
  });

  test('GET /products/:id renvoie 400 si id invalide', async () => {
    const res = await request(app).get('/products/abc');
    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('GET /products/:id renvoie 404 si inconnu', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/products/999');
    expect(res.status).toBe(404);
  });

  test('GET /products/:id renvoie le produit', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 2, name: 'B', price: '5.00', stock: 1 }] });
    const res = await request(app).get('/products/2');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
  });

  test("GET /products/:id renvoie 500 en cas d'erreur base", async () => {
    pool.query.mockRejectedValue(new Error('boom'));
    const res = await request(app).get('/products/1');
    expect(res.status).toBe(500);
  });
});
