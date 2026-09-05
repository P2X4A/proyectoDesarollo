/** Rating de FakeStore API. */
export interface ProductRating {
  rate: number;
  count: number;
}

/** Producto de FakeStore API (https://fakestoreapi.com). */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

/** Payload para crear/actualizar (FakeStore acepta parcial). */
export type ProductPayload = Partial<Omit<Product, 'id' | 'rating'>> & {
  title: string;
  price: number;
};
