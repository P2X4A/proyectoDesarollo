import { Component, inject, OnInit } from '@angular/core';
import { ProductStoreService } from '../../services/product-store/product-store.service';
import { CartService } from '../../services/cart.service';
import type { Producto } from '../../models/producto';

@Component({
  selector: 'app-listarproductocomponent',
  standalone: false,
  templateUrl: './listarproductocomponent.html',
  styleUrl: './listarproductocomponent.css',
})
export class Listarproductocomponent implements OnInit {
  protected store = inject(ProductStoreService);
  private cartService = inject(CartService);

  ngOnInit() {
    this.store.loadAll();
  }

  /** Agrega una publicación al carrito (precios del store ya están en COP). */
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
