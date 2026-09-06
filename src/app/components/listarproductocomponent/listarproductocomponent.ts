import { Component, inject, OnInit } from '@angular/core';
import { FakeStoreService } from '../../services/fake-store/fake-store.service';
import { CartService } from '../../services/cart.service';
import type { Product } from '../../services/fake-store/product.model';
import type { Producto } from '../../models/producto';

interface ProductoVista {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  estado: string;
  imagen: string;
}

@Component({
  selector: 'app-listarproductocomponent',
  standalone: false,
  templateUrl: './listarproductocomponent.html',
  styleUrl: './listarproductocomponent.css',
})
export class Listarproductocomponent implements OnInit {
  private fakeStoreService = inject(FakeStoreService);
  private cartService = inject(CartService);

  productos: ProductoVista[] = [];
  productosFiltrados: ProductoVista[] = [];
  terminoBusqueda: string = '';
  isLoading: boolean = true;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.fakeStoreService.getAllProducts().subscribe({
      next: (productos: Product[]) => {
        // FakeStore trae precios en dólares, simulamos a pesos colombianos (* 4000)
        this.productos = productos.map((prod: Product) => ({
          id: prod.id,
          nombre: prod.title,
          precio: Math.floor(prod.price * 4000),
          categoria: prod.category,
          estado: 'Activo', // Simulamos estado
          imagen: prod.image,
        }));
        this.productosFiltrados = this.productos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos de FakeStore', err);
        this.isLoading = false;
      },
    });
  }

  /** Agrega una publicación al carrito (precios ya convertidos a COP). */
  agregarAlCarrito(prod: ProductoVista): void {
    const producto: Producto = {
      id: prod.id,
      title: prod.nombre,
      price: prod.precio,
      description: prod.nombre,
      category: prod.categoria,
      image: prod.imagen,
    };
    this.cartService.agregarProducto(producto);
  }

  filtrarProducto(): void{
    const q = this.terminoBusqueda.trim().toLowerCase();
    this.productosFiltrados = this.productos.filter(p => p.nombre.toLowerCase().includes(q));
  }

}
