import { ChangeDetectorRef, Component, DestroyRef, OnInit, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductStoreService } from '../../services/product-store/product-store.service';
import { CartService } from '../../services/cart.service';
import type { Producto } from '../../models/producto';

interface Banner {
  titulo: string;
  subtitulo: string;
  cta: string;
  bgColor: string;
  textColor: string;
  icon: string;
  imagen: string;
}

interface CategoriaDestacada {
  nombre: string;
  icono: string;
  color: string;
}

interface Oferta {
  id: number;
  nombre: string;
  precio: number;
  precioOriginal: number;
  imagen: string;
  descuento: number;
  envioGratis: boolean;
  calificacion: number;
  vendidos: number;
}

@Component({
  selector: 'app-contenidocomponent',
  standalone: false,
  templateUrl: './contenidocomponent.html',
  styleUrl: './contenidocomponent.css',
})
export class Contenidocomponent implements OnInit, OnDestroy {
  private store = inject(ProductStoreService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  agregados = new Set<number>();

  carouselIndex = 0;
  private carouselInterval: ReturnType<typeof setInterval> | null = null;

  banners: Banner[] = [
    {
      titulo: 'Tecnología al mejor precio',
      subtitulo: 'Hasta 40% de descuento en electrónica y celulares',
      cta: 'Ver ofertas',
      bgColor: 'rgb(255, 230, 0)',
      textColor: 'rgb(51, 51, 51)',
      icon: 'fa-solid fa-laptop',
      imagen:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
    },
    {
      titulo: 'Moda para todos los estilos',
      subtitulo: 'Envío gratis en tu primera compra',
      cta: 'Explorar moda',
      bgColor: 'rgb(52, 131, 250)',
      textColor: 'rgb(255, 255, 255)',
      icon: 'fa-solid fa-shirt',
      imagen:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      titulo: 'Hogar & Jardín',
      subtitulo: 'Decora tu espacio con las mejores marcas',
      cta: 'Ver productos',
      bgColor: 'rgb(30, 185, 100)',
      textColor: 'rgb(255, 255, 255)',
      icon: 'fa-solid fa-house',
      imagen:
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80',
    },
  ];

  categoriasDestacadas: CategoriaDestacada[] = [
    { nombre: 'Electrónica',  icono: 'fa-solid fa-mobile-screen',      color: 'rgb(52, 131, 250)' },
    { nombre: 'Ropa',         icono: 'fa-solid fa-shirt',              color: 'rgb(233, 64, 87)' },
    { nombre: 'Hogar',        icono: 'fa-solid fa-house',              color: 'rgb(30, 185, 100)' },
    { nombre: 'Deportes',     icono: 'fa-solid fa-dumbbell',           color: 'rgb(255, 130, 0)' },
    { nombre: 'Vehículos',    icono: 'fa-solid fa-car',                color: 'rgb(150, 50, 200)' },
    { nombre: 'Videojuegos',  icono: 'fa-solid fa-gamepad',            color: 'rgb(80, 40, 180)' },
    { nombre: 'Herramientas', icono: 'fa-solid fa-screwdriver-wrench', color: 'rgb(120, 80, 40)' },
    { nombre: 'Belleza',      icono: 'fa-solid fa-spa',                color: 'rgb(230, 80, 180)' },
  ];

  ofertas: Oferta[] = [];
  isLoadingOfertas = false;

  busquedasPopulares: string[] = [
    'air fryer', 'aire acondicionado', 'airpods', 'alexa', 'apple watch',
    'audifonos', 'ipad', 'iphone 16', 'jbl', 'lavadora',
    'lenovo', 'motorola', 'nevera', 'nintendo switch', 'playstation 5',
    'redmi', 'samsung a54', 'silla gamer', 'smartwatch', 'xiaomi',
  ];

  letras: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  ngOnInit(): void {
    this.carouselInterval = setInterval(() => this.nextBanner(), 5000);

    this.store.products$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((productos) => {
      this.ofertas = productos.slice(0, 8).map((prod) => {
        const descuento = Math.floor(Math.random() * 30) + 10;
        const precioOriginal = Math.floor(prod.price * (1 + descuento / 100));
        return {
          id: prod.id,
          nombre: prod.title,
          precio: prod.price,
          precioOriginal,
          imagen: prod.image,
          descuento,
          envioGratis: prod.price > 200000,
          calificacion: 4.5,
          vendidos: 120,
        };
      });
      this.cdr.markForCheck();
    });
    this.store.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((cargando) => {
      this.isLoadingOfertas = cargando;
      this.cdr.markForCheck();
    });

    this.store.loadAll();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextBanner(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.banners.length;
  }

  recargarOfertas(): void {
    this.store.loadAll(true);
  }

  prevBanner(): void {
    this.carouselIndex = (this.carouselIndex - 1 + this.banners.length) % this.banners.length;
  }

  goToBanner(index: number): void {
    this.carouselIndex = index;
  }

  formatPrice(precio: number): string {
    return '$ ' + precio.toLocaleString('es-CO');
  }

  agregarAlCarrito(oferta: { id: number; nombre: string; precio: number; imagen: string }): void {
    const producto: Producto = {
      id: oferta.id,
      title: oferta.nombre,
      price: oferta.precio,
      description: oferta.nombre,
      category: 'Ofertas',
      image: oferta.imagen,
    };
    this.cartService.agregarProducto(producto);
    this.agregados.add(oferta.id);
    setTimeout(() => {
      this.agregados.delete(oferta.id);
      this.cdr.markForCheck();
    }, 1500);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
