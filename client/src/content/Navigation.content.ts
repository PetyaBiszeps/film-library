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
  }]
} as const
