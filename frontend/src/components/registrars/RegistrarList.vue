<script setup lang="ts">
import { ref } from 'vue'
import RegistrarForm from './RegistrarForm.vue'

interface Registrar {
  id: number
  name: string
  apiUrl: string
  status: string
  apiKey?: string
}

const registrars = ref<Registrar[]>([
  {
    id: 1,
    name: 'Registro.br',
    apiUrl: 'https://api.registro.br',
    status: 'active'
  },
  {
    id: 2,
    name: 'GoDaddy',
    apiUrl: 'https://api.godaddy.com',
    status: 'active'
  }
])

const showForm = ref(false)
const selectedRegistrar = ref<Registrar | undefined>(undefined)

const handleAdd = () => {
  selectedRegistrar.value = undefined
  showForm.value = true
}

const handleEdit = (registrar: Registrar) => {
  selectedRegistrar.value = registrar
  showForm.value = true
}

const handleDelete = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir este registrador?')) return
  
  // TODO: Implementar chamada à API
  registrars.value = registrars.value.filter(r => r.id !== id)
}

const handleSubmit = async (data: any) => {
  // TODO: Implementar chamada à API
  if (data.id) {
    // Editar
    const index = registrars.value.findIndex(r => r.id === data.id)
    if (index !== -1) {
      registrars.value[index] = { ...registrars.value[index], ...data }
    }
  } else {
    // Adicionar
    registrars.value.push({
      ...data,
      id: Math.max(...registrars.value.map(r => r.id)) + 1,
      status: 'active'
    })
  }
  
  showForm.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">Registradores</h2>
      <button
        @click="handleAdd"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Adicionar Registrador
      </button>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="registrar in registrars" :key="registrar.id" class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-lg font-medium text-gray-600">
                    {{ registrar.name.charAt(0) }}
                  </span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ registrar.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ registrar.apiUrl }}
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="handleEdit(registrar)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                @click="handleDelete(registrar.id)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <RegistrarForm
      v-if="showForm"
      :registrar="selectedRegistrar"
      @close="showForm = false"
      @submit="handleSubmit"
    />
  </div>
</template> 