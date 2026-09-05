// Coincide con la forma de los datos que devuelve Fake Store API
// (https://fakestoreapi.com/products). Si el compañero 3 usa otra API,
// solo hay que ajustar este archivo y todo lo demás sigue funcionando.
export interface Producto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}
