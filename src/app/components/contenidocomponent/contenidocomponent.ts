import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FakeStoreService } from '../../services/fake-store/fake-store.service';
import type { Product } from '../../services/fake-store/product.model';

/** Banner del carrusel hero */
interface Banner {
  titulo: string;
  subtitulo: string;
  cta: string;
  bgColor: string;
  textColor: string;
  icon: string;
  /** Imagen sin copyright (Unsplash License, hotlink permitido). */
  imagen: string;
}

/** Categoría visual */
interface CategoriaDestacada {
  nombre: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-contenidocomponent',
  standalone: false,
  templateUrl: './contenidocomponent.html',
  styleUrl: './contenidocomponent.css',
})
export class Contenidocomponent implements OnInit, OnDestroy {
  private fakeStoreService = inject(FakeStoreService);

  /* ── Carousel ── */
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

  /* ── Categorías destacadas ── */
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

  /* ── Ofertas del día (API) ── */
  ofertas: any[] = [];
  isLoadingOfertas: boolean = true;

  /* ── Búsquedas populares ── */
  busquedasPopulares: string[] = [
    'celulares', 'laptop', 'zapatillas nike', 'audífonos', 'camisas hombre',
    'nevera', 'televisor', 'tablet', 'bicicleta', 'perfumes',
    'silla gamer', 'iphone', 'samsung galaxy', 'adidas', 'xbox',
    'playstation', 'monitor', 'cámara fotos', 'smartwatch', 'escritorio',
  ];

  /* ── Índice alfabético ── */
  letras: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /* ── Ciclo de vida ── */
  ngOnInit(): void {
    this.carouselInterval = setInterval(() => this.nextBanner(), 5000);
    this.cargarOfertas();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  cargarOfertas() {
    this.fakeStoreService.getAllProducts().subscribe({
      next: (productos: Product[]) => {
        // Tomamos los primeros 8 productos y los adaptamos
        // FakeStore trae precios en dólares, simulamos conversión a pesos colombianos (* 4000)
        this.ofertas = productos.slice(0, 8).map((prod: Product) => {
            const precioConvertido = prod.price * 4000;
            // Simulamos datos extras
            const descuento = Math.floor(Math.random() * 30) + 10;
            const precioOriginal = Math.floor(precioConvertido * (1 + descuento / 100));
            return {
              id: prod.id,
              nombre: prod.title,
              precio: Math.floor(precioConvertido),
              precioOriginal: precioOriginal,
              imagen: prod.image, // FakeStoreAPI provee buenas imágenes
              descuento: descuento,
              envioGratis: prod.price > 50,
              calificacion: prod.rating?.rate || 4.5,
              vendidos: prod.rating?.count || 120
            };
          });
        this.isLoadingOfertas = false;
      },
      error: (err) => {
        console.error('Error al cargar productos de FakeStore', err);
        this.isLoadingOfertas = false;
      }
    });
  }

  /* ── Carousel ── */
  nextBanner(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.banners.length;
  }

  prevBanner(): void {
    this.carouselIndex = (this.carouselIndex - 1 + this.banners.length) % this.banners.length;
  }

  goToBanner(index: number): void {
    this.carouselIndex = index;
  }

  /* ── Utilidades ── */
  formatPrice(precio: number): string {
    return '$ ' + precio.toLocaleString('es-CO');
  }

  /** Retorna un array del tamaño del rating para renderizar estrellas */
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
