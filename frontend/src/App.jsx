import { useEffect, useState } from 'react';

export function formatPrice(value) {
  return `${Number(value).toLocaleString('fr-FR')} FCFA`;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // /api est redirigé vers le backend (proxy Vite en dev, Nginx en production)
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setProducts(data);
          setStatus('ready');
        }
      } catch (err) {
        if (!cancelled) setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container">
      <h1>Boutique en ligne</h1>

      {status === 'loading' && <p>Chargement des produits…</p>}
      {status === 'error' && (
        <p role="alert" className="error">
          Impossible de charger les produits.
        </p>
      )}
      {status === 'ready' && products.length === 0 && <p>Aucun produit disponible.</p>}

      {status === 'ready' && products.length > 0 && (
        <ul className="grid">
          {products.map((p) => (
            <li key={p.id} className="card">
              <h2>{p.name}</h2>
              <p className="price">{formatPrice(p.price)}</p>
              <p className="stock">{p.stock} en stock</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
