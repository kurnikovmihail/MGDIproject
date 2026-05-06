import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    const isInitialNavigation = !from.name

    if (savedPosition) {
      return savedPosition
    }

    if (isInitialNavigation) {
      return { top: 0, left: 0, behavior: 'auto' }
    }

    if (to.hash) {
      const mobileOffset = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
      return {
        el: to.hash,
        top: mobileOffset ? 128 : 96,
        behavior: 'smooth'
      }
    }

    return { top: 0, left: 0, behavior: 'smooth' }
  }
})

export default router
