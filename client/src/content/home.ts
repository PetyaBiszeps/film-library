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
    },
    sort: {
      label: 'Sort',
      title: 'Sort by',
      items: [{
        key: 'recommended',
        label: 'Recommended'
      }, {
        key: 'newest',
        label: 'Newest'
      }, {
        key: 'rating',
        label: 'Rating'
      }, {
        key: 'title-az',
        label: 'Title A-Z'
      }]
    },
    recommended: {
      title: 'Recommended'
    }
  }
} as const
