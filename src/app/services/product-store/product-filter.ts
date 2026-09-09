import type { StoreProduct } from './store-product.model';

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function filterProducts(products: StoreProduct[], term: string): StoreProduct[] {
  const words = normalizeText(term).split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) {
    return [...products];
  }
  return products.filter((p) => {
    const haystack = normalizeText(`${p.title} ${p.category} ${p.description}`);
    return words.every((w) => haystack.includes(w));
  });
}

export function filterByCategory(products: StoreProduct[], category: string): StoreProduct[] {
  const norm = normalizeText(category).trim();
  const firstWord = norm.split(/\s+/)[0] ?? norm;
  const map: Record<string, string[]> = {
    tecnologia: ['electronics'],
    electronica: ['electronics'],
    moda: ["men's clothing", "women's clothing", 'moda'],
    ropa: ["men's clothing", "women's clothing", 'moda'],
    belleza: [],
    supermercado: [],
    vehiculos: [],
    farmacia: [],
    electrodomesticos: [],
    hogar: [],
    deportes: [],
    mascotas: [],
    juegos: [],
    videojuegos: [],
    herramientas: [],
  };

  const targets = map[norm] ?? map[firstWord];
  if (!targets) {
    return products.filter(
      (p) => normalizeText(p.category).includes(norm) || normalizeText(norm).includes(normalizeText(p.category)),
    );
  }
  if (targets.length === 0) {
    return [];
  }
  return products.filter((p) => targets.includes(normalizeText(p.category)));
}
