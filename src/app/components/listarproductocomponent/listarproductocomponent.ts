import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductStoreService } from '../../services/product-store/product-store.service';
import { CartService } from '../../services/cart.service';
import type { StoreProduct } from '../../services/product-store/store-product.model';
import type { Producto } from '../../models/producto';

@Component({
  selector: 'app-listarproductocomponent',
  standalone: false,
  templateUrl: './listarproductocomponent.html',
  styleUrl: './listarproductocomponent.css',
})
export class Listarproductocomponent implements OnInit {
  productos: StoreProduct[] = [];
  cargando = false;
  error: string | null = null;

  constructor(
    protected store: ProductStoreService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.store.products$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((productos) => {
      this.productos = productos;
      this.cdr.markForCheck();
    });
    this.store.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((cargando) => {
      this.cargando = cargando;
      this.cdr.markForCheck();
    });
    this.store.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((error) => {
      this.error = error;
      this.cdr.markForCheck();
    });
    this.store.loadAll();
  }

  agregarAlCarrito(prodId: number): void {
    const prod = this.store.getById(prodId);
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
  }
}
