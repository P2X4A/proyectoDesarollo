import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { FakeStoreService } from '../fake-store/fake-store.service';
import { LocalStorageService } from '../storage/local-storage.service';
import type { Product } from '../fake-store/product.model';
import {
  applyOverlay,
  EMPTY_OVERLAY,
  USD_TO_COP,
  type ProductsOverlay,
  type StoreProduct,
  type StoreProductInput,
} from './store-product.model';

/**
 * Store de productos (estado del catálogo).
 * Patrón: signal store por feature (Angular moderno).
 * - Estado privado escribible (`#products`), lectura pública solo-lectura.
 * - Async (HTTP) en RxJS; el resultado se escribe en el signal.
 * - Persistencia: la API es la fuente inicial; los cambios del usuario
 *   (crear/editar/eliminar) viven en un overlay en localStorage, porque
 *   FakeStore simula el POST/PUT/DELETE pero no persiste entre recargas.
 */
@Injectable({ providedIn: 'root' })
export class ProductStoreService {
  private fakeStore = inject(FakeStoreService);
  private storage = inject(LocalStorageService);

  private readonly OVERLAY_KEY = 'products_overlay_v1';

  // ── Estado privado ──
  private readonly _products = signal<StoreProduct[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _loaded = signal(false);

  // ── Lectura pública (solo-lectura) ──
  readonly products: Signal<StoreProduct[]> = this._products.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<string | null> = this._error.asReadonly();
  readonly count = computed(() => this._products().length);

  /** Carga el catálogo (API + cambios locales). Llamadas extra se ignoran si ya cargó. */
  loadAll(force = false): void {
    if (this._loaded() && !force) {
      return;
    }
    this._loading.set(true);
    this._error.set(null);

    this.fakeStore.getAllProducts().subscribe({
      next: (apiProducts: Product[]) => {
        const mapped = apiProducts.map((p) => this.fromApi(p));
        this._products.set(applyOverlay(mapped, this.readOverlay()));
        this._loaded.set(true);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('[ProductStore] Error cargando productos:', err);
        // Sin red: al menos mostramos lo creado localmente.
        this._products.set(applyOverlay([], this.readOverlay()));
        this._loaded.set(true);
        this._loading.set(false);
        this._error.set('No se pudo cargar el catálogo. Revisa tu conexión.');
      },
    });
  }

  /** Busca un producto del estado actual por id (o null si no existe). */
  getById(id: number): StoreProduct | null {
    return this._products().find((p) => p.id === id) ?? null;
  }

  /**
   * Crea un producto. Intenta POST a la API (best-effort) y siempre
   * guarda copia local para que sobreviva recargas.
   */
  create(input: StoreProductInput): Observable<StoreProduct> {
    const local: StoreProduct = { ...input, id: Date.now(), source: 'local' };

    // Best-effort contra la API: si falla, el producto local igual queda.
    this.fakeStore
      .createProduct({ title: input.title, price: input.price })
      .subscribe({ error: (err) => console.warn('[ProductStore] POST API falló:', err) });

    return new Observable<StoreProduct>((subscriber) => {
      const overlay = this.readOverlay();
      overlay.created = [local, ...overlay.created];
      this.writeOverlay(overlay);
      this._products.update((items) => [local, ...items]);
      subscriber.next(local);
      subscriber.complete();
    });
  }

  /** Actualiza un producto (API best-effort + overlay local). */
  update(id: number, patch: Partial<StoreProductInput>): Observable<StoreProduct | null> {
    this.fakeStore
      .updateProduct(id, { title: patch.title, price: patch.price })
      .subscribe({ error: (err) => console.warn('[ProductStore] PUT API falló:', err) });

    return new Observable<StoreProduct | null>((subscriber) => {
      const current = this.getById(id);
      if (!current) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }
      const overlay = this.readOverlay();
      if (current.source === 'local') {
        overlay.created = overlay.created.map((p) =>
          p.id === id ? { ...p, ...patch } : p,
        );
      } else {
        overlay.updated = { ...overlay.updated, [id]: { ...overlay.updated[id], ...patch } };
      }
      this.writeOverlay(overlay);
      this._products.update((items) =>
        items.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      );
      subscriber.next(this.getById(id));
      subscriber.complete();
    });
  }

  /** Elimina un producto (API best-effort + overlay local). */
  remove(id: number): Observable<boolean> {
    this.fakeStore
      .deleteProduct(id)
      .subscribe({ error: (err) => console.warn('[ProductStore] DELETE API falló:', err) });

    return new Observable<boolean>((subscriber) => {
      const current = this.getById(id);
      if (!current) {
        subscriber.next(false);
        subscriber.complete();
        return;
      }
      const overlay = this.readOverlay();
      if (current.source === 'local') {
        overlay.created = overlay.created.filter((p) => p.id !== id);
      } else {
        overlay.deleted = [...overlay.deleted, id];
        const { [id]: _removed, ...rest } = overlay.updated;
        overlay.updated = rest;
      }
      this.writeOverlay(overlay);
      this._products.update((items) => items.filter((p) => p.id !== id));
      subscriber.next(true);
      subscriber.complete();
    });
  }

  // ── Privados ──

  /** Convierte un producto de la API (USD) al modelo de la app (COP). */
  private fromApi(p: Product): StoreProduct {
    return {
      id: p.id,
      title: p.title,
      price: Math.floor(p.price * USD_TO_COP),
      description: p.description,
      category: p.category,
      image: p.image,
      source: 'api',
    };
  }

  private readOverlay(): ProductsOverlay {
    return this.storage.get<ProductsOverlay>(this.OVERLAY_KEY) ?? { ...EMPTY_OVERLAY };
  }

  private writeOverlay(overlay: ProductsOverlay): void {
    this.storage.set(this.OVERLAY_KEY, overlay);
  }
}
