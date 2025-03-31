<!-- DomainDNS.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="space-y-4 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Registros DNS</h2>
        <button 
          v-if="!showAddForm"
          @click="showAddForm = true" 
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Adicionar Registro
        </button>
      </div>
      
      <!-- Formulário para adicionar novo registro -->
      <div v-if="showAddForm" class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-4">Adicionar Novo Registro</h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">Tipo</label>
                <select 
                  v-model="newRecord.type" 
                  id="type" 
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="A">A</option>
                  <option value="AAAA">AAAA</option>
                  <option value="CNAME">CNAME</option>
                  <option value="MX">MX</option>
                  <option value="TXT">TXT</option>
                  <option value="NS">NS</option>
                </select>
              </div>

              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
                <input 
                  type="text" 
                  v-model="newRecord.name" 
                  id="name" 
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
              </div>

              <div>
                <label for="content" class="block text-sm font-medium text-gray-700">Conteúdo</label>
                <input 
                  type="text" 
                  v-model="newRecord.content" 
                  id="content" 
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
              </div>

              <div v-if="newRecord.type === 'MX'">
                <label for="priority" class="block text-sm font-medium text-gray-700">Prioridade</label>
                <input 
                  type="number" 
                  v-model="newRecord.priority" 
                  id="priority" 
                  min="0"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>

              <div>
                <label for="ttl" class="block text-sm font-medium text-gray-700">TTL</label>
                <input 
                  type="number" 
                  v-model="newRecord.ttl" 
                  id="ttl" 
                  min="0" 
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
              </div>
            </div>

            <div class="flex flex-col sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
              <button 
                type="submit" 
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar
              </button>
              <button 
                type="button" 
                @click="showAddForm = false" 
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de registros -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="overflow-x-auto">
          <table v-if="records.length" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conteúdo</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TTL</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in records" :key="record.id">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ record.type }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-500 break-all">{{ record.name }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-500 break-all">{{ record.content }}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.ttl }}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button 
                    @click="editRecord(record)" 
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                  <button 
                    @click="deleteRecord(record.id)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="text-center py-8 sm:py-12">
            <p class="text-sm text-gray-500">Nenhum registro DNS encontrado</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { domainService } from '@/services/api'

interface DnsRecord {
  id: string
  type: string
  name: string
  content: string
  ttl: number
  priority?: number
}

export default defineComponent({
  name: 'DomainDNS',
  
  setup() {
    const route = useRoute()
    const records = ref<DnsRecord[]>([])
    const showAddForm = ref(false)
    const newRecord = ref({
      type: 'A',
      name: '',
      content: '',
      ttl: 3600,
      priority: 0
    })

    const loadRecords = async () => {
      try {
        const response = await domainService.getDnsRecords(route.params.id as string)
        records.value = response.data
      } catch (error) {
        console.error('Erro ao carregar registros DNS:', error)
      }
    }

    const handleSubmit = async () => {
      try {
        await domainService.createDnsRecord(route.params.id as string, newRecord.value)
        await loadRecords()
        showAddForm.value = false
        newRecord.value = {
          type: 'A',
          name: '',
          content: '',
          ttl: 3600,
          priority: 0
        }
      } catch (error) {
        console.error('Erro ao criar registro DNS:', error)
      }
    }

    const editRecord = (record: DnsRecord) => {
      newRecord.value = {
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        priority: record.priority || 0
      }
      showAddForm.value = true
    }

    const deleteRecord = async (recordId: string) => {
      if (!confirm('Tem certeza que deseja excluir este registro?')) return

      try {
        await domainService.deleteDnsRecord(route.params.id as string, recordId)
        await loadRecords()
      } catch (error) {
        console.error('Erro ao excluir registro DNS:', error)
      }
    }

    onMounted(loadRecords)

    return {
      records,
      showAddForm,
      newRecord,
      handleSubmit,
      editRecord,
      deleteRecord
    }
  }
})
</script>

<style scoped>
/* Remove estilos antigos pois agora estamos usando classes do Tailwind */
</style> 