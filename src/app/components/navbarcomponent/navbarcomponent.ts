import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbarcomponent',
  standalone: false,
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent implements OnInit {
  /** Texto del campo de búsqueda */
  searchQuery: string = '';

  /** Ciudad/región de entrega (estático, visual) */
  ubicacion: string = 'Colombia';

  /** Cantidad de ítems en el carrito (en vivo desde CartService) */
  cartCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.carrito$.subscribe(() => {
      this.cartCount = this.cartService.contarItems();
    });
  }

  /** Ejecuta la búsqueda */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
      // TODO: navegar a /listar-producto?q=searchQuery
    }
  }
}
