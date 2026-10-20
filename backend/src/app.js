const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');

// Factory : on injecte le pool pour pouvoir le simuler dans les tests
function createApp(pool) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', database: 'up' });
    } catch (err) {
      res.status(503).json({ status: 'error', database: 'down' });
    }
  });

  app.use('/products', productsRouter(pool));

  return app;
}

module.exports = createApp;
