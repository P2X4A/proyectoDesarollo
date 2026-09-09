import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductStoreService } from './product-store.service';
import { FakeStoreService } from '../fake-store/fake-store.service';
import type { Product } from '../fake-store/product.model';

function makeApiDto(id: number): Product {
  return {
    id,
    title: `Producto ${id}`,
    price: 10 + id, // USD: el store debe convertir a COP (x4000)
    description: `Descripción ${id}`,
    category: 'Tecnología',
    image: 'https://example.com/img.jpg',
    rating: { rate: 4.5, count: 10 },
  };
}

describe('ProductStoreService', () => {
  const fakeHttp = {
    getAllProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    fakeHttp.getAllProducts.mockReturnValue(of([makeApiDto(1), makeApiDto(2)]));
    fakeHttp.createProduct.mockReturnValue(of({} as Product));
    fakeHttp.updateProduct.mockReturnValue(of({} as Product));
    fakeHttp.deleteProduct.mockReturnValue(of({} as Product));

    TestBed.configureTestingModule({
      providers: [{ provide: FakeStoreService, useValue: fakeHttp }],
    });
  });

  function createStore(): ProductStoreService {
    return TestBed.runInInjectionContext(() => new ProductStoreService());
  }

  it('carga el catálogo convirtiendo USD a COP', () => {
    const store = createStore();
    store.loadAll();

    expect(store.products()).toHaveLength(2);
    expect(store.products()[0].price).toBe(11 * 4000);
    expect(store.products()[0].source).toBe('api');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('getById retorna null si no existe', () => {
    const store = createStore();
    store.loadAll();

    expect(store.getById(999)).toBeNull();
    expect(store.getById(1)?.title).toBe('Producto 1');
  });

  it('create agrega al inicio y persiste el overlay', () => {
    const store = createStore();
    store.loadAll();

    let createdId = 0;
    store
      .create({
        title: 'Nuevo',
        price: 50000,
        description: 'Desc',
        category: 'Moda',
        image: 'https://example.com/nuevo.jpg',
      })
      .subscribe((p) => (createdId = p.id));

    expect(store.products()[0].title).toBe('Nuevo');
    expect(store.products()[0].source).toBe('local');
    // Nueva instancia (simula recarga): el creado local sobrevive.
    const reloaded = createStore();
    reloaded.loadAll();
    expect(reloaded.getById(createdId)?.title).toBe('Nuevo');
  });

  it('update modifica y remove elimina (incluido API)', () => {
    const store = createStore();
    store.loadAll();

    store.update(1, { title: 'Editado' }).subscribe();
    expect(store.getById(1)?.title).toBe('Editado');

    let removed = false;
    store.remove(2).subscribe((ok) => (removed = ok));
    expect(removed).toBe(true);
    expect(store.getById(2)).toBeNull();

    // Tras "recarga", el editado sigue y el eliminado no vuelve.
    const reloaded = createStore();
    reloaded.loadAll();
    expect(reloaded.getById(1)?.title).toBe('Editado');
    expect(reloaded.getById(2)).toBeNull();
  });

  it('remove de id inexistente retorna false', () => {
    const store = createStore();
    store.loadAll();

    let result = true;
    store.remove(999).subscribe((ok) => (result = ok));
    expect(result).toBe(false);
  });

  it('sin red: marca error pero conserva lo creado localmente', () => {
    // Producto local previo (simula overlay de una sesión anterior).
    localStorage.setItem(
      'ml_products_overlay_v1',
      JSON.stringify({
        created: [
          {
            id: 999,
            title: 'Local previo',
            price: 10000,
            description: 'D',
            category: 'Moda',
            image: 'x.jpg',
            source: 'local',
          },
        ],
        updated: {},
        deleted: [],
      }),
    );
    fakeHttp.getAllProducts.mockReturnValue(throwError(() => new Error('offline')));

    const store = createStore();
    store.loadAll();

    expect(store.loading()).toBe(false);
    expect(store.error()).toContain('conexión');
    expect(store.getById(999)?.title).toBe('Local previo');
  });
});
