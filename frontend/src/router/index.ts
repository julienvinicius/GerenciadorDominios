import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/domains'
    },
    {
      path: '/domains',
      name: 'domains',
      component: () => import('@/views/Domains.vue'),
      children: [
        {
          path: ':id',
          name: 'domain-details',
          component: () => import('@/views/DomainDetails.vue')
        },
        {
          path: ':id/dns',
          name: 'domain-dns',
          component: () => import('@/views/DomainDNS.vue')
        },
        {
          path: 'create',
          name: 'create-domain',
          component: () => import('@/views/CreateDomain.vue')
        }
      ]
    },
    {
      path: '/transfers',
      name: 'transfers',
      component: () => import('@/views/Transfers.vue'),
      children: [
        {
          path: 'create',
          name: 'create-transfer',
          component: () => import('@/views/CreateTransfer.vue')
        },
        {
          path: ':id',
          name: 'transfer-status',
          component: () => import('@/views/TransferStatus.vue')
        }
      ]
    },
    {
      path: '/security',
      name: 'security',
      component: () => import('@/views/Security.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue')
    }
  ]
})

// Middleware para atualizar o título da página
router.beforeEach((to) => {
  // Monta o título completo da página
  const baseTitle = 'Gerenciador de Domínios'
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle
})

export default router 