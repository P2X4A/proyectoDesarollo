import type { StoreProduct } from './store-product.model';

/**
 * Normaliza texto para comparar sin tildes ni mayúsculas.
 * Ej: "Tecnología" -> "tecnologia".
 */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Función pura: filtra productos por término (título, categoría y
 * descripción). Insensible a mayúsculas y tildes.
 * El término se divide en palabras: todas deben aparecer (AND).
 */
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

/**
 * Función pura: filtra productos por nombre de categoría visible.
 * Mapea las categorías de ML Colombia a las de FakeStore + locales.
 * Busca por nombre completo y, si no hay coincidencia, por primera
 * palabra (ej: "Hogar y Muebles" y "Hogar" -> "hogar").
 */
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
  // Sin mapeo conocido: coincidencia directa insensible a tildes.
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
