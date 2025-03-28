<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Editar Registrador' : 'Novo Registrador' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome do Registrador</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="input-field"
              placeholder="Ex: Registro.br"
              required
            />
          </div>

          <div>
            <label for="apiUrl" class="block text-sm font-medium text-gray-700 mb-1">URL da API</label>
            <input
              type="url"
              id="apiUrl"
              v-model="form.apiUrl"
              class="input-field"
              placeholder="https://api.exemplo.com"
              required
            />
          </div>

          <div>
            <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-1">Chave da API</label>
            <input
              type="password"
              id="apiKey"
              v-model="form.apiKey"
              class="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label for="apiSecret" class="block text-sm font-medium text-gray-700 mb-1">Segredo da API</label>
            <input
              type="password"
              id="apiSecret"
              v-model="form.apiSecret"
              class="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label for="testConnection" class="block text-sm font-medium text-gray-700 mb-1">Testar Conexão</label>
            <button
              type="button"
              @click="testConnection"
              class="btn-secondary w-full"
              :disabled="testing"
            >
              {{ testing ? 'Testando...' : 'Testar Conexão' }}
            </button>
            <p v-if="testResult" :class="[
              testResult.success ? 'text-green-600' : 'text-red-600',
              'mt-2 text-sm'
            ]">
              {{ testResult.message }}
            </p>
          </div>

          <div class="flex justify-end space-x-4">
            <button type="button" @click="$emit('close')" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Salvar Alterações' : 'Adicionar Registrador' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  registrar?: {
    id: number
    name: string
    apiUrl: string
    status: string
  }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const isEditing = !!props.registrar
const testing = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const form = ref({
  name: '',
  apiUrl: '',
  apiKey: '',
  apiSecret: ''
})

onMounted(() => {
  if (props.registrar) {
    form.value = {
      name: props.registrar.name,
      apiUrl: props.registrar.apiUrl,
      apiKey: '',
      apiSecret: ''
    }
  }
})

const testConnection = async () => {
  testing.value = true
  testResult.value = null
  
  try {
    // Simular teste de conexão
    await new Promise(resolve => setTimeout(resolve, 1500))
    testResult.value = {
      success: true,
      message: 'Conexão estabelecida com sucesso!'
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: 'Erro ao conectar com a API'
    }
  } finally {
    testing.value = false
  }
}

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    id: props.registrar?.id
  })
}
</script> 