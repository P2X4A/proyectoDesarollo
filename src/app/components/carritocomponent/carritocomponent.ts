import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CarritoItem } from '../../models/carrito-item';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-carritocomponent',
  standalone: false,
  styleUrl: './carritocomponent.css',
  templateUrl: './carritocomponent.html',
})
export class Carritocomponent implements OnInit {
  items: CarritoItem[] = [];
  subtotal = 0;
  envio = 8000;
  mostrarFormulario = false;
  pedidoConfirmado: Pedido | null = null;

//datos para el formulario de salida ( recibo)
  nombre = '';
  direccion = '';
  telefono = '';
  medioPago = 'tarjeta';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Cada vez que el carrito cambie (desde cualquier parte de la app),
    // esta vista se actualiza sola.
    this.cartService.carrito$.subscribe((items) => {
      this.items = items;
      this.subtotal = this.cartService.calcularSubtotal();
    });
  }

  get total(): number {
    return this.items.length > 0 ? this.subtotal + this.envio : 0;
  }

  incrementar(item: CarritoItem): void {
    this.cartService.actualizarCantidad(item.producto.id, item.cantidad + 1);
  }

  decrementar(item: CarritoItem): void {
    this.cartService.actualizarCantidad(item.producto.id, item.cantidad - 1);
  }

  eliminar(item: CarritoItem): void {
    this.cartService.eliminarProducto(item.producto.id);
  }

  vaciar(): void {
    this.cartService.vaciarCarrito();
  }

  irAConfirmar(): void {
    if (this.items.length === 0) {
      return;
    }
    this.mostrarFormulario = true;
  }

  confirmarCompra(): void {
    if (!this.nombre || !this.direccion || !this.telefono) {
      alert('Completa tus datos antes de confirmar la compra.');
      return;
    }

    const hoy = new Date();
    const estimada = new Date(hoy);
    estimada.setDate(hoy.getDate() + 5);

    this.pedidoConfirmado = this.cartService.confirmarCompra({
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      medioPago: this.medioPago,
      fechaEstimadaEntrega: estimada.toISOString(),
    });

    this.mostrarFormulario = false;
  }
}
