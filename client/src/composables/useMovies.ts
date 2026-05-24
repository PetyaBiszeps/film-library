import {
  discoverMovies,
  getMovieFeed,
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
  const activeFeed = ref<string>('recommended')
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
      activeFeed.value = 'recommended'
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
      activeFeed.value = ''
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
      activeFeed.value = ''
    } catch {
      movies.value = []
      totalResults.value = 0
      errorMessage.value = 'Failed to sort movies.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchMovieFeed = async (type = 'recommended', page = 1): Promise<void> => {
    searchQuery.value = ''
    activeSort.value = 'recommended'
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await getMovieFeed(type, page)

      movies.value = response.results
      totalResults.value = response.totalResults
      activeFeed.value = type
    } catch (error) {
      movies.value = []
      totalResults.value = 0
      activeFeed.value = type
      errorMessage.value = isHTTPStatus(error, 501) ? 'This feed is not available yet.' : 'Failed to load movies.'
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
    activeFeed,
    hasMovies,
    moviesMeta,
    isSearchActive,
    setSearchQuery,
    fetchPopularMovies,
    fetchSearchMovies,
    fetchDiscoveredMovies,
    fetchMovieFeed,
    clearSearch
  }
}

function isHTTPStatus(error: unknown, status: number): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const value = error as { status?: number, statusCode?: number, response?: { status?: number, statusCode?: number } }

  return value.status === status || value.statusCode === status || value.response?.status === status || value.response?.statusCode === status
}
