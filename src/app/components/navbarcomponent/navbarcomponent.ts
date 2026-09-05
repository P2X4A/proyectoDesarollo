
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-navbarcomponent',
  standalone: false,
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent implements OnInit {
  totalItems = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.carrito$.subscribe(() => {
      this.totalItems = this.cartService.contarItems();
    });
  }
}
