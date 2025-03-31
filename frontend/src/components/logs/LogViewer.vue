<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Logs do Sistema</h3>
      <div class="flex space-x-2">
        <select v-model="selectedLevel" class="input-field">
          <option value="">Todos os níveis</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <button @click="refreshLogs" class="btn-secondary">
          Atualizar
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nível
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mensagem
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in filteredLogs" :key="log.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(log.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': log.level === 'info',
                    'bg-yellow-100 text-yellow-800': log.level === 'warning',
                    'bg-red-100 text-red-800': log.level === 'error'
                  }"
                >
                  {{ log.level }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ log.message }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const selectedLevel = ref('')
const logs = ref([])

const filteredLogs = computed(() => {
  if (!selectedLevel.value) return logs.value
  return logs.value.filter(log => log.level === selectedLevel.value)
})

const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
}

const refreshLogs = async () => {
  try {
    const response = await fetch('/api/logs')
    const data = await response.json()
    logs.value = data
  } catch (error) {
    console.error('Erro ao carregar logs:', error)
  }
}

// Carregar logs inicialmente
refreshLogs()
</script> 