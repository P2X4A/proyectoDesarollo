import { Producto } from './producto';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}
