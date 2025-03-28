<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import type { DNSRecord } from '@/types/domain'

const route = useRoute()
const domainStore = useDomainStore()

const domainId = route.params.id as string
const records = ref<DNSRecord[]>([])
const isLoading = ref(false)
const isAddingRecord = ref(false)

const newRecord = ref<DNSRecord>({
  type: 'A',
  name: '',
  content: '',
  ttl: 3600,
  priority: 0
})

const recordTypes = [
  { value: 'A', label: 'A - IPv4' },
  { value: 'AAAA', label: 'AAAA - IPv6' },
  { value: 'CNAME', label: 'CNAME - Alias' },
  { value: 'MX', label: 'MX - Mail Exchange' },
  { value: 'TXT', label: 'TXT - Text' },
  { value: 'NS', label: 'NS - Name Server' }
]

const loadRecords = async () => {
  isLoading.value = true
  try {
    records.value = await domainStore.getDNSRecords(domainId)
  } catch (error) {
    console.error('Erro ao carregar registros DNS:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAddRecord = async () => {
  try {
    await domainStore.addDNSRecord(domainId, newRecord.value)
    await loadRecords()
    isAddingRecord.value = false
    newRecord.value = {
      type: 'A',
      name: '',
      content: '',
      ttl: 3600,
      priority: 0
    }
  } catch (error) {
    console.error('Erro ao adicionar registro DNS:', error)
  }
}

const handleDeleteRecord = async (recordId: string) => {
  if (!confirm('Tem certeza que deseja excluir este registro DNS?')) return

  try {
    await domainStore.deleteDNSRecord(domainId, recordId)
    await loadRecords()
  } catch (error) {
    console.error('Erro ao excluir registro DNS:', error)
  }
}

onMounted(() => {
  loadRecords()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Configurações DNS</h1>
        <p class="mt-1 text-sm text-gray-500">Gerencie os registros DNS do seu domínio</p>
      </div>
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="isAddingRecord = true"
      >
        Adicionar Registro
      </button>
    </div>

    <!-- Lista de Registros -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="isLoading" class="text-center py-12">
          <svg
            class="animate-spin mx-auto h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conteúdo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TTL</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in records" :key="record.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ record.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.content }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.ttl }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.priority }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="handleDeleteRecord(record.id)"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Adição de Registro -->
    <div v-if="isAddingRecord" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Adicionar Registro DNS</h3>
        
        <form @submit.prevent="handleAddRecord" class="space-y-4">
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              id="type"
              v-model="newRecord.type"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option v-for="type in recordTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              v-model="newRecord.name"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="exemplo"
            />
          </div>

          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">Conteúdo</label>
            <input
              type="text"
              id="content"
              v-model="newRecord.content"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="192.168.1.1"
            />
          </div>

          <div>
            <label for="ttl" class="block text-sm font-medium text-gray-700">TTL</label>
            <input
              type="number"
              id="ttl"
              v-model="newRecord.ttl"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div v-if="newRecord.type === 'MX'">
            <label for="priority" class="block text-sm font-medium text-gray-700">Prioridade</label>
            <input
              type="number"
              id="priority"
              v-model="newRecord.priority"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="isAddingRecord = false"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 