<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import { useRegistrarStore } from '@/stores/registrar'
import type { DomainTransfer } from '@/types/domain'

const route = useRoute()
const router = useRouter()
const domainStore = useDomainStore()
const registrarStore = useRegistrarStore()

const loading = ref(true)
const error = ref<string | null>(null)
const submitting = ref(false)

const formData = ref({
  domainId: route.params.id as string,
  fromRegistrar: '',
  toRegistrar: '',
  notes: ''
})

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    await registrarStore.fetchRegistrars()
  } catch (err: any) {
    console.error('Erro ao carregar registradores:', err)
    error.value = err.message || 'Erro ao carregar registradores'
  } finally {
    loading.value = false
  }
})

const validateForm = () => {
  const errors: string[] = []
  
  if (!formData.value.fromRegistrar) {
    errors.push('Selecione o registrador de origem')
  }
  
  if (!formData.value.toRegistrar) {
    errors.push('Selecione o registrador de destino')
  }
  
  if (formData.value.fromRegistrar === formData.value.toRegistrar) {
    errors.push('O registrador de origem e destino não podem ser iguais')
  }
  
  return errors
}

const handleSubmit = async () => {
  try {
    const errors = validateForm()
    if (errors.length > 0) {
      error.value = errors.join(', ')
      return
    }

    submitting.value = true
    error.value = null
    
    await domainStore.createDomainTransfer(formData.value)
    router.push('/transfers')
  } catch (err: any) {
    console.error('Erro ao criar transferência:', err)
    error.value = err.message || 'Erro ao criar transferência'
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.push('/transfers')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Nova Transferência de Domínio
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button
          @click="handleCancel"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-8 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="mt-8">
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erro</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="mt-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="fromRegistrar" class="block text-sm font-medium text-gray-700">
            Registrador de Origem
          </label>
          <select
            id="fromRegistrar"
            v-model="formData.fromRegistrar"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Selecione um registrador</option>
            <option v-for="registrar in registrarStore.registrars" :key="registrar.id" :value="registrar.id">
              {{ registrar.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="toRegistrar" class="block text-sm font-medium text-gray-700">
            Registrador de Destino
          </label>
          <select
            id="toRegistrar"
            v-model="formData.toRegistrar"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Selecione um registrador</option>
            <option v-for="registrar in registrarStore.registrars" :key="registrar.id" :value="registrar.id">
              {{ registrar.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            id="notes"
            v-model="formData.notes"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

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
            :disabled="submitting"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg v-if="submitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Criando...' : 'Criar Transferência' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 