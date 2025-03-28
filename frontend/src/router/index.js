import { createRouter, createWebHistory } from 'vue-router'
import Domains from '../views/Domains.vue'
import DomainDetails from '../views/DomainDetails.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/domains'
    },
    {
      path: '/domains',
      name: 'domains',
      component: Domains
    },
    {
      path: '/domains/:id',
      name: 'domain-details',
      component: DomainDetails
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})

export default router 