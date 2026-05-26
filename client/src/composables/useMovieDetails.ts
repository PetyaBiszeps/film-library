import { ref } from 'vue'
import { getMovieDetails } from '@/api/movies.ts'
import type {
  IMovieDetails
} from '@/types'

export default () => {
  const movie = ref<IMovieDetails | null>(null)
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const fetchMovieDetails = async (id: number | string): Promise<void> => {
    if (String(id).trim() === '') {
      movie.value = null
      errorMessage.value = 'Invalid movie id.'
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      movie.value = await getMovieDetails(id)
    } catch (error) {
      movie.value = null
      errorMessage.value = isHTTPStatus(error, 404) ? 'Movie not found.' : 'Failed to load movie details.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    movie,
    isLoading,
    errorMessage,
    fetchMovieDetails
  }
}

function isHTTPStatus(error: unknown, status: number): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const value = error as { status?: number, statusCode?: number, response?: { status?: number, statusCode?: number } }

  return value.status === status || value.statusCode === status || value.response?.status === status || value.response?.statusCode === status
}
