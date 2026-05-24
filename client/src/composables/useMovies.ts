import { getPopularMovies } from '@/api/movies.ts'
import { ref, computed } from 'vue'
import type {
  IMovie
} from '@/types'

export default () => {
  const movies = ref<IMovie[]>([])
  const totalResults = ref<number>(0)
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')
  const hasMovies = computed<boolean>(() => movies.value.length > 0)
  const moviesMeta = computed<string>(() => `${totalResults.value} movies`)

  const fetchPopularMovies = async (): Promise<void> => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await getPopularMovies()

      movies.value = response.results
      totalResults.value = response.totalResults
    } catch {
      movies.value = []
      totalResults.value = 0
      errorMessage.value = 'Failed to load movies.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    movies,
    totalResults,
    isLoading,
    errorMessage,
    hasMovies,
    moviesMeta,
    fetchPopularMovies
  }
}
