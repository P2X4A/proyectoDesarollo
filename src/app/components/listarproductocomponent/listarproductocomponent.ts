import { Component, inject, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto/producto.service';
import { CartService } from '../../services/cart.service';
import type { Producto as ProductoCarrito } from '../../models/producto';

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
  private productoService = inject(ProductoService);
  private cartService = inject(CartService);

  productos: ProductoVista[] = [];
  productosFiltrados: ProductoVista[] = [];
  terminoBusqueda: string = '';
  isLoading: boolean = true;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (productos: Producto[]) => {
        this.productos = productos.map((prod: Producto) => ({
          id: prod.id,
          nombre: prod.titulo,
          precio: prod.precio,
          categoria: prod.categoria,
          estado: 'Activo',
          imagen: prod.imagen,
        }));
        this.productosFiltrados = this.productos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.isLoading = false;
      },
    });
  }

  /** Agrega una publicación al carrito (precios ya convertidos a COP). */
  agregarAlCarrito(prod: ProductoVista): void {
    const producto: ProductoCarrito = {
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
