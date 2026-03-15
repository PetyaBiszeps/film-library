import {
  createRouter,
  createWebHistory
} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      guest: true
    },
    children: [{
      path: '',
      name: 'landing',
      component: () => import('@/views/LandingView.vue')
    }]
  }]
})

export default router
