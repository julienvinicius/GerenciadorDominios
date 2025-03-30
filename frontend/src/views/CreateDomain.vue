<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import { useRegistrarStore } from '@/stores/registrar'
import { useTemplateStore } from '@/stores/template'
import type { DomainFormData } from '@/types/domain'

const router = useRouter()
const domainStore = useDomainStore()
const registrarStore = useRegistrarStore()
const templateStore = useTemplateStore()

const loading = ref(false)
const errors = ref<Record<string, string>>({})
const backendError = ref<string | null>(null)

const formData = ref<DomainFormData>({
  name: '',
  registrarId: '',
  templateId: '',
  expirationDate: '',
  notes: ''
})

// Carregar registradores e templates ao montar o componente
const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      registrarStore.fetchRegistrars(),
      templateStore.fetchTemplates()
    ])
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
    backendError.value = 'Erro ao carregar dados necessários. Por favor, tente novamente.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.value.name) {
    newErrors.name = 'O nome do domínio é obrigatório'
  } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(formData.value.name)) {
    newErrors.name = 'Nome de domínio inválido'
  }

  if (!formData.value.registrarId) {
    newErrors.registrarId = 'O registrador é obrigatório'
  }

  if (!formData.value.expirationDate) {
    newErrors.expirationDate = 'A data de expiração é obrigatória'
  } else {
    const expDate = new Date(formData.value.expirationDate)
    const today = new Date()
    if (expDate < today) {
      newErrors.expirationDate = 'A data de expiração não pode ser no passado'
    }
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  backendError.value = null
  try {
    await domainStore.createDomain(formData.value)
    router.push('/domains')
  } catch (err: any) {
    console.error('Erro ao criar domínio:', err)
    backendError.value = err.response?.data?.message || 'Erro ao criar domínio. Por favor, tente novamente.'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/domains')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Novo Domínio</h2>
          <p class="mt-1 text-sm text-gray-500">Preencha os dados abaixo para criar um novo domínio.</p>
        </div>
      </div>

      <!-- Erro do Backend -->
      <div v-if="backendError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ backendError }}</p>
      </div>

      <!-- Loading -->
      <div v-if="loading && !formData.name" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500">Carregando dados...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Nome do domínio -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nome do domínio</label>
          <div class="mt-1">
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              :class="{ 'border-red-300': errors.name }"
            />
          </div>
          <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Registrador -->
        <div>
          <label for="registrarId" class="block text-sm font-medium text-gray-700">Registrador</label>
          <div class="mt-1">
            <select
              id="registrarId"
              v-model="formData.registrarId"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              :class="{ 'border-red-300': errors.registrarId }"
            >
              <option value="">Selecione um registrador</option>
              <option v-for="registrar in registrarStore.registrars" :key="registrar.id" :value="registrar.id">
                {{ registrar.name }}
              </option>
            </select>
          </div>
          <p v-if="errors.registrarId" class="mt-2 text-sm text-red-600">{{ errors.registrarId }}</p>
        </div>

        <!-- Template DNS -->
        <div>
          <label for="templateId" class="block text-sm font-medium text-gray-700">Template DNS</label>
          <div class="mt-1">
            <select
              id="templateId"
              v-model="formData.templateId"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">Selecione um template (opcional)</option>
              <option v-for="template in templateStore.templates" :key="template.id" :value="template.id">
                {{ template.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Data de expiração -->
        <div>
          <label for="expirationDate" class="block text-sm font-medium text-gray-700">Data de expiração</label>
          <div class="mt-1">
            <input
              type="date"
              id="expirationDate"
              v-model="formData.expirationDate"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              :class="{ 'border-red-300': errors.expirationDate }"
            />
          </div>
          <p v-if="errors.expirationDate" class="mt-2 text-sm text-red-600">{{ errors.expirationDate }}</p>
        </div>

        <!-- Observações -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Observações</label>
          <div class="mt-1">
            <textarea
              id="notes"
              v-model="formData.notes"
              rows="3"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="handleCancel"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span v-if="loading">Salvando...</span>
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 