import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoryView.vue'),
      // children: [
      //   {
      //     path: '/comunidad'
      //     component: 'C'
      //   }
      // ]
    },
    {
      path: '/mazos',
      name: 'Mazos',
      component: () => import('../views/DecksView.vue')
    },
    {
      path: '/mazos/:categoryId/:categoryName',
      name: 'Mazo',
      component: () => import('../views/DecksView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue')
    },
    {
      path: '/cards',
      name: 'cartas',
      component: () => import('../views/CardsView.vue')
    },
    {
      path: '/cards/:deckId/:deckName',
      name: 'carta',
      component: () => import('../views/CardsView.vue')
    },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: () => import('../components/Register.vue')
    // },

  ]
})

export default router
