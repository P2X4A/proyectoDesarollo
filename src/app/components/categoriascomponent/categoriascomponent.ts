import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductStoreService } from '../../services/product-store/product-store.service';
import { CartService } from '../../services/cart.service';
import { filterByCategory } from '../../services/product-store/product-filter';
import type { StoreProduct } from '../../services/product-store/store-product.model';
import type { Producto } from '../../models/producto';

@Component({
  selector: 'app-categoriascomponent',
  standalone: false,
  templateUrl: './categoriascomponent.html',
  styleUrl: './categoriascomponent.css',
})
export class Categoriascomponent implements OnInit {
  categoriaSeleccionada: string | null = null;
  cargando = false;
  error: string | null = null;
  productos: StoreProduct[] = [];

  imagenesRotas = new Set<string>();
  agregados = new Set<number>();

  private catalogo: StoreProduct[] = [];

  categorias = [
    { nombre: 'Vehículos', icono: 'fa-solid fa-car', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Supermercado', icono: 'fa-solid fa-basket-shopping', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Tecnología', icono: 'fa-solid fa-laptop', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Electrodomésticos', icono: 'fa-solid fa-blender', img: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Hogar y Muebles', icono: 'fa-solid fa-couch', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Deportes y Fitness', icono: 'fa-solid fa-dumbbell', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Belleza y Cuidado Personal', icono: 'fa-solid fa-spa', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Moda', icono: 'fa-solid fa-shirt', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Juegos y Juguetes', icono: 'fa-solid fa-gamepad', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop' },
  ];

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
      this.actualizarProductos();
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

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.categoriaSeleccionada = params.get('nombre');
      this.actualizarProductos();
    });
  }

  private actualizarProductos(): void {
    this.productos = this.categoriaSeleccionada
      ? filterByCategory(this.catalogo, this.categoriaSeleccionada)
      : [];
    this.cdr.markForCheck();
  }

  onImgError(nombre: string): void {
    this.imagenesRotas.add(nombre);
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
