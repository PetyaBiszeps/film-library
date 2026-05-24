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
