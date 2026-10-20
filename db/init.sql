CREATE TABLE IF NOT EXISTS products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0
);

INSERT INTO products (name, price, stock)
SELECT * FROM (VALUES
  ('Clavier mécanique', 45000.00, 25),
  ('Souris sans fil',   15000.00, 60),
  ('Écran 24 pouces',   95000.00, 12),
  ('Casque audio',      30000.00, 40)
) AS seed(name, price, stock)
WHERE NOT EXISTS (SELECT 1 FROM products);
