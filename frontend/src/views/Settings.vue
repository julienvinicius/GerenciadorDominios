<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
      <p class="mt-1 text-sm text-gray-500">
        Gerencie as configurações do seu gerenciador de domínios
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              currentTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Configurações Gerais -->
        <div v-if="currentTab === 'general'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">TTL Padrão</label>
            <input
              type="number"
              v-model="generalSettings.defaultTTL"
              class="input-field w-32"
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

          <div class="flex items-center">
            <input
              type="checkbox"
              id="autoCheckDNS"
              v-model="generalSettings.autoCheckDNS"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="autoCheckDNS" class="ml-2 block text-sm text-gray-700">
              Verificação automática de DNS
            </label>
          </div>
        </div>

        <!-- Registradores DNS -->
        <div v-if="currentTab === 'registrars'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Registradores DNS</h3>
            <button @click="showRegistrarForm = true" class="btn-primary">
              Adicionar Registrador
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="registrar in registrars"
              :key="registrar.id"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ registrar.name }}</h4>
                  <p class="text-sm text-gray-500">{{ registrar.apiUrl }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      registrar.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ registrar.status === 'active' ? 'Conectado' : 'Desconectado' }}
                  </span>
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

        <!-- Templates DNS -->
        <div v-if="currentTab === 'templates'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Templates DNS</h3>
            <button @click="showTemplateForm = true" class="btn-primary">
              Novo Template
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="template in templates"
              :key="template.id"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ template.name }}</h4>
                  <p class="text-sm text-gray-500">{{ template.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editTemplate(template)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="removeTemplate(template.id)"
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

        <!-- Integrações -->
        <div v-if="currentTab === 'integrations'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cloudflare -->
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900">Cloudflare</h4>
                  <p class="text-sm text-gray-500">Proteção e otimização de DNS</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    cloudflareConnected
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ cloudflareConnected ? 'Conectado' : 'Desconectado' }}
                </span>
                <button
                  @click="showCloudflareForm = true"
                  class="btn-secondary"
                >
                  {{ cloudflareConnected ? 'Configurar' : 'Conectar' }}
                </button>
              </div>
            </div>

            <!-- Let's Encrypt -->
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900">Let's Encrypt</h4>
                  <p class="text-sm text-gray-500">Certificados SSL gratuitos</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    letsEncryptConnected
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ letsEncryptConnected ? 'Conectado' : 'Desconectado' }}
                </span>
                <button
                  @click="showLetsEncryptForm = true"
                  class="btn-secondary"
                >
                  {{ letsEncryptConnected ? 'Configurar' : 'Conectar' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Monitoramento -->
        <div v-if="currentTab === 'monitoring'">
          <MonitoringSettings @save="saveMonitoringSettings" />
        </div>

        <!-- Backup -->
        <div v-if="currentTab === 'backup'" class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Backup Automático</h3>
            
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="autoBackup"
                  v-model="backupSettings.autoBackup"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="autoBackup" class="ml-2 block text-sm text-gray-700">
                  Habilitar backup automático
                </label>
              </div>

              <div v-if="backupSettings.autoBackup">
                <label class="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                <select
                  v-model="backupSettings.frequency"
                  class="input-field"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Backup Manual</h3>
            
            <div class="space-y-4">
              <button @click="createBackup" class="btn-primary w-full">
                Criar Backup
              </button>
              <div class="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".json"
                  class="input-field flex-1"
                />
                <button class="btn-secondary">
                  Restaurar Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Segurança -->
        <div v-if="currentTab === 'security'">
          <SecuritySettings @save="saveSecuritySettings" />
        </div>

        <!-- Logs -->
        <div v-if="currentTab === 'logs'">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">Logs do Sistema</h3>
            <p class="mt-1 text-sm text-gray-500">
              Em breve: visualização de logs do sistema
            </p>
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

    <DnsTemplateForm
      v-if="showTemplateForm"
      :template="selectedTemplate || undefined"
      @close="showTemplateForm = false"
      @submit="handleTemplateSubmit"
    />

    <IntegrationForm
      v-if="showCloudflareForm"
      type="cloudflare"
      :current-config="cloudflareConfig"
      @close="showCloudflareForm = false"
      @submit="handleCloudflareSubmit"
    />

    <IntegrationForm
      v-if="showLetsEncryptForm"
      type="letsencrypt"
      :current-config="letsEncryptConfig"
      @close="showLetsEncryptForm = false"
      @submit="handleLetsEncryptSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegistrarForm from '@/components/registrars/RegistrarForm.vue'
import DnsTemplateForm from '@/components/templates/DnsTemplateForm.vue'
import IntegrationForm from '@/components/integrations/IntegrationForm.vue'
import MonitoringSettings from '@/components/monitoring/MonitoringSettings.vue'
import SecuritySettings from '@/components/security/SecuritySettings.vue'

const tabs = [
  { id: 'general', name: 'Geral' },
  { id: 'registrars', name: 'Registradores' },
  { id: 'templates', name: 'Templates' },
  { id: 'integrations', name: 'Integrações' },
  { id: 'monitoring', name: 'Monitoramento' },
  { id: 'backup', name: 'Backup' },
  { id: 'security', name: 'Segurança' },
  { id: 'logs', name: 'Logs' }
]

const currentTab = ref('general')

// Estado dos formulários
const showRegistrarForm = ref(false)
const showTemplateForm = ref(false)
const showCloudflareForm = ref(false)
const showLetsEncryptForm = ref(false)

// Dados selecionados para edição
const selectedRegistrar = ref<{
  id: number
  name: string
  apiUrl: string
  status: string
} | null>(null)
const selectedTemplate = ref<{
  id: number
  name: string
  description: string
  records: Array<{
    type: string
    name: string
    value: string
    ttl: number
  }>
} | null>(null)
const cloudflareConfig = ref<{
  email: string
  apiKey: string
  zoneId: string
  proxyEnabled: boolean
} | null>(null)
const letsEncryptConfig = ref<{
  email: string
  apiKey: string
  environment: string
  autoRenewal: boolean
} | null>(null)

// Estado das integrações
const cloudflareConnected = ref(false)
const letsEncryptConnected = ref(false)

// Configurações gerais
const generalSettings = ref({
  defaultTTL: 3600,
  defaultNameservers: ['ns1.exemplo.com', 'ns2.exemplo.com'],
  autoCheckDNS: true
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

// Lista de templates
const templates = ref([
  {
    id: 1,
    name: 'Template WordPress',
    description: 'Configuração padrão para sites WordPress'
  }
])

// Configurações de backup
const backupSettings = ref({
  autoBackup: true,
  frequency: 'daily'
})

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

const editTemplate = (template: any) => {
  selectedTemplate.value = template
  showTemplateForm.value = true
}

const removeTemplate = (id: number) => {
  templates.value = templates.value.filter(t => t.id !== id)
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

const handleTemplateSubmit = (data: any) => {
  if (selectedTemplate.value) {
    // Atualizar template existente
    const index = templates.value.findIndex(t => t.id === selectedTemplate.value!.id)
    if (index !== -1) {
      templates.value[index] = { ...data }
    }
  } else {
    // Adicionar novo template
    templates.value.push({
      id: templates.value.length + 1,
      ...data
    })
  }
  showTemplateForm.value = false
  selectedTemplate.value = null
}

const handleCloudflareSubmit = (data: any) => {
  cloudflareConfig.value = data
  cloudflareConnected.value = true
  showCloudflareForm.value = false
}

const handleLetsEncryptSubmit = (data: any) => {
  letsEncryptConfig.value = data
  letsEncryptConnected.value = true
  showLetsEncryptForm.value = false
}

// Funções de salvamento
const saveMonitoringSettings = (settings: any) => {
  console.log('Salvando configurações de monitoramento:', settings)
}

const saveSecuritySettings = (settings: any) => {
  console.log('Salvando configurações de segurança:', settings)
}

const saveLogSettings = (settings: any) => {
  console.log('Salvando configurações de logs:', settings)
}

const createBackup = () => {
  console.log('Criando backup...')
}
</script> 