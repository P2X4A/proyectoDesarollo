import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import type { Product, ProductPayload } from './product.model';

@Injectable({ providedIn: 'root' })
export class FakeStoreService {
  private cliente = inject(HttpClient);
  private readonly URL_BASE: string = environment.fakeStoreBaseUrl;

  getAllProducts(): Observable<Product[]> {
    return this.cliente
      .get<Product[]>(this.URL_BASE)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getProductById(id: number): Observable<Product> {
    return this.cliente
      .get<Product>(`${this.URL_BASE}/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getCategories(): Observable<string[]> {
    return this.cliente
      .get<string[]>(`${this.URL_BASE}/categories`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.cliente
      .get<Product[]>(`${this.URL_BASE}/category/${encodeURIComponent(category)}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.cliente
      .post<Product>(this.URL_BASE, payload)
      .pipe(catchError((err) => this.handleError(err)));
  }

  updateProduct(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    return this.cliente
      .put<Product>(`${this.URL_BASE}/${id}`, payload)
      .pipe(catchError((err) => this.handleError(err)));
  }

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
