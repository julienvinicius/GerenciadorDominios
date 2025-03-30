<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransferStore } from '@/stores/transfer'
import type { Transfer } from '@/types/transfer'

const router = useRouter()
const transferStore = useTransferStore()
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref<Transfer['status'] | 'all'>('all')

onMounted(async () => {
  try {
    await transferStore.fetchTransfers()
  } finally {
    loading.value = false
  }
})

const filteredTransfers = computed(() => {
  let transfers = [...(transferStore.transfers || [])]

  // Aplicar filtro de busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    transfers = transfers.filter(transfer => 
      transfer?.domain?.name?.toLowerCase().includes(query) ||
      transfer?.from_registrar?.toLowerCase().includes(query) ||
      transfer?.to_registrar?.toLowerCase().includes(query)
    )
  }

  // Aplicar filtro de status
  if (statusFilter.value !== 'all') {
    transfers = transfers.filter(transfer => transfer?.status === statusFilter.value)
  }

  return transfers
})

const getStatusColor = (status: Transfer['status']): string => {
  const colors: Record<Transfer['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return colors[status]
}

const getStatusText = (status: Transfer['status']): string => {
  const texts: Record<Transfer['status'], string> = {
    pending: 'Pendente',
    in_progress: 'Em Progresso',
    completed: 'Concluída',
    failed: 'Falhou',
    cancelled: 'Cancelada'
  }
  return texts[status]
}
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Transferências de Domínio</h1>
        <p class="mt-1 text-sm text-gray-500">Acompanhe todas as transferências de domínio</p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <router-link
          :to="{ name: 'domains-list' }"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar para Domínios
        </router-link>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="Buscar por domínio ou registrador..."
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
              <option value="pending">Pendentes</option>
              <option value="in_progress">Em Progresso</option>
              <option value="completed">Concluídas</option>
              <option value="failed">Falhas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Transferências -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else-if="filteredTransfers.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma transferência encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">Inicie uma transferência de domínio para começar.</p>
      </div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="transfer in filteredTransfers" :key="transfer.id">
          <router-link
            :to="{ name: 'transfer-status', params: { id: transfer.id } }"
            class="block hover:bg-gray-50"
          >
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <p class="text-sm font-medium text-blue-600 truncate">{{ transfer.domain?.name }}</p>
                  <span
                    :class="getStatusColor(transfer.status)"
                    class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ getStatusText(transfer.status) }}
                  </span>
                </div>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="text-sm text-gray-500">
                    Iniciado em {{ new Date(transfer.start_date).toLocaleDateString() }}
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    De: {{ transfer.from_registrar }} → Para: {{ transfer.to_registrar }}
                  </p>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>
                    Conclusão prevista: {{ new Date(transfer.estimated_completion_date).toLocaleDateString() }}
                  </p>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template> 