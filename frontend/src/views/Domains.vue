<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDomainStore } from '@/stores/domain'
import type { Domain } from '@/types/domain'

const domainStore = useDomainStore()
const searchQuery = ref('')
const statusFilter = ref<Domain['status'] | 'all'>('all')
const sortBy = ref<'name' | 'expirationDate' | 'status'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const loading = ref(true)

onMounted(async () => {
  try {
    await domainStore.fetchDomains()
  } finally {
    loading.value = false
  }
})

const filteredDomains = computed(() => {
  let domains = [...(domainStore.domains || [])]

  // Aplicar filtro de busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    domains = domains.filter(domain => 
      domain?.name?.toLowerCase().includes(query) ||
      domain?.registrar?.toLowerCase().includes(query)
    )
  }

  // Aplicar filtro de status
  if (statusFilter.value !== 'all') {
    domains = domains.filter(domain => domain?.status === statusFilter.value)
  }

  // Aplicar ordenação
  domains.sort((a, b) => {
    if (!a || !b) return 0
    const multiplier = sortOrder.value === 'asc' ? 1 : -1
    switch (sortBy.value) {
      case 'name':
        return multiplier * (a.name || '').localeCompare(b.name || '')
      case 'expirationDate':
        return multiplier * (new Date(a.expirationDate || '').getTime() - new Date(b.expirationDate || '').getTime())
      case 'status':
        return multiplier * (a.status || '').localeCompare(b.status || '')
      default:
        return 0
    }
  })

  return domains
})

const getStatusColor = (status: Domain['status']): string => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: Domain['status']): string => {
  const texts = {
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
    expired: 'Expirado'
  }
  return texts[status] || 'Desconhecido'
}

const getDaysUntilExpiration = (expirationDate: string): number => {
  if (!expirationDate) return 0
  const today = new Date()
  const expiration = new Date(expirationDate)
  const diffTime = expiration.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Meus Domínios</h1>
        <p class="mt-1 text-sm text-gray-500">Gerencie todos os seus domínios em um só lugar</p>
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

    <!-- Filtros e Busca -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <!-- Busca -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar por nome ou registrador..."
              />
            </div>
          </div>

          <!-- Filtro de Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="statusFilter"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="pending">Pendentes</option>
              <option value="expired">Expirados</option>
            </select>
          </div>

          <!-- Ordenação -->
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700">Ordenar por</label>
            <div class="mt-1 flex space-x-2">
              <select
                id="sort"
                v-model="sortBy"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="name">Nome</option>
                <option value="expirationDate">Data de Expiração</option>
                <option value="status">Status</option>
              </select>
              <button
                @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="h-5 w-5"
                  :class="{ 'transform rotate-180': sortOrder === 'desc' }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Domínios -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-lg font-medium text-gray-900">
          {{ filteredDomains.length }} domínio{{ filteredDomains.length !== 1 ? 's' : '' }} encontrado{{ filteredDomains.length !== 1 ? 's' : '' }}
        </h2>
      </div>
      <div class="border-t border-gray-200">
        <!-- Loading -->
        <div v-if="loading" class="p-4 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Carregando domínios...</p>
        </div>

        <!-- Lista -->
        <ul v-else role="list" class="divide-y divide-gray-200">
          <li v-for="domain in filteredDomains" :key="domain.id" class="px-4 py-4 sm:px-6">
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
                    @click="$router.push(`/domains/${domain.id}`)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- Sem resultados -->
        <div v-if="!loading && filteredDomains.length === 0" class="p-4 text-center">
          <p class="text-sm text-gray-500">Nenhum domínio encontrado</p>
        </div>
      </div>
    </div>
  </div>
</template> 