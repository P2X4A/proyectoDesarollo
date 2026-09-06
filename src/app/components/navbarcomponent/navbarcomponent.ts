import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.carrito$.subscribe(() => {
      this.cartCount = this.cartService.contarItems();
    });
  }

  /** Ejecuta la búsqueda */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/listar-producto'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
}
