import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import type { OmdbMovieDetail, OmdbSearchResponse } from './omdb.models';

@Injectable({ providedIn: 'root' })
export class OmdbService {
  private cliente = inject(HttpClient);
  private readonly URL_BASE: string = environment.omdbBaseUrl;
  private readonly API_KEY: string = environment.omdbApiKey;

  searchMovies(query: string): Observable<OmdbSearchResponse> {
    const params = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('s', query.trim())
      .set('type', 'movie');

    return this.cliente
      .get<OmdbSearchResponse>(this.URL_BASE, { params })
      .pipe(catchError((err) => this.handleError(err)));
  }

  getMovieById(id: string): Observable<OmdbMovieDetail> {
    const params = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('i', id.trim())
      .set('plot', 'short');

    return this.cliente
      .get<OmdbMovieDetail>(this.URL_BASE, { params })
      .pipe(catchError((err) => this.handleError(err)));
  }

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
