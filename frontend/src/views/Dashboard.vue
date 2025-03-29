<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useDomainStore } from '@/stores/domain'
import type { Domain } from '@/types/domain'

const domainStore = useDomainStore()

onMounted(async () => {
  await domainStore.fetchDomains()
})

const getStatusColor = (status: Domain['status']): string => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-gray-100 text-gray-800'
  }
  return colors[status]
}

const getStatusText = (status: Domain['status']): string => {
  const texts = {
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
    expired: 'Expirado'
  }
  return texts[status]
}

const getDaysUntilExpiration = (expirationDate: string): number => {
  const today = new Date()
  const expiration = new Date(expirationDate)
  const diffTime = expiration.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const expiringDomains = computed(() => {
  return domainStore.domains
    .filter(domain => {
      const daysUntilExpiration = getDaysUntilExpiration(domain.expirationDate)
      return daysUntilExpiration <= 30 && daysUntilExpiration > 0
    })
    .sort((a, b) => getDaysUntilExpiration(a.expirationDate) - getDaysUntilExpiration(b.expirationDate))
})
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h1>
        <p class="mt-1 text-sm text-gray-500">Aqui está um resumo dos seus domínios</p>
      </div>
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="$router.push('/domains/create')"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Domínio
      </button>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total de Domínios</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ domainStore.domains.length }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Domínios Ativos</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ domainStore.getActiveDomains }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Próximos a Expirar</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ expiringDomains.length }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Domínios Expirados</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ domainStore.domains.filter(d => d.status === 'expired').length }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Domínios -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-lg font-medium text-gray-900">Últimos Domínios</h2>
      </div>
      <div class="border-t border-gray-200">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="domain in domainStore.domains.slice(0, 5)" :key="domain.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-900">{{ domain.name }}</h3>
                  <p class="text-sm text-gray-500">{{ domain.registrar }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusColor(domain.status)]">
                  {{ getStatusText(domain.status) }}
                </span>
                <div class="text-sm text-gray-500">
                  Expira em {{ getDaysUntilExpiration(domain.expirationDate) }} dias
                </div>
                <div class="flex space-x-2">
                  <button
                    class="text-blue-600 hover:text-blue-900"
                    @click="$router.push(`/domains/${domain.id}`)"
                  >
                    Detalhes
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="domainStore.deleteDomain(domain.id.toString())"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="px-4 py-4 sm:px-6 border-t border-gray-200">
        <button
          class="text-sm font-medium text-blue-600 hover:text-blue-500"
          @click="$router.push('/domains')"
        >
          Ver todos os domínios
        </button>
      </div>
    </div>

    <!-- Alertas de Expiração -->
    <div v-if="expiringDomains.length > 0" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-lg font-medium text-gray-900">Alertas de Expiração</h2>
      </div>
      <div class="border-t border-gray-200">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="domain in expiringDomains" :key="domain.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-900">{{ domain.name }}</h3>
                  <p class="text-sm text-gray-500">Expira em {{ getDaysUntilExpiration(domain.expirationDate) }} dias</p>
                </div>
              </div>
              <button
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
                @click="$router.push(`/domains/${domain.id}`)"
              >
                Renovar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 