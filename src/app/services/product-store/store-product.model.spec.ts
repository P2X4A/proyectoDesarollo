import { describe, expect, it } from 'vitest';
import {
  applyOverlay,
  EMPTY_OVERLAY,
  type ProductsOverlay,
  type StoreProduct,
} from './store-product.model';

function makeApiProduct(id: number, title = `Producto ${id}`): StoreProduct {
  return {
    id,
    title,
    price: id * 1000,
    description: `Descripción ${id}`,
    category: 'Tecnología',
    image: 'https://example.com/img.jpg',
    source: 'api',
  };
}

describe('applyOverlay', () => {
  it('sin cambios locales devuelve el catálogo de la API intacto', () => {
    const api = [makeApiProduct(1), makeApiProduct(2)];

    expect(applyOverlay(api, EMPTY_OVERLAY)).toEqual(api);
  });

  it('excluye los ids eliminados', () => {
    const api = [makeApiProduct(1), makeApiProduct(2)];
    const overlay: ProductsOverlay = { ...EMPTY_OVERLAY, deleted: [1] };

    const result = applyOverlay(api, overlay);

    expect(result.map((p) => p.id)).toEqual([2]);
  });

  it('aplica parches de actualización sin mutar el original', () => {
    const api = [makeApiProduct(1)];
    const overlay: ProductsOverlay = {
      ...EMPTY_OVERLAY,
      updated: { 1: { title: 'Editado', price: 999 } },
    };

    const result = applyOverlay(api, overlay);

    expect(result[0].title).toBe('Editado');
    expect(result[0].price).toBe(999);
    expect(api[0].title).toBe('Producto 1');
  });

  it('pone los creados locales primero', () => {
    const api = [makeApiProduct(1)];
    const local: StoreProduct = { ...makeApiProduct(99, 'Mío'), source: 'local' };
    const overlay: ProductsOverlay = { ...EMPTY_OVERLAY, created: [local] };

    const result = applyOverlay(api, overlay);

    expect(result.map((p) => p.id)).toEqual([99, 1]);
  });
});
