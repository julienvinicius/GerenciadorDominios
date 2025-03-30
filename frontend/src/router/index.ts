import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        requiresAuth: true,
        title: 'Dashboard'
      }
    },
    {
      path: '/domains',
      name: 'domains',
      component: () => import('@/views/Domains.vue'),
      meta: {
        requiresAuth: true,
        title: 'Meus Domínios'
      }
    },
    {
      path: '/domains/create',
      name: 'create-domain',
      component: () => import('@/views/CreateDomain.vue'),
      meta: {
        requiresAuth: true,
        title: 'Novo Domínio'
      }
    },
    {
      path: '/domains/:id',
      name: 'domain-details',
      component: () => import('@/views/DomainDetails.vue'),
      meta: {
        requiresAuth: true,
        title: 'Detalhes do Domínio'
      }
    },
    {
      path: '/domains/:id/dns',
      name: 'domain-dns',
      component: () => import('@/views/DNS.vue'),
      meta: {
        requiresAuth: true,
        title: 'Configurações DNS'
      }
    },
    {
      path: '/transfers',
      name: 'transfers',
      component: () => import('@/views/Transfers.vue'),
      meta: {
        requiresAuth: true,
        title: 'Transferências'
      }
    },
    {
      path: '/security',
      name: 'security',
      component: () => import('@/views/Security.vue'),
      meta: {
        requiresAuth: true,
        title: 'Segurança'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: {
        requiresAuth: true,
        title: 'Configurações'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Login',
        requiresGuest: true
      }
    }
  ]
})

// Middleware de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  // Verifica o estado de autenticação apenas se necessário
  if (requiresAuth || requiresGuest) {
    await authStore.checkAuth()
  }

  // Redireciona com base no estado de autenticação
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

// Middleware para atualizar o título da página
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Gerenciador de Domínios`
  next()
})

export default router 