import { Component, inject, OnInit } from '@angular/core';
import { FakeStoreService } from '../../services/fake-store/fake-store.service';
import type { Product } from '../../services/fake-store/product.model';

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

  productos: ProductoVista[] = [];
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos de FakeStore', err);
        this.isLoading = false;
      },
    });
  }
}
