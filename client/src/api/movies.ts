import useAPI from '@/composables/useAPI.ts'
import type {
  IMovieResponse
} from '@/types'

export const getPopularMovies = (): Promise<IMovieResponse> => {
  const api = useAPI()

  return api.get<IMovieResponse>('/movies/popular')
}
