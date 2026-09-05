import { Component } from '@angular/core';

@Component({
  selector: 'app-navbarcomponent',
  standalone: false,
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent {
  /** Texto del campo de búsqueda */
  searchQuery: string = '';

  /** Ciudad/región de entrega (estático, visual) */
  ubicacion: string = 'Colombia';

  /** Cantidad de ítems en el carrito */
  cartCount: number = 0;

  /** Ejecuta la búsqueda */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
      // TODO: navegar a /listar-producto?q=searchQuery
    }
  }
}
