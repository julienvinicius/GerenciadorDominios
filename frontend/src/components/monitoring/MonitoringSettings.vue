<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Configurações de Monitoramento</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Intervalo de Verificação</label>
          <select
            v-model="settings.checkInterval"
            class="input-field"
          >
            <option value="5">5 minutos</option>
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Limite de Alertas</label>
          <div class="flex items-center space-x-2">
            <input
              type="number"
              v-model="settings.alertThreshold"
              class="input-field w-24"
              min="1"
              max="10"
            />
            <span class="text-sm text-gray-500">tentativas antes de alertar</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Timeout da Verificação</label>
          <div class="flex items-center space-x-2">
            <input
              type="number"
              v-model="settings.timeout"
              class="input-field w-24"
              min="1"
              max="30"
            />
            <span class="text-sm text-gray-500">segundos</span>
          </div>
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="checkSSL"
            v-model="settings.checkSSL"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="checkSSL" class="ml-2 block text-sm text-gray-700">
            Verificar certificados SSL
          </label>
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="checkDNS"
            v-model="settings.checkDNS"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="checkDNS" class="ml-2 block text-sm text-gray-700">
            Verificar registros DNS
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Notificações</h3>
      
      <div class="space-y-4">
        <div class="flex items-center">
          <input
            type="checkbox"
            id="emailNotifications"
            v-model="settings.emailNotifications"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="emailNotifications" class="ml-2 block text-sm text-gray-700">
            Notificações por email
          </label>
        </div>

        <div v-if="settings.emailNotifications">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email para Notificações</label>
          <input
            type="email"
            v-model="settings.notificationEmail"
            class="input-field"
            placeholder="seu@email.com"
          />
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="webhookNotifications"
            v-model="settings.webhookNotifications"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="webhookNotifications" class="ml-2 block text-sm text-gray-700">
            Notificações via Webhook
          </label>
        </div>

        <div v-if="settings.webhookNotifications">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL do Webhook</label>
          <input
            type="url"
            v-model="settings.webhookUrl"
            class="input-field"
            placeholder="https://seu-webhook.com/endpoint"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button @click="saveSettings" class="btn-primary">
        Salvar Configurações
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'save', settings: any): void
}>()

const settings = ref({
  checkInterval: 15,
  alertThreshold: 3,
  timeout: 10,
  checkSSL: true,
  checkDNS: true,
  emailNotifications: true,
  notificationEmail: '',
  webhookNotifications: false,
  webhookUrl: ''
})

const saveSettings = () => {
  emit('save', settings.value)
}
</script> 