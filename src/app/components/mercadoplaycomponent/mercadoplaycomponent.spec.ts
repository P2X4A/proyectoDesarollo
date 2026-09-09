import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { Mercadoplaycomponent } from './mercadoplaycomponent';
import { OmdbService } from '../../services/omdb/omdb.service';
import type { OmdbMovieDetail, OmdbSearchResponse } from '../../services/omdb/omdb.models';

const SEARCH_OK: OmdbSearchResponse = {
  Response: 'True',
  Search: [
    { Title: 'Avengers', Year: '2012', imdbID: 'tt0848228', Type: 'movie', Poster: 'N/A' },
  ],
};

const DETAIL_OK: OmdbMovieDetail = {
  Title: 'Avengers',
  Year: '2012',
  Rated: 'PG-13',
  Released: '2012',
  Runtime: '143 min',
  Genre: 'Action',
  Director: 'Joss Whedon',
  Actors: 'Robert Downey Jr.',
  Plot: 'Héroes salvan el mundo.',
  Poster: 'N/A',
  imdbRating: '8.0',
  imdbID: 'tt0848228',
  Type: 'movie',
  Response: 'True',
};

describe('Mercadoplaycomponent', () => {
  let component: Mercadoplaycomponent;
  let fixture: ComponentFixture<Mercadoplaycomponent>;
  let omdb: { searchMovies: ReturnType<typeof vi.fn>; getMovieById: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    omdb = {
      searchMovies: vi.fn().mockReturnValue(of(SEARCH_OK)),
      getMovieById: vi.fn().mockReturnValue(of(DETAIL_OK)),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [{ provide: OmdbService, useValue: omdb }],
      declarations: [Mercadoplaycomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Mercadoplaycomponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // NOTA: fakeAsync no está disponible en este setup (falta zone-testing.js),
  // así que el debounce de 400ms se prueba con espera real.
  const ESPERA_DEBOUNCE = 500;

  it('carga el catálogo inicial tras el debounce', async () => {
    fixture.detectChanges(); // ngOnInit + startWith
    expect(component.isLoading).toBe(true);

    await new Promise((r) => setTimeout(r, ESPERA_DEBOUNCE));

    expect(omdb.searchMovies).toHaveBeenCalledWith('Avengers');
    expect(component.peliculas).toHaveLength(1);
    expect(component.isLoading).toBe(false);
  });

  it('busca al escribir (debounce) y muestra error si no hay resultados', async () => {
    omdb.searchMovies.mockReturnValue(of({ Response: 'False', Error: 'Movie not found!' }));
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, ESPERA_DEBOUNCE));

    component.searchControl.setValue('zzzznada');
    await new Promise((r) => setTimeout(r, ESPERA_DEBOUNCE));

    expect(component.peliculas).toHaveLength(0);
    expect(component.mensajeError).toBe('Movie not found!');
  });

  it('verDetalle carga la ficha y cerrarDetalle la limpia', () => {
    component.verDetalle(SEARCH_OK.Search![0]);

    expect(omdb.getMovieById).toHaveBeenCalledWith('tt0848228');
    expect(component.detalle?.Title).toBe('Avengers');
    expect(component.isLoadingDetalle).toBe(false);

    component.cerrarDetalle();
    expect(component.detalle).toBeNull();
  });

  it('posterDe usa Picsum cuando OMDb no trae póster', () => {
    expect(component.posterDe(SEARCH_OK.Search![0])).toContain('picsum.photos/seed/tt0848228');
    expect(
      component.posterDe({ ...SEARCH_OK.Search![0], Poster: 'https://example.com/p.jpg' }),
    ).toBe('https://example.com/p.jpg');
  });
});
