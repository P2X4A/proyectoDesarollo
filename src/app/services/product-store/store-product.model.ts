export interface StoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  source: 'api' | 'local';
}

export interface StoreProductInput {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

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

export const USD_TO_COP = 4000;

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
