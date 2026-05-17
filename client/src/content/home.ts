export default {
  header: {
    title: 'Home',
    description: 'Find films for tonight, keep your watchlist close.'
  },
  main: {
    filters: {
      title: 'Quick filters',
      items: [{
        key: 'recommended',
        label: 'Recommended'
      }, {
        key: 'trending',
        label: 'Trending'
      }, {
        key: 'new',
        label: 'New'
      }]
    }
  }
} as const
