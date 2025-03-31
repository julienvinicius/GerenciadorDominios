<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import type { Domain } from '@/types/domain'

const router = useRouter()
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
      domain?.registrar_id?.toLowerCase().includes(query)
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
        return multiplier * (new Date(a.expiration_date || '').getTime() - new Date(b.expiration_date || '').getTime())
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

const getDaysUntilExpiration = (expiration_date: string): number => {
  if (!expiration_date) return 0
  const today = new Date()
  const expiration = new Date(expiration_date)
  const diffTime = expiration.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const handleCreateDomain = () => {
  router.push({ name: 'create-domain' })
}
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Meus Domínios</h1>
        <p class="mt-1 text-sm text-gray-500">Gerencie todos os seus domínios em um só lugar</p>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link
          :to="{ name: 'transfers-list' }"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Transferências
        </router-link>
        <button
          @click="handleCreateDomain"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Novo Domínio
        </button>
      </div>
    </div>

    <!-- Filtros e Busca -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div class="mt-1 flex rounded-md shadow-sm">
              <select
                id="sort"
                v-model="sortBy"
                class="flex-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-l-md"
              >
                <option value="name">Nome</option>
                <option value="expirationDate">Data de Expiração</option>
                <option value="status">Status</option>
              </select>
              <button
                @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="h-5 w-5"
                  :class="{ 'transform rotate-180': sortOrder === 'desc' }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Domínios -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else-if="filteredDomains.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum domínio encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Comece criando um novo domínio.</p>
        <div class="mt-6">
          <button
            @click="handleCreateDomain"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Novo Domínio
          </button>
        </div>
      </div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="domain in filteredDomains" :key="domain.id">
          <router-link
            :to="{ name: 'domain-details', params: { id: domain.id } }"
            class="block hover:bg-gray-50"
          >
            <div class="px-4 py-4 sm:px-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <p class="text-sm font-medium text-blue-600 truncate">{{ domain.name }}</p>
                  <span
                    :class="getStatusColor(domain.status)"
                    class="inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1"
                  >
                    {{ getStatusText(domain.status) }}
                  </span>
                </div>
                <div class="flex-shrink-0">
                  <p class="inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1"
                    :class="{
                      'bg-red-100 text-red-800': getDaysUntilExpiration(domain.expiration_date) <= 30,
                      'bg-yellow-100 text-yellow-800': getDaysUntilExpiration(domain.expiration_date) <= 60,
                      'bg-green-100 text-green-800': getDaysUntilExpiration(domain.expiration_date) > 60
                    }"
                  >
                    {{ getDaysUntilExpiration(domain.expiration_date) }} dias para expirar
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  {{ domain.registrar_id }}
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template> 