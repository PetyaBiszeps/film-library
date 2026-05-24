import {
  discoverMovies,
  getPopularMovies,
  searchMovies
} from '@/api/movies.ts'
import { ref, computed } from 'vue'
import type {
  IMovie
} from '@/types'

export default () => {
  const movies = ref<IMovie[]>([])
  const totalResults = ref<number>(0)
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')
  const searchQuery = ref<string>('')
  const activeSort = ref<string>('recommended')
  const hasMovies = computed<boolean>(() => movies.value.length > 0)
  const moviesMeta = computed<string>(() => `${totalResults.value} movies`)
  const isSearchActive = computed<boolean>(() => searchQuery.value.trim() !== '')

  const setSearchQuery = (value: string): void => {
    searchQuery.value = value
  }

  const fetchPopularMovies = async (): Promise<void> => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await getPopularMovies()

      movies.value = response.results
      totalResults.value = response.totalResults
      activeSort.value = 'recommended'
    } catch {
      movies.value = []
      totalResults.value = 0
      errorMessage.value = 'Failed to load movies.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchSearchMovies = async (query = searchQuery.value, page = 1): Promise<void> => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      searchQuery.value = ''
      await fetchPopularMovies()
      return
    }

    searchQuery.value = trimmedQuery
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await searchMovies(trimmedQuery, page)

      movies.value = response.results
      totalResults.value = response.totalResults
    } catch {
      movies.value = []
      totalResults.value = 0
      errorMessage.value = 'Failed to search movies.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchDiscoveredMovies = async (sortBy = activeSort.value, page = 1): Promise<void> => {
    searchQuery.value = ''
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await discoverMovies(sortBy, page)

      movies.value = response.results
      totalResults.value = response.totalResults
      activeSort.value = sortBy
    } catch {
      movies.value = []
      totalResults.value = 0
      errorMessage.value = 'Failed to sort movies.'
    } finally {
      isLoading.value = false
    }
  }

  const clearSearch = async (): Promise<void> => {
    searchQuery.value = ''
    await fetchPopularMovies()
  }

  return {
    movies,
    totalResults,
    isLoading,
    errorMessage,
    searchQuery,
    activeSort,
    hasMovies,
    moviesMeta,
    isSearchActive,
    setSearchQuery,
    fetchPopularMovies,
    fetchSearchMovies,
    fetchDiscoveredMovies,
    clearSearch
  }
}
