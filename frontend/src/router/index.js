import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/domains',
    name: 'Domains',
    component: () => import('../views/Domains.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/domains/create',
    name: 'CreateDomain',
    component: () => import('../views/CreateDomain.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/domains/:id',
    name: 'DomainDetails',
    component: () => import('../views/DomainDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarda de navegação para autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 