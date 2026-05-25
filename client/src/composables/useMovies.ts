import {
  discoverMovies,
  getMovieFeed,
  searchMovies
} from '@/api/movies.ts'
import { ref, computed } from 'vue'
import type {
  IMovie,
  IMovieResponse
} from '@/types'

type ActiveMode = 'feed' | 'search' | 'discover'

const API_PAGES_PER_BATCH = 2
const movies = ref<IMovie[]>([])
const totalResults = ref<number>(0)
const currentPage = ref<number>(0)
const totalPages = ref<number>(0)
const isLoading = ref<boolean>(false)
const isLoadingMore = ref<boolean>(false)
const errorMessage = ref<string>('')
const searchQuery = ref<string>('')
const activeSort = ref<string>('recommended')
const activeFeed = ref<string>('recommended')
const activeMode = ref<ActiveMode>('feed')
const hasMovies = computed<boolean>(() => movies.value.length > 0)
const moviesMeta = computed<string>(() => `${totalResults.value} movies`)
const isSearchActive = computed<boolean>(() => searchQuery.value.trim() !== '')
const hasMoreMovies = computed<boolean>(() => currentPage.value < totalPages.value)
const hasBlockingError = computed<boolean>(() => errorMessage.value !== '' && !hasMovies.value)
const canLoadMore = computed<boolean>(() => !isLoading.value && !isLoadingMore.value && !hasBlockingError.value && hasMoreMovies.value)

const setSearchQuery = (value: string): void => {
  searchQuery.value = value
}

const fetchPopularMovies = async (): Promise<void> => {
  await fetchMovieFeed()
}

const fetchSearchMovies = async (query = searchQuery.value): Promise<void> => {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    searchQuery.value = ''
    await fetchMovieFeed()
    return
  }

  searchQuery.value = trimmedQuery
  activeMode.value = 'search'
  activeFeed.value = ''
  resetPagination()
  isLoading.value = true
  errorMessage.value = ''

  try {
    const batch = await fetchNextMovieBatch()

    movies.value = batch
  } catch {
    movies.value = []
    resetPagination()
    errorMessage.value = 'Failed to search movies.'
  } finally {
    isLoading.value = false
  }
}

const fetchDiscoveredMovies = async (sortBy = activeSort.value): Promise<void> => {
  searchQuery.value = ''
  activeMode.value = 'discover'
  activeSort.value = sortBy
  activeFeed.value = ''
  resetPagination()
  isLoading.value = true
  errorMessage.value = ''

  try {
    const batch = await fetchNextMovieBatch()

    movies.value = batch
  } catch {
    movies.value = []
    resetPagination()
    errorMessage.value = 'Failed to sort movies.'
  } finally {
    isLoading.value = false
  }
}

const fetchMovieFeed = async (type = 'recommended'): Promise<void> => {
  searchQuery.value = ''
  activeSort.value = 'recommended'
  activeFeed.value = type
  activeMode.value = 'feed'
  resetPagination()
  isLoading.value = true
  errorMessage.value = ''

  try {
    const batch = await fetchNextMovieBatch()

    movies.value = batch
  } catch (error) {
    movies.value = []
    resetPagination()
    errorMessage.value = isHTTPStatus(error, 501) ? 'This feed is not available yet.' : 'Failed to load movies.'
  } finally {
    isLoading.value = false
  }
}

const loadMoreMovies = async (): Promise<void> => {
  if (!canLoadMore.value) {
    return
  }

  isLoadingMore.value = true
  errorMessage.value = ''

  try {
    const batch = await fetchNextMovieBatch()

    movies.value = [
      ...movies.value,
      ...batch
    ]
  } catch {
    errorMessage.value = 'Failed to load more movies.'
  } finally {
    isLoadingMore.value = false
  }
}

const clearSearch = async (): Promise<void> => {
  searchQuery.value = ''
  await fetchMovieFeed()
}

export default () => {
  return {
    movies,
    totalResults,
    currentPage,
    totalPages,
    isLoading,
    isLoadingMore,
    errorMessage,
    searchQuery,
    activeSort,
    activeFeed,
    activeMode,
    hasMovies,
    moviesMeta,
    isSearchActive,
    hasMoreMovies,
    canLoadMore,
    setSearchQuery,
    fetchPopularMovies,
    fetchSearchMovies,
    fetchDiscoveredMovies,
    fetchMovieFeed,
    loadMoreMovies,
    clearSearch
  }
}

function resetPagination(): void {
  currentPage.value = 0
  totalPages.value = 0
  totalResults.value = 0
}

async function fetchNextMovieBatch(): Promise<IMovie[]> {
  const batch: IMovie[] = []

  for (let index = 0; index < API_PAGES_PER_BATCH; index++) {
    if (totalPages.value > 0 && currentPage.value >= totalPages.value) {
      break
    }

    const response = await fetchMoviePage(currentPage.value + 1)

    batch.push(...response.results)
    currentPage.value = response.page
    totalPages.value = response.totalPages
    totalResults.value = response.totalResults
  }

  return batch
}

async function fetchMoviePage(page: number): Promise<IMovieResponse> {
  switch (activeMode.value) {
    case 'search':
      return searchMovies(searchQuery.value, page)
    case 'discover':
      return discoverMovies(activeSort.value, page)
    case 'feed':
      return getMovieFeed(activeFeed.value, page)
  }
}

function isHTTPStatus(error: unknown, status: number): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const value = error as { status?: number, statusCode?: number, response?: { status?: number, statusCode?: number } }

  return value.status === status || value.statusCode === status || value.response?.status === status || value.response?.statusCode === status
}
