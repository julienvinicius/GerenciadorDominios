<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            Configurar {{ integrationName }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="integrationType === 'cloudflare'">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                id="apiKey"
                v-model="form.apiKey"
                class="input-field"
                placeholder="Sua API Key do Cloudflare"
                required
              />
            </div>

            <div>
              <label for="zoneId" class="block text-sm font-medium text-gray-700 mb-1">Zone ID</label>
              <input
                type="text"
                id="zoneId"
                v-model="form.zoneId"
                class="input-field"
                placeholder="ID da sua zona no Cloudflare"
                required
              />
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="proxyEnabled"
                v-model="form.proxyEnabled"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="proxyEnabled" class="ml-2 block text-sm text-gray-700">
                Habilitar proxy do Cloudflare
              </label>
            </div>
          </div>

          <div v-else-if="integrationType === 'letsencrypt'">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                id="apiKey"
                v-model="form.apiKey"
                class="input-field"
                placeholder="Sua API Key do Let's Encrypt"
                required
              />
            </div>

            <div>
              <label for="environment" class="block text-sm font-medium text-gray-700 mb-1">Ambiente</label>
              <select
                id="environment"
                v-model="form.environment"
                class="input-field"
              >
                <option value="staging">Staging</option>
                <option value="production">Produção</option>
              </select>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="autoRenewal"
                v-model="form.autoRenewal"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="autoRenewal" class="ml-2 block text-sm text-gray-700">
                Renovação automática de certificados
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button type="button" @click="$emit('close')" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  type: 'cloudflare' | 'letsencrypt'
  currentConfig?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const integrationType = computed(() => props.type)
const integrationName = computed(() => {
  return props.type === 'cloudflare' ? 'Cloudflare' : 'Let\'s Encrypt'
})

const form = ref({
  email: '',
  apiKey: '',
  zoneId: '',
  proxyEnabled: false,
  environment: 'staging',
  autoRenewal: true
})

if (props.currentConfig) {
  form.value = { ...props.currentConfig }
}

const handleSubmit = () => {
  emit('submit', {
    type: props.type,
    ...form.value
  })
}
</script> 