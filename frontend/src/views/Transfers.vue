<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDomainStore } from '@/stores/domain'
import type { DomainTransfer } from '@/types/domain'
import { useRoute } from 'vue-router'

const route = useRoute()
const domainStore = useDomainStore()

const domainId = route.params.id as string

const transfers = ref<DomainTransfer[]>([])
const isLoading = ref(false)
const isAddingTransfer = ref(false)
const error = ref<string | null>(null)

const newTransfer = ref<DomainTransfer>({
  id: '',
  domainId: '',
  fromRegistrar: '',
  toRegistrar: '',
  status: 'pending',
  startDate: new Date().toISOString().split('T')[0],
  estimatedCompletionDate: '',
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const loadTransfers = async () => {
  isLoading.value = true
  try {
    error.value = null
    transfers.value = await domainStore.getDomainTransfers(domainId)
  } catch (err: any) {
    console.error('Erro ao carregar transferências:', err)
    error.value = err.message || 'Erro ao carregar transferências'
  } finally {
    isLoading.value = false
  }
}

const handleAddTransfer = async () => {
  try {
    await domainStore.createDomainTransfer(newTransfer.value)
    await loadTransfers()
    isAddingTransfer.value = false
    newTransfer.value = {
      id: '',
      domainId: '',
      fromRegistrar: '',
      toRegistrar: '',
      status: 'pending',
      startDate: new Date().toISOString().split('T')[0],
      estimatedCompletionDate: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Erro ao criar transferência:', error)
  }
}

const handleCancelTransfer = async (transferId: string) => {
  if (!confirm('Tem certeza que deseja cancelar esta transferência?')) return

  try {
    await domainStore.cancelDomainTransfer(domainId, transferId)
    await loadTransfers()
  } catch (error) {
    console.error('Erro ao cancelar transferência:', error)
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    completed: 'Concluída',
    failed: 'Falhou',
    cancelled: 'Cancelada'
  }
  return texts[status as keyof typeof texts] || status
}

onMounted(() => {
  loadTransfers()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Transferências de Domínio</h1>
        <p class="mt-1 text-sm text-gray-500">Gerencie as transferências de domínio entre registradores</p>
      </div>
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="isAddingTransfer = true"
      >
        Nova Transferência
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="mt-8 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="mt-8 text-center">
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erro ao carregar transferências</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Transferências -->
    <div v-else class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domínio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">De</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Para</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Início</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previsão</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transfer in transfers" :key="transfer.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ transfer.domainId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transfer.fromRegistrar }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transfer.toRegistrar }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusColor(transfer.status)"
                  >
                    {{ getStatusText(transfer.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(transfer.startDate).toLocaleDateString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(transfer.estimatedCompletionDate).toLocaleDateString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    v-if="transfer.status === 'pending' || transfer.status === 'in_progress'"
                    class="text-red-600 hover:text-red-900"
                    @click="handleCancelTransfer(transfer.id)"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Nova Transferência -->
    <div v-if="isAddingTransfer" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Nova Transferência de Domínio</h3>
        
        <form @submit.prevent="handleAddTransfer" class="space-y-4">
          <div>
            <label for="domainId" class="block text-sm font-medium text-gray-700">Domínio</label>
            <input
              type="text"
              id="domainId"
              v-model="newTransfer.domainId"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="exemplo.com"
            />
          </div>

          <div>
            <label for="fromRegistrar" class="block text-sm font-medium text-gray-700">Registrador Atual</label>
            <input
              type="text"
              id="fromRegistrar"
              v-model="newTransfer.fromRegistrar"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="GoDaddy"
            />
          </div>

          <div>
            <label for="toRegistrar" class="block text-sm font-medium text-gray-700">Novo Registrador</label>
            <input
              type="text"
              id="toRegistrar"
              v-model="newTransfer.toRegistrar"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Namecheap"
            />
          </div>

          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              id="startDate"
              v-model="newTransfer.startDate"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="estimatedCompletionDate" class="block text-sm font-medium text-gray-700">Previsão de Conclusão</label>
            <input
              type="date"
              id="estimatedCompletionDate"
              v-model="newTransfer.estimatedCompletionDate"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              id="notes"
              v-model="newTransfer.notes"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Adicione observações sobre a transferência..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="isAddingTransfer = false"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar Transferência
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 