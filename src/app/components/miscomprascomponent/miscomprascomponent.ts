import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import type { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-miscomprascomponent',
  standalone: false,
  templateUrl: './miscomprascomponent.html',
  styleUrl: './miscomprascomponent.css',
})
export class Miscomprascomponent implements OnInit {
  private cartService = inject(CartService);

  pedidos: Pedido[] = [];

  ngOnInit(): void {
    this.pedidos = this.cartService.obtenerHistorial().slice().reverse();
  }

  formatPrice(precio: number): string {
    return '$ ' + precio.toLocaleString('es-CO');
  }
}
