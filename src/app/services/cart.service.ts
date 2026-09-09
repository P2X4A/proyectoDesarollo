import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { CarritoItem } from '../models/carrito-item';
import { EstadoPedido, Pedido } from '../models/pedido';

const CARRITO_KEY = 'carrito';
const HISTORIAL_KEY = 'historialPedidos';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private carritoSubject = new BehaviorSubject<CarritoItem[]>(this.cargarCarrito());
  carrito$: Observable<CarritoItem[]> = this.carritoSubject.asObservable();

  private cargarCarrito(): CarritoItem[] {
    const data = localStorage.getItem(CARRITO_KEY);
    return data ? JSON.parse(data) : [];
  }

  private guardarCarrito(items: CarritoItem[]): void {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
    this.carritoSubject.next(items);
  }

  obtenerCarrito(): CarritoItem[] {
    return this.carritoSubject.value;
  }

  agregarProducto(producto: Producto, cantidad: number = 1): void {
    const items = [...this.obtenerCarrito()];
    const existente = items.find((i) => i.producto.id === producto.id);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      items.push({ producto, cantidad });
    }

    this.guardarCarrito(items);
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    const items = this.obtenerCarrito()
      .map((i) => (i.producto.id === productoId ? { ...i, cantidad } : i))
      .filter((i) => i.cantidad > 0);

    this.guardarCarrito(items);
  }

  eliminarProducto(productoId: number): void {
    const items = this.obtenerCarrito().filter((i) => i.producto.id !== productoId);
    this.guardarCarrito(items);
  }

  vaciarCarrito(): void {
    this.guardarCarrito([]);
  }

  calcularSubtotal(): number {
    return this.obtenerCarrito().reduce((acc, i) => acc + i.producto.price * i.cantidad, 0);
  }

  contarItems(): number {
    return this.obtenerCarrito().reduce((acc, i) => acc + i.cantidad, 0);
  }

  confirmarCompra(datos: {
    nombre: string;
    direccion: string;
    telefono: string;
    medioPago: string;
    fechaEstimadaEntrega: string;
  }): Pedido {
    const items = this.obtenerCarrito();
    const subtotal = this.calcularSubtotal();
    const envio = subtotal > 0 ? 8000 : 0;

    const pedido: Pedido = {
      id: Date.now(),
      items,
      subtotal,
      envio,
      total: subtotal + envio,
      estado: 'pendiente de pago',
      fecha: new Date().toISOString(),
      ...datos,
    };

    this.guardarEnHistorial(pedido);
    this.vaciarCarrito();
    return pedido;
  }

  private guardarEnHistorial(pedido: Pedido): void {
    const historial = this.obtenerHistorial();
    historial.push(pedido);
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
  }

  obtenerHistorial(): Pedido[] {
    const data = localStorage.getItem(HISTORIAL_KEY);
    return data ? JSON.parse(data) : [];
  }

  actualizarEstadoPedido(pedidoId: number, estado: EstadoPedido): void {
    const historial = this.obtenerHistorial().map((p) =>
      p.id === pedidoId ? { ...p, estado } : p,
    );
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
  }
}
