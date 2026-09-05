import { Producto } from './producto';

// Un renglón del carrito: un producto + cuántas unidades pidió el usuario
export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}
