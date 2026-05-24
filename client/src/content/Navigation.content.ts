import filterIcon from '@/assets/svgs/filter.svg'
import userIcon from '@/assets/svgs/user.svg'

export default {
  brand: {
    title: 'Flicks'
  },
  actions: {
    filter: filterIcon,
    user: userIcon
  },
  tabs: [{
    name: 'Home',
    href: '/'
  }, {
    name: 'Bookmarks',
    href: '/bookmarks'
  }, {
    name: 'Collections',
    href: '/collections'
  }, {
    name: 'History',
    href: '/history'
  }],
  filters: [{
    label: 'Continue watching',
    active: true
  }, {
    label: 'Recommended',
    active: false
  }, {
    label: 'New releases',
    active: false
  }, {
    label: 'Trending now',
    active: false
  }, {
    label: 'Recently added',
    active: false
  }, {
    label: 'Friends watched',
    active: false
  }],
  stats: [{
    label: 'Total',
    value: '1,247',
    active: false
  }, {
    label: 'Bookmarks',
    value: '86',
    active: false
  }, {
    label: 'Watched',
    value: '312',
    active: true
  }]
} as const
