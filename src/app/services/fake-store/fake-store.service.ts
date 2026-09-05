import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import type { Product, ProductPayload } from './product.model';

/**
 * Servicio de productos (Fake Store API).
 * Patrón replicado del proyecto de referencia USB (`services/`,
 * `inject(HttpClient)`, `providedIn: 'root'`), con mejoras:
 * - URL base centralizada en `environment`.
 * - Respuestas tipadas en `product.model.ts`.
 * - CRUD completo: FakeStore soporta GET/POST/PUT/DELETE (persistencia simulada).
 *
 * Ubicación correcta: `src/app/services/fake-store/` (subcarpeta por servicio,
 * igual que `src/app/components/<nombre>/`).
 */
@Injectable({ providedIn: 'root' })
export class FakeStoreService {
  private cliente = inject(HttpClient);
  private readonly URL_BASE: string = environment.fakeStoreBaseUrl;

  /** GET /products — lista todos los productos. */
  getAllProducts(): Observable<Product[]> {
    return this.cliente
      .get<Product[]>(this.URL_BASE)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** GET /products/:id — un producto por ID. */
  getProductById(id: number): Observable<Product> {
    return this.cliente
      .get<Product>(`${this.URL_BASE}/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** GET /products/categories — lista de categorías. */
  getCategories(): Observable<string[]> {
    return this.cliente
      .get<string[]>(`${this.URL_BASE}/categories`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** GET /products/category/:category — productos por categoría. */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.cliente
      .get<Product[]>(`${this.URL_BASE}/category/${encodeURIComponent(category)}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** POST /products — crear producto (FakeStore lo simula, devuelve el objeto con id). */
  createProduct(payload: ProductPayload): Observable<Product> {
    return this.cliente
      .post<Product>(this.URL_BASE, payload)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** PUT /products/:id — actualizar producto. */
  updateProduct(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    return this.cliente
      .put<Product>(`${this.URL_BASE}/${id}`, payload)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** DELETE /products/:id — eliminar producto. */
  deleteProduct(id: number): Observable<Product> {
    return this.cliente
      .delete<Product>(`${this.URL_BASE}/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(err: unknown): Observable<never> {
    console.error('[FakeStoreService] Error en la petición a FakeStore:', err);
    return throwError(() => err);
  }
}
