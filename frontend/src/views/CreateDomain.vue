<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import type { DomainFormData } from '@/types/domain'

const router = useRouter()
const domainStore = useDomainStore()

const formData = ref<DomainFormData>({
  name: '',
  registrar: '',
  expirationDate: '',
  notes: ''
})

const errors = ref<Partial<Record<keyof DomainFormData, string>>>({})
const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!formData.value.name) {
    errors.value.name = 'O nome do domínio é obrigatório'
  } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(formData.value.name)) {
    errors.value.name = 'Nome de domínio inválido'
  }

  if (!formData.value.registrar) {
    errors.value.registrar = 'O registrador é obrigatório'
  }

  if (!formData.value.expirationDate) {
    errors.value.expirationDate = 'A data de expiração é obrigatória'
  } else {
    const expirationDate = new Date(formData.value.expirationDate)
    const today = new Date()
    if (expirationDate < today) {
      errors.value.expirationDate = 'A data de expiração não pode ser no passado'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await domainStore.createDomain(formData.value)
    router.push('/domains')
  } catch (error) {
    console.error('Erro ao criar domínio:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Novo Domínio</h1>
        <p class="mt-1 text-sm text-gray-500">Adicione um novo domínio ao seu gerenciador</p>
      </div>
      <button
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="router.push('/domains')"
      >
        Cancelar
      </button>
    </div>

    <!-- Formulário -->
    <div class="bg-white shadow rounded-lg">
      <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
        <!-- Nome do Domínio -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nome do Domínio</label>
          <div class="mt-1">
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.name }"
              placeholder="exemplo.com"
            />
            <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
          </div>
        </div>

        <!-- Registrador -->
        <div>
          <label for="registrar" class="block text-sm font-medium text-gray-700">Registrador</label>
          <div class="mt-1">
            <input
              type="text"
              id="registrar"
              v-model="formData.registrar"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.registrar }"
              placeholder="GoDaddy, Namecheap, etc."
            />
            <p v-if="errors.registrar" class="mt-2 text-sm text-red-600">{{ errors.registrar }}</p>
          </div>
        </div>

        <!-- Data de Expiração -->
        <div>
          <label for="expirationDate" class="block text-sm font-medium text-gray-700">Data de Expiração</label>
          <div class="mt-1">
            <input
              type="date"
              id="expirationDate"
              v-model="formData.expirationDate"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.expirationDate }"
            />
            <p v-if="errors.expirationDate" class="mt-2 text-sm text-red-600">{{ errors.expirationDate }}</p>
          </div>
        </div>

        <!-- Notas -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Notas</label>
          <div class="mt-1">
            <textarea
              id="notes"
              v-model="formData.notes"
              rows="3"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Adicione observações sobre o domínio..."
            ></textarea>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="router.push('/domains')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isSubmitting"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            {{ isSubmitting ? 'Criando...' : 'Criar Domínio' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 