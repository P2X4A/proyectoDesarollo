// Esta parte de la clase, coincide con la forma de los datos que devuelve Fake Store API
// (https://fakestoreapi.com/products).
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
