import { CarritoItem } from './carrito-item';

export type EstadoPedido = 'pendiente de pago' | 'esperando envío' | 'envío completado';

export interface Pedido {
  id: number;
  items: CarritoItem[];
  subtotal: number;
  envio: number;
  total: number;
  estado: EstadoPedido;
  fecha: string;
  // Datos capturados en el formulario de checkout
  nombre: string;
  direccion: string;
  telefono: string;
  medioPago: string;
  fechaEstimadaEntrega: string;
}
