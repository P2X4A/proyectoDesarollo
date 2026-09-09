import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductStoreService } from '../../services/product-store/product-store.service';
import { CartService } from '../../services/cart.service';
import { filterProducts } from '../../services/product-store/product-filter';
import type { StoreProduct } from '../../services/product-store/store-product.model';
import type { Producto } from '../../models/producto';

@Component({
  selector: 'app-buscarcomponent',
  standalone: false,
  templateUrl: './buscarcomponent.html',
  styleUrl: './buscarcomponent.css',
})
export class Buscarcomponent implements OnInit {
  query = '';
  cargando = false;
  error: string | null = null;
  resultados: StoreProduct[] = [];

  agregados = new Set<number>();

  private catalogo: StoreProduct[] = [];

  constructor(
    protected store: ProductStoreService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.store.products$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((productos) => {
      this.catalogo = productos;
      this.actualizarResultados();
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

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.query = (params.get('q') ?? '').trim();
      this.actualizarResultados();
    });
  }

  private actualizarResultados(): void {
    this.resultados = filterProducts(this.catalogo, this.query);
    this.cdr.markForCheck();
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
    setTimeout(() => {
      this.agregados.delete(id);
      this.cdr.markForCheck();
    }, 1500);
  }
}
