<template>
  <div class="p-4 sm:p-6">
    <div class="mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
      <p class="mt-1 text-sm text-gray-500">
        Gerencie as configurações do seu gerenciador de domínios
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <div class="border-b border-gray-200">
        <nav class="flex overflow-x-auto px-4 sm:px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              currentTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-4 sm:p-6">
        <!-- Configurações Gerais -->
        <div v-if="currentTab === 'general'" class="space-y-4 sm:space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">TTL Padrão</label>
            <input
              type="number"
              v-model="generalSettings.defaultTTL"
              class="input-field w-full sm:w-32"
              min="60"
              max="86400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nameservers Padrão</label>
            <div class="space-y-2">
              <div
                v-for="(ns, index) in generalSettings.defaultNameservers"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  type="text"
                  v-model="generalSettings.defaultNameservers[index]"
                  class="input-field flex-1"
                  placeholder="ns1.exemplo.com"
                />
                <button
                  @click="removeNameserver(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button @click="addNameserver" class="btn-secondary w-full">
                Adicionar Nameserver
              </button>
            </div>
          </div>
        </div>

        <!-- Registradores DNS -->
        <div v-if="currentTab === 'registrars'" class="space-y-4 sm:space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <h3 class="text-lg font-medium text-gray-900">Registradores DNS</h3>
            <button @click="showRegistrarForm = true" class="btn-primary w-full sm:w-auto">
              Adicionar Registrador
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="registrar in registrars"
              :key="registrar.id"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div class="w-full sm:w-auto">
                  <h4 class="text-sm font-medium text-gray-900">{{ registrar.name }}</h4>
                  <p class="text-sm text-gray-500 break-all">{{ registrar.apiUrl }}</p>
                </div>
                <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    @click="editRegistrar(registrar)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="removeRegistrar(registrar.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modais -->
    <RegistrarForm
      v-if="showRegistrarForm"
      :registrar="selectedRegistrar || undefined"
      @close="showRegistrarForm = false"
      @submit="handleRegistrarSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegistrarForm from '@/components/registrars/RegistrarForm.vue'

const tabs = [
  { id: 'general', name: 'Geral' },
  { id: 'registrars', name: 'Registradores' }
]

const currentTab = ref('general')

// Estado dos formulários
const showRegistrarForm = ref(false)

// Dados selecionados para edição
const selectedRegistrar = ref<{
  id: number
  name: string
  apiUrl: string
  status: string
} | null>(null)

// Configurações gerais
const generalSettings = ref({
  defaultTTL: 3600,
  defaultNameservers: ['ns1.exemplo.com', 'ns2.exemplo.com']
})

// Lista de registradores
const registrars = ref([
  {
    id: 1,
    name: 'Registrador Exemplo',
    apiUrl: 'https://api.exemplo.com',
    status: 'active'
  }
])

// Funções de manipulação de dados
const addNameserver = () => {
  generalSettings.value.defaultNameservers.push('')
}

const removeNameserver = (index: number) => {
  generalSettings.value.defaultNameservers.splice(index, 1)
}

const editRegistrar = (registrar: any) => {
  selectedRegistrar.value = registrar
  showRegistrarForm.value = true
}

const removeRegistrar = (id: number) => {
  registrars.value = registrars.value.filter(r => r.id !== id)
}

// Handlers de formulários
const handleRegistrarSubmit = (data: any) => {
  if (selectedRegistrar.value) {
    // Atualizar registrador existente
    const index = registrars.value.findIndex(r => r.id === selectedRegistrar.value!.id)
    if (index !== -1) {
      registrars.value[index] = { ...data, status: 'active' }
    }
  } else {
    // Adicionar novo registrador
    registrars.value.push({
      id: registrars.value.length + 1,
      ...data,
      status: 'active'
    })
  }
  showRegistrarForm.value = false
  selectedRegistrar.value = null
}
</script> 