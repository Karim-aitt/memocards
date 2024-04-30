import {
  createRouter,
  createWebHistory
} from 'vue-router'
import HomeView from '../views/HomeView.vue';
import {
  useUserStore
} from '@/stores/useUserStore';




const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoryView.vue'),
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
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/:catchAll(.*)', // Esta ruta coincidirá con cualquier ruta no definida previamente
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue') // La vista de "no encontrada"
    }

  ]
});



router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  
  // Si no hay token, simplemente pasa al siguiente guardia o ruta.
  if (!token) {
    next();
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}users/user`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    const { role_name } = await response.json();

    // Verifica si el usuario tiene permiso para acceder a la ruta 'admin'.
    if (to.name === 'admin' && role_name !== 'admin') {
      alert('No estás autorizado');
      next('/');
    } else {
      next(); // Llama a next() después de todas las comprobaciones.
    }
  } catch (error) {
    console.error('Error durante la verificación del token:', error);
    next('/'); // En caso de error, redirige al usuario a la página de inicio.
  }
});

export default router