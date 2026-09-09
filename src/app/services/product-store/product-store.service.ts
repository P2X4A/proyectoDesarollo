import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
  private fakeStore = inject(FakeStoreService);
  private storage = inject(LocalStorageService);

  private readonly OVERLAY_KEY = 'products_overlay_v1';
  private loaded = false;

  private productsSubject = new BehaviorSubject<StoreProduct[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  products$: Observable<StoreProduct[]> = this.productsSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  error$: Observable<string | null> = this.errorSubject.asObservable();

  getProducts(): StoreProduct[] {
    return this.productsSubject.value;
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  loadAll(force = false): void {
    if (this.loaded && !force) {
      return;
    }
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.fakeStore.getAllProducts().subscribe({
      next: (apiProducts: Product[]) => {
        const mapped = apiProducts.map((p) => this.fromApi(p));
        this.productsSubject.next(applyOverlay(mapped, this.readOverlay()));
        this.loaded = true;
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('[ProductStore] Error cargando productos:', err);
        this.productsSubject.next(applyOverlay([], this.readOverlay()));
        this.loaded = true;
        this.loadingSubject.next(false);
        this.errorSubject.next('No se pudo cargar el catálogo. Revisa tu conexión.');
      },
    });
  }

  getById(id: number): StoreProduct | null {
    return this.getProducts().find((p) => p.id === id) ?? null;
  }

  create(input: StoreProductInput): Observable<StoreProduct> {
    const local: StoreProduct = { ...input, id: Date.now(), source: 'local' };

    this.fakeStore
      .createProduct({ title: input.title, price: input.price })
      .subscribe({ error: (err) => console.warn('[ProductStore] POST API falló:', err) });

    return new Observable<StoreProduct>((subscriber) => {
      const overlay = this.readOverlay();
      overlay.created = [local, ...overlay.created];
      this.writeOverlay(overlay);
      this.productsSubject.next([local, ...this.getProducts()]);
      subscriber.next(local);
      subscriber.complete();
    });
  }

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
      this.productsSubject.next(
        this.getProducts().map((p) => (p.id === id ? { ...p, ...patch } : p)),
      );
      subscriber.next(this.getById(id));
      subscriber.complete();
    });
  }

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
      this.productsSubject.next(this.getProducts().filter((p) => p.id !== id));
      subscriber.next(true);
      subscriber.complete();
    });
  }

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
