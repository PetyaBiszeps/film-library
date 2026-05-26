import {
  createRouter,
  createWebHistory
} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      guest: true
    },
    children: [{
      path: '',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    }, {
      path: '/movies/:id',
      name: 'MovieDetails',
      component: () => import('@/views/MovieDetailsView.vue')
    }, {
      path: '/bookmarks',
      name: 'Bookmarks',
      component: () => import('@/views/BookmarksView.vue')
    }, {
      path: '/collections',
      name: 'Collections',
      component: () => import('@/views/CollectionsView.vue')
    }, {
      path: '/history',
      name: 'History',
      component: () => import('@/views/HistoryView.vue')
    }]
  }]
})

export default router
