export interface IMovieResponse {
  page: number
  results: IMovie[]
  totalPages: number
  totalResults: number
}

export interface IMovie {
  id: number
  tmdbId: number
  title: string
  year?: string
  genre?: string
  posterUrl?: string
  rating?: number
}

export interface IMovieDetails {
  id: number
  tmdbId: number
  title: string
  year?: string
  genres?: string[]
  runtime?: number
  releaseDate?: string
  posterUrl?: string
  backdropUrl?: string
  rating?: number
  overview?: string
}
