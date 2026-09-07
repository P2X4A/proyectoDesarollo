/**
 * Producto tal como lo usa la app (precios en COP, no en USD).
 * `source` indica si vino de la API o fue creado localmente
 * (FakeStore simula el POST pero no lo persiste entre recargas).
 */
export interface StoreProduct {
  id: number;
  title: string;
  /** Precio en pesos colombianos (COP). */
  price: number;
  description: string;
  category: string;
  image: string;
  source: 'api' | 'local';
}

/** Datos que el usuario puede ingresar al crear/editar. */
export interface StoreProductInput {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

/**
 * Cambios locales sobre el catálogo de la API.
 * Es lo que se guarda en localStorage (nuestro ".json" local):
 * - `created`: productos nuevos (no existen en la API).
 * - `updated`: parches por id sobre productos de la API.
 * - `deleted`: ids de la API que el usuario eliminó.
 */
export interface ProductsOverlay {
  created: StoreProduct[];
  updated: Record<number, Partial<StoreProduct>>;
  deleted: number[];
}

export const EMPTY_OVERLAY: ProductsOverlay = {
  created: [],
  updated: {},
  deleted: [],
};

/** Tasa de conversión USD -> COP usada en toda la app. */
export const USD_TO_COP = 4000;

/**
 * Función pura: combina el catálogo de la API con los cambios locales.
 * Es pura (sin HTTP ni storage) para poder probarla fácil con unit tests.
 */
export function applyOverlay(
  apiProducts: StoreProduct[],
  overlay: ProductsOverlay,
): StoreProduct[] {
  const deleted = new Set(overlay.deleted);
  const merged = apiProducts
    .filter((p) => !deleted.has(p.id))
    .map((p) => {
      const patch = overlay.updated[p.id];
      return patch ? { ...p, ...patch } : p;
    });
  return [...overlay.created, ...merged];
}
