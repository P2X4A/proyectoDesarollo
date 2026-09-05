import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { OmdbMovieDetail, OmdbSearchResponse } from './omdb.models';

/**
 * Servicio de películas (OMDb API).
 * Patrón replicado del proyecto de referencia USB (`services/`,
 * `inject(HttpClient)`, `providedIn: 'root'`), con mejoras:
 * - URL base + API key centralizadas en `environment` (HTTPS, evita mixed-content).
 * - Respuestas tipadas en `omdb.models.ts`.
 * - `HttpParams` en vez de concatenar strings.
 *
 * Ubicación correcta: `src/app/services/omdb/` (subcarpeta por servicio,
 * igual que `src/app/components/<nombre>/`).
 */
@Injectable({ providedIn: 'root' })
export class OmdbService {
  private cliente = inject(HttpClient);
  private readonly URL_BASE: string = environment.omdbBaseUrl;
  private readonly API_KEY: string = environment.omdbApiKey;

  /** Busca películas por título. Ej: searchMovies('Avengers') */
  searchMovies(query: string): Observable<OmdbSearchResponse> {
    const params = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('s', query.trim())
      .set('type', 'movie');

    return this.cliente
      .get<OmdbSearchResponse>(this.URL_BASE, { params })
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** Obtiene el detalle de una película por su IMDB ID. Ej: 'tt3896198' */
  getMovieById(id: string): Observable<OmdbMovieDetail> {
    const params = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('i', id.trim())
      .set('plot', 'short');

    return this.cliente
      .get<OmdbMovieDetail>(this.URL_BASE, { params })
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** Obtiene el detalle por título exacto. */
  getMovieByTitle(title: string): Observable<OmdbMovieDetail> {
    const params = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('t', title.trim())
      .set('plot', 'short');

    return this.cliente
      .get<OmdbMovieDetail>(this.URL_BASE, { params })
      .pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(err: unknown): Observable<never> {
    console.error('[OmdbService] Error en la petición a OMDb:', err);
    return throwError(() => err);
  }
}
