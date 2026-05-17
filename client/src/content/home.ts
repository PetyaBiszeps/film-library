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
    recommended: {
      title: 'Recommended',
      meta: '12 movies',
      items: [{
        title: 'The Silent Orbit',
        meta: '2023 • Sci-Fi'
      }, {
        title: 'North of Summer',
        meta: '2021 • Drama'
      }, {
        title: 'Marble City',
        meta: '2019 • Thriller'
      }, {
        title: 'Echoes Harbor',
        meta: '2024 • Mystery'
      }]
    }
  }
} as const
