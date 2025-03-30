<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ props.registrar ? 'Editar Registrador' : 'Novo Registrador' }}
        </h3>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Nome -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :class="{ 'border-red-300': errors.name }"
          />
          <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- URL da API -->
        <div>
          <label for="apiUrl" class="block text-sm font-medium text-gray-700">URL da API</label>
          <input
            type="text"
            id="apiUrl"
            v-model="formData.apiUrl"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :class="{ 'border-red-300': errors.apiUrl }"
          />
          <p v-if="errors.apiUrl" class="mt-2 text-sm text-red-600">{{ errors.apiUrl }}</p>
        </div>

        <!-- Chave da API -->
        <div>
          <label for="apiKey" class="block text-sm font-medium text-gray-700">Chave da API</label>
          <input
            type="password"
            id="apiKey"
            v-model="formData.apiKey"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :class="{ 'border-red-300': errors.apiKey }"
          />
          <p v-if="errors.apiKey" class="mt-2 text-sm text-red-600">{{ errors.apiKey }}</p>
        </div>

        <!-- Botões -->
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ props.registrar ? 'Salvar' : 'Adicionar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  registrar?: {
    id: number
    name: string
    apiUrl: string
    apiKey?: string
  }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const formData = ref({
  name: props.registrar?.name || '',
  apiUrl: props.registrar?.apiUrl || '',
  apiKey: props.registrar?.apiKey || ''
})

const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}

  if (!formData.value.name) {
    errors.value.name = 'O nome é obrigatório'
  }

  if (!formData.value.apiUrl) {
    errors.value.apiUrl = 'A URL da API é obrigatória'
  } else if (!/^https?:\/\/.+/.test(formData.value.apiUrl)) {
    errors.value.apiUrl = 'URL da API inválida'
  }

  if (!formData.value.apiKey) {
    errors.value.apiKey = 'A chave da API é obrigatória'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  emit('submit', {
    ...formData.value,
    id: props.registrar?.id
  })
}
</script> 