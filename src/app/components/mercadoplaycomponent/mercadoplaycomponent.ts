import { Component, inject, OnInit } from '@angular/core';
import { OmdbService } from '../../services/omdb/omdb.service';
import type {
  OmdbMovieShort,
  OmdbSearchResponse,
} from '../../services/omdb/omdb.models';

@Component({
  selector: 'app-mercadoplaycomponent',
  standalone: false,
  templateUrl: './mercadoplaycomponent.html',
  styleUrl: './mercadoplaycomponent.css',
})
export class Mercadoplaycomponent implements OnInit {
  private omdbService = inject(OmdbService);

  peliculas: OmdbMovieShort[] = [];
  isLoading: boolean = true;
  mensajeError: string = '';

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    // Búsqueda inicial del catálogo (palabra popular con muchos resultados)
    this.omdbService.searchMovies('Avengers').subscribe({
      next: (response: OmdbSearchResponse) => {
        if (response.Response === 'True' && response.Search) {
          this.peliculas = response.Search;
        } else {
          this.mensajeError = response.Error || 'Sin resultados para el catálogo.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar películas de OMDb:', error);
        this.mensajeError = 'No se pudo cargar el catálogo. Revisa tu conexión.';
        this.isLoading = false;
      },
    });
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
