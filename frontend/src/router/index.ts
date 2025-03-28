import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: {
            title: 'Dashboard'
          }
        },
        {
          path: 'domains',
          name: 'domains',
          component: () => import('@/views/Domains.vue'),
          meta: {
            title: 'Meus Domínios'
          }
        },
        {
          path: 'domains/create',
          name: 'create-domain',
          component: () => import('@/views/CreateDomain.vue'),
          meta: {
            title: 'Novo Domínio'
          }
        },
        {
          path: 'domains/:id',
          name: 'domain-details',
          component: () => import('@/views/DomainDetails.vue'),
          meta: {
            title: 'Detalhes do Domínio'
          }
        },
        {
          path: 'domains/:id/dns',
          name: 'domain-dns',
          component: () => import('@/views/DNS.vue'),
          meta: {
            title: 'Configurações DNS'
          }
        },
        {
          path: 'transfers',
          name: 'transfers',
          component: () => import('@/views/Transfers.vue'),
          meta: {
            title: 'Transferências'
          }
        },
        {
          path: 'security',
          name: 'security',
          component: () => import('@/views/Security.vue'),
          meta: {
            title: 'Segurança'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Login'
      }
    }
  ]
})

// Middleware para atualizar o título da página
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Gerenciador de Domínios`
  next()
})

export default router 