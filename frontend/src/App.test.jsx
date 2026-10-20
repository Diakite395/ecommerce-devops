import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import App, { formatPrice } from './App.jsx';

function mockFetch(response) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('affiche le titre et un message de chargement', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    render(<App />);
    expect(screen.getByRole('heading', { name: /boutique en ligne/i })).toBeInTheDocument();
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  test('affiche la liste des produits', async () => {
    mockFetch({
      ok: true,
      json: async () => [
        { id: 1, name: 'Clavier mécanique', price: '45000.00', stock: 25 },
        { id: 2, name: 'Souris sans fil', price: '15000.00', stock: 60 },
      ],
    });
    render(<App />);
    expect(await screen.findByText('Clavier mécanique')).toBeInTheDocument();
    expect(screen.getByText('Souris sans fil')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/products');
  });

  test("affiche un message si la liste est vide", async () => {
    mockFetch({ ok: true, json: async () => [] });
    render(<App />);
    expect(await screen.findByText(/aucun produit/i)).toBeInTheDocument();
  });

  test("affiche une erreur si l'API répond mal", async () => {
    mockFetch({ ok: false, status: 500, json: async () => ({}) });
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/impossible de charger/i);
  });

  test("affiche une erreur si le réseau échoue", async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    render(<App />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});

describe('formatPrice', () => {
  test('ajoute la devise', () => {
    expect(formatPrice('45000.00')).toMatch(/FCFA$/);
  });
});
