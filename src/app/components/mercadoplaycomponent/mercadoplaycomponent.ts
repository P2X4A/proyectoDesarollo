import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { OmdbService } from '../../services/omdb/omdb.service';
import type {
  OmdbMovieDetail,
  OmdbMovieShort,
  OmdbSearchResponse,
} from '../../services/omdb/omdb.models';

const BUSQUEDA_INICIAL = 'Avengers';
const EMPTY_SEARCH: OmdbSearchResponse = { Response: 'False', Error: 'Sin término de búsqueda.' };

@Component({
  selector: 'app-mercadoplaycomponent',
  standalone: false,
  templateUrl: './mercadoplaycomponent.html',
  styleUrl: './mercadoplaycomponent.css',
})
export class Mercadoplaycomponent implements OnInit {
  private omdbService = inject(OmdbService);
  private destroyRef = inject(DestroyRef);

  /** Búsqueda reactiva: espera 400ms tras cada tecla y cancela la petición anterior. */
  searchControl = new FormControl(BUSQUEDA_INICIAL, { nonNullable: true });

  peliculas: OmdbMovieShort[] = [];
  isLoading = true;
  mensajeError = '';

  /** Detalle de la película seleccionada (null = ningún detalle abierto). */
  detalle: OmdbMovieDetail | null = null;
  isLoadingDetalle = false;
  errorDetalle = '';

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        map((term) => term.trim()),
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          this.mensajeError = '';
          this.detalle = null;
        }),
        switchMap((term) =>
          term
            ? this.omdbService.searchMovies(term).pipe(catchError(() => of(EMPTY_SEARCH)))
            : of(EMPTY_SEARCH),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response: OmdbSearchResponse) => {
        if (response.Response === 'True' && response.Search) {
          this.peliculas = response.Search;
        } else {
          this.peliculas = [];
          this.mensajeError = response.Error || 'Sin resultados para tu búsqueda.';
        }
        this.isLoading = false;
      });
  }

  /** Carga el detalle de una película (ficha completa). */
  verDetalle(pelicula: OmdbMovieShort): void {
    this.detalle = null;
    this.errorDetalle = '';
    this.isLoadingDetalle = true;

    this.omdbService
      .getMovieById(pelicula.imdbID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail: OmdbMovieDetail) => {
          if (detail.Response === 'True') {
            this.detalle = detail;
          } else {
            this.errorDetalle = detail.Error || 'No se pudo cargar el detalle.';
          }
          this.isLoadingDetalle = false;
        },
        error: () => {
          this.errorDetalle = 'No se pudo cargar el detalle. Revisa tu conexión.';
          this.isLoadingDetalle = false;
        },
      });
  }

  cerrarDetalle(): void {
    this.detalle = null;
    this.errorDetalle = '';
  }

  /**
   * Imagen a mostrar: si OMDb no trae póster ("N/A"), se usa una
   * imagen sin copyright de Picsum con seed estable por película.
   */
  posterDe(pelicula: OmdbMovieShort): string {
    if (pelicula.Poster && pelicula.Poster !== 'N/A') {
      return pelicula.Poster;
    }
    return `https://picsum.photos/seed/${pelicula.imdbID}/300/450`;
  }
}
