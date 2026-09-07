import { describe, expect, it } from 'vitest';
import {
  filterByCategory,
  filterProducts,
  normalizeText,
} from './product-filter';
import type { StoreProduct } from './store-product.model';

function makeProduct(id: number, title: string, category: string): StoreProduct {
  return {
    id,
    title,
    price: id * 1000,
    description: `Descripción de ${title}`,
    category,
    image: 'https://example.com/img.jpg',
    source: 'api',
  };
}

describe('normalizeText', () => {
  it('quita tildes y mayúsculas', () => {
    expect(normalizeText('Tecnología')).toBe('tecnologia');
    expect(normalizeText('Búsqueda RÁPIDA')).toBe('busqueda rapida');
  });
});

describe('filterProducts', () => {
  const catalog = [
    makeProduct(1, 'Audífonos Bluetooth', 'electronics'),
    makeProduct(2, 'Camisa de algodón', "men's clothing"),
    makeProduct(3, 'Nevera frost', 'Electrodomésticos'),
  ];

  it('término vacío devuelve todo', () => {
    expect(filterProducts(catalog, '   ')).toHaveLength(3);
  });

  it('filtra por título insensible a tildes', () => {
    expect(filterProducts(catalog, 'audifonos').map((p) => p.id)).toEqual([1]);
  });

  it('filtra por categoría', () => {
    expect(filterProducts(catalog, 'clothing').map((p) => p.id)).toEqual([2]);
  });

  it('todas las palabras deben coincidir (AND)', () => {
    expect(filterProducts(catalog, 'camisa nevera')).toHaveLength(0);
    expect(filterProducts(catalog, 'camisa algodon').map((p) => p.id)).toEqual([2]);
  });

  it('no muta el catálogo original', () => {
    filterProducts(catalog, 'camisa');
    expect(catalog).toHaveLength(3);
  });
});

describe('filterByCategory', () => {
  const catalog = [
    makeProduct(1, 'Laptop', 'electronics'),
    makeProduct(2, 'Camisa', "men's clothing"),
    makeProduct(3, 'Vestido', "women's clothing"),
    makeProduct(4, 'Mío', 'Moda'),
  ];

  it('mapea Tecnología a electronics', () => {
    expect(filterByCategory(catalog, 'Tecnología').map((p) => p.id)).toEqual([1]);
  });

  it('mapea alias Electrónica y Ropa (incluye publicados locales)', () => {
    expect(filterByCategory(catalog, 'Electrónica').map((p) => p.id)).toEqual([1]);
    expect(filterByCategory(catalog, 'Ropa').map((p) => p.id)).toEqual([2, 3, 4]);
  });

  it('Moda incluye ropa de API y locales', () => {
    expect(filterByCategory(catalog, 'Moda').map((p) => p.id)).toEqual([2, 3, 4]);
  });

  it('categorías sin productos devuelven vacío', () => {
    expect(filterByCategory(catalog, 'Vehículos')).toEqual([]);
    expect(filterByCategory(catalog, 'Supermercado')).toEqual([]);
  });

  it('primera palabra resuelve "Hogar y Muebles"', () => {
    expect(filterByCategory(catalog, 'Hogar y Muebles')).toEqual([]);
  });
});
