import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductStoreService } from '../../services/product-store/product-store.service';
import { CartService } from '../../services/cart.service';
import { filterProducts } from '../../services/product-store/product-filter';
import type { Producto } from '../../models/producto';

@Component({
  selector: 'app-buscarcomponent',
  standalone: false,
  templateUrl: './buscarcomponent.html',
  styleUrl: './buscarcomponent.css',
})
export class Buscarcomponent {
  protected store = inject(ProductStoreService);
  private cartService = inject(CartService);

  /** Término actual (sincronizado con ?q= de la URL, compartible). */
  readonly query = signal('');

  /** Resultados derivados del catálogo + término (sin copias que se desincronicen). */
  readonly resultados = computed(() => filterProducts(this.store.products(), this.query()));

  /** IDs con confirmación visual temporal. */
  agregados = new Set<number>();

  constructor() {
    const route = inject(ActivatedRoute);
    this.store.loadAll();
    route.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => this.query.set((params.get('q') ?? '').trim()));
  }

  recargar(): void {
    this.store.loadAll(true);
  }

  formatPrice(precio: number): string {
    return '$ ' + precio.toLocaleString('es-CO');
  }

  agregarAlCarrito(id: number): void {
    const prod = this.store.getById(id);
    if (!prod) {
      return;
    }
    const producto: Producto = {
      id: prod.id,
      title: prod.title,
      price: prod.price,
      description: prod.description,
      category: prod.category,
      image: prod.image,
    };
    this.cartService.agregarProducto(producto);
    this.agregados.add(id);
    setTimeout(() => this.agregados.delete(id), 1500);
  }
}
