import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OmdbService } from '../../services/omdb/omdb.service';
import type { OmdbMovieDetail } from '../../services/omdb/omdb.models';

interface Pelicula {
  titulo: string;
  trailer: string;
  detalle: OmdbMovieDetail;
}

const CATALOGO = [
  { titulo: 'The Avengers', trailer: 'eOrNdBpGMv8' },
  { titulo: 'Avengers: Endgame', trailer: 'TcMBFSGVi1c' },
  { titulo: 'Iron Man', trailer: '8ugaeA-nMTc' },
  { titulo: 'Guardians of the Galaxy', trailer: 'd96cjJhvlMA' },
  { titulo: 'Black Panther', trailer: 'xjDjIWPwcPU' },
  { titulo: 'Spider-Man: No Way Home', trailer: 'JfVOs4VSpmA' },
  { titulo: 'The Dark Knight', trailer: 'EXeTwQWrcwY' },
  { titulo: 'Joker', trailer: 'zAGVQLHvwOY' },
  { titulo: 'Inception', trailer: 'YoHD9XEInc0' },
  { titulo: 'Interstellar', trailer: 'zSWdZVtXT7E' },
  { titulo: 'The Matrix', trailer: 'vKQi3bBA1y8' },
  { titulo: 'Oppenheimer', trailer: 'uYPbbksJxIg' },
];

@Component({
  selector: 'app-mercadoplaycomponent',
  standalone: false,
  templateUrl: './mercadoplaycomponent.html',
  styleUrl: './mercadoplaycomponent.css',
})
export class Mercadoplaycomponent implements OnInit {
  peliculas: Pelicula[] = [];
  resultados: Pelicula[] = [];
  terminoBusqueda = '';
  isLoading = true;
  mensajeError = '';

  seleccionada: Pelicula | null = null;
  videoUrl: SafeResourceUrl | null = null;

  constructor(
    private omdbService: OmdbService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    CATALOGO.forEach((item) => {
      this.omdbService.getMovieByTitle(item.titulo).subscribe({
        next: (detalle: OmdbMovieDetail) => {
          if (detalle.Response === 'True') {
            this.peliculas.push({
              titulo: item.titulo,
              trailer: item.trailer,
              detalle,
            });
          }
          this.isLoading = false;
          this.filtrar();
        },
        error: () => {
          this.isLoading = false;
          this.mensajeError = 'No se pudo cargar el catálogo. Revisa tu conexión.';
          this.cdr.markForCheck();
        },
      });
    });
  }

  filtrar(): void {
    const q = this.terminoBusqueda.trim().toLowerCase();
    this.resultados = this.peliculas.filter((p) => p.titulo.toLowerCase().includes(q));
    this.cdr.markForCheck();
  }

  reproducir(pelicula: Pelicula): void {
    this.seleccionada = pelicula;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/' + pelicula.trailer,
    );
  }

  cerrarReproductor(): void {
    this.seleccionada = null;
    this.videoUrl = null;
  }

  posterDe(pelicula: Pelicula): string {
    if (pelicula.detalle.Poster && pelicula.detalle.Poster !== 'N/A') {
      return pelicula.detalle.Poster;
    }
    return `https://picsum.photos/seed/${pelicula.detalle.imdbID}/300/450`;
  }
}
