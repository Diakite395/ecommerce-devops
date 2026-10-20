const express = require('express');

module.exports = function productsRouter(pool) {
  const router = express.Router();

  // GET /products : liste des produits
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, name, price, stock FROM products ORDER BY id'
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // GET /products/:id : un produit
  router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Identifiant invalide' });
    }
    try {
      const { rows } = await pool.query(
        'SELECT id, name, price, stock FROM products WHERE id = $1',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Produit introuvable' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  return router;
};
