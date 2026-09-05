/** Película en formato corto (respuesta de búsqueda `s=` de OMDb). */
export interface OmdbMovieShort {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

/** Respuesta de búsqueda de OMDb (`?s=...`). */
export interface OmdbSearchResponse {
  Search?: OmdbMovieShort[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

/** Detalle completo de película (respuesta `?i=...`). */
export interface OmdbMovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Type: string;
  Response: 'True' | 'False';
  Error?: string;
}
