import useAPI from '@/composables/useAPI.ts'
import type {
  IMovieResponse
} from '@/types'

export const getPopularMovies = (): Promise<IMovieResponse> => {
  const api = useAPI()

  return api.get<IMovieResponse>('/movies/popular')
}

export const searchMovies = (query: string, page = 1): Promise<IMovieResponse> => {
  const api = useAPI()
  const params = new URLSearchParams({
    query: query,
    page: String(page)
  })

  return api.get<IMovieResponse>(`/movies/search?${params.toString()}`)
}
