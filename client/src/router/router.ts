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
    children: []
  }]
})

export default router
