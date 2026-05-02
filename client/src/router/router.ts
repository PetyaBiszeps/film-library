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
      name: 'library',
      component: () => import('@/views/LibraryView.vue')
    }]
  }]
})

export default router
