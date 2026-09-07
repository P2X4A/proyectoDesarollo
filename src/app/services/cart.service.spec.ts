import { beforeEach, describe, expect, it } from 'vitest';
import { CartService } from './cart.service';
import type { Producto } from '../models/producto';

function makeProduct(id: number, price: number): Producto {
  return {
    id,
    title: `Producto ${id}`,
    price,
    description: `Descripción ${id}`,
    category: 'Tecnología',
    image: 'https://example.com/img.jpg',
  };
}

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    service = new CartService();
  });

  it('empieza con el carrito vacío', () => {
    expect(service.obtenerCarrito()).toEqual([]);
    expect(service.contarItems()).toBe(0);
    expect(service.calcularSubtotal()).toBe(0);
  });

  it('agrega productos y acumula cantidades del mismo id', () => {
    service.agregarProducto(makeProduct(1, 100000));
    service.agregarProducto(makeProduct(1, 100000), 2);

    expect(service.contarItems()).toBe(3);
    expect(service.calcularSubtotal()).toBe(300000);
  });

  it('actualiza cantidades y elimina al llegar a cero', () => {
    service.agregarProducto(makeProduct(1, 50000), 2);
    service.actualizarCantidad(1, 5);
    expect(service.contarItems()).toBe(5);

    service.actualizarCantidad(1, 0);
    expect(service.obtenerCarrito()).toEqual([]);
  });

  it('elimina un producto y vacía el carrito', () => {
    service.agregarProducto(makeProduct(1, 10000));
    service.agregarProducto(makeProduct(2, 20000));
    service.eliminarProducto(1);

    expect(service.obtenerCarrito().map((i) => i.producto.id)).toEqual([2]);

    service.vaciarCarrito();
    expect(service.obtenerCarrito()).toEqual([]);
  });

  it('emite cambios por carrito$ (para el badge del navbar)', () => {
    const emisiones: number[][] = [];
    service.carrito$.subscribe((items) => emisiones.push(items.map((i) => i.producto.id)));

    service.agregarProducto(makeProduct(7, 1000));

    expect(emisiones.length).toBeGreaterThan(1);
    expect(emisiones[emisiones.length - 1]).toEqual([7]);
  });

  it('persiste el carrito en localStorage entre instancias', () => {
    service.agregarProducto(makeProduct(3, 75000), 2);

    const otraInstancia = new CartService();
    expect(otraInstancia.contarItems()).toBe(2);
    expect(otraInstancia.calcularSubtotal()).toBe(150000);
  });

  it('confirma la compra: crea pedido, lo guarda en historial y vacía', () => {
    service.agregarProducto(makeProduct(1, 100000), 2);

    const pedido = service.confirmarCompra({
      nombre: 'Ana Pérez',
      direccion: 'Calle 100 #7-33',
      telefono: '3001234567',
      medioPago: 'pse',
      fechaEstimadaEntrega: new Date().toISOString(),
    });

    expect(pedido.total).toBe(200000 + 8000);
    expect(pedido.estado).toBe('pendiente de pago');
    expect(service.obtenerCarrito()).toEqual([]);

    const historial = service.obtenerHistorial();
    expect(historial).toHaveLength(1);
    expect(historial[0].nombre).toBe('Ana Pérez');
  });

  it('actualiza el estado de un pedido del historial', () => {
    service.agregarProducto(makeProduct(1, 50000));
    const pedido = service.confirmarCompra({
      nombre: 'Luis',
      direccion: 'Cra 7',
      telefono: '3010000000',
      medioPago: 'tarjeta',
      fechaEstimadaEntrega: new Date().toISOString(),
    });

    service.actualizarEstadoPedido(pedido.id, 'envío completado');

    expect(service.obtenerHistorial()[0].estado).toBe('envío completado');
  });
});
