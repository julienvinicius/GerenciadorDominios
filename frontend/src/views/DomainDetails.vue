<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import type { Domain, DomainFormData } from '@/types/domain'

const route = useRoute()
const router = useRouter()
const domainStore = useDomainStore()
const isEditing = ref(false)
const domain = ref<Domain | null>(null)
const formData = ref<DomainFormData>({
  name: '',
  registrar: '',
  expirationDate: '',
  notes: ''
})

onMounted(async () => {
  const domainId = Number(route.params.id)
  const foundDomain = domainStore.getDomainById(domainId)
  if (foundDomain) {
    domain.value = foundDomain
    formData.value = {
      name: foundDomain.name,
      registrar: foundDomain.registrar,
      expirationDate: foundDomain.expirationDate,
      notes: foundDomain.notes || ''
    }
  } else {
    router.push('/domains')
  }
})

const handleSave = async () => {
  if (!domain.value) return
  
  try {
    await domainStore.updateDomain(domain.value.id, formData.value)
    isEditing.value = false
  } catch (error) {
    console.error('Erro ao atualizar domínio:', error)
  }
}

const handleDelete = async () => {
  if (!domain.value) return
  
  if (confirm('Tem certeza que deseja excluir este domínio?')) {
    try {
      await domainStore.deleteDomain(domain.value.id)
      router.push('/domains')
    } catch (error) {
      console.error('Erro ao excluir domínio:', error)
    }
  }
}

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
</script>

<template>
  <div v-if="domain" class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ domain.name }}</h1>
        <p class="mt-1 text-sm text-gray-500">Detalhes e configurações do domínio</p>
      </div>
      <div class="flex space-x-3">
        <button
          v-if="!isEditing"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="isEditing = true"
        >
          Editar
        </button>
        <button
          v-if="!isEditing"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="handleDelete"
        >
          Excluir
        </button>
        <button
          v-if="isEditing"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="handleSave"
        >
          Salvar
        </button>
        <button
          v-if="isEditing"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="isEditing = false"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Informações do Domínio -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Nome do Domínio -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nome do Domínio</label>
            <div class="mt-1">
              <input
                v-if="isEditing"
                type="text"
                id="name"
                v-model="formData.name"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p v-else class="mt-2 text-sm text-gray-900">{{ domain.name }}</p>
            </div>
          </div>

          <!-- Registrador -->
          <div>
            <label for="registrar" class="block text-sm font-medium text-gray-700">Registrador</label>
            <div class="mt-1">
              <input
                v-if="isEditing"
                type="text"
                id="registrar"
                v-model="formData.registrar"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p v-else class="mt-2 text-sm text-gray-900">{{ domain.registrar }}</p>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <div class="mt-1">
              <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusColor(domain.status)]">
                {{ getStatusText(domain.status) }}
              </span>
            </div>
          </div>

          <!-- Data de Expiração -->
          <div>
            <label for="expirationDate" class="block text-sm font-medium text-gray-700">Data de Expiração</label>
            <div class="mt-1">
              <input
                v-if="isEditing"
                type="date"
                id="expirationDate"
                v-model="formData.expirationDate"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p v-else class="mt-2 text-sm text-gray-900">
                {{ new Date(domain.expirationDate).toLocaleDateString() }}
                ({{ getDaysUntilExpiration(domain.expirationDate) }} dias restantes)
              </p>
            </div>
          </div>

          <!-- Notas -->
          <div class="sm:col-span-2">
            <label for="notes" class="block text-sm font-medium text-gray-700">Notas</label>
            <div class="mt-1">
              <textarea
                v-if="isEditing"
                id="notes"
                v-model="formData.notes"
                rows="3"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
              <p v-else class="mt-2 text-sm text-gray-900">{{ domain.notes || 'Nenhuma nota' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Registros DNS -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Registros DNS</h2>
          <button
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="$router.push(`/domains/${domain.id}/dns`)"
          >
            Gerenciar DNS
          </button>
        </div>
        <div class="mt-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conteúdo</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TTL</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="record in domain.dnsRecords" :key="record.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ record.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.content }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.ttl }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 