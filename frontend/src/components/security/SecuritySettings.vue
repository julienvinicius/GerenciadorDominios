<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Proteção contra Ataques</h3>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <label class="block text-sm font-medium text-gray-700">Proteção DDoS</label>
            <p class="text-sm text-gray-500">Protege contra ataques de negação de serviço distribuído</p>
          </div>
          <button
            @click="toggleDDoSProtection"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              ddosProtection ? 'bg-blue-600' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                ddosProtection ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label class="block text-sm font-medium text-gray-700">DNSSEC</label>
            <p class="text-sm text-gray-500">Habilita a extensão de segurança do DNS</p>
          </div>
          <button
            @click="toggleDNSSEC"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              dnssecEnabled ? 'bg-blue-600' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                dnssecEnabled ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Lista de IPs Permitidos</h3>
      
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <input
            type="text"
            v-model="newIp"
            class="input-field flex-1"
            placeholder="Digite um endereço IP"
          />
          <button @click="addIp" class="btn-primary">
            Adicionar
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(ip, index) in allowedIps"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-sm text-gray-700">{{ ip }}</span>
            <button
              @click="removeIp(index)"
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

    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Limites de Requisição</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Requisições por Minuto</label>
          <div class="flex items-center space-x-2">
            <input
              type="number"
              v-model="rateLimit"
              class="input-field w-32"
              min="1"
              max="1000"
            />
            <span class="text-sm text-gray-500">requisições</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tempo de Bloqueio</label>
          <div class="flex items-center space-x-2">
            <input
              type="number"
              v-model="blockTime"
              class="input-field w-32"
              min="1"
              max="1440"
            />
            <span class="text-sm text-gray-500">minutos</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button @click="saveSecuritySettings" class="btn-primary">
        Salvar Configurações
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const ddosProtection = ref(true)
const dnssecEnabled = ref(false)
const newIp = ref('')
const allowedIps = ref<string[]>([])
const rateLimit = ref(60)
const blockTime = ref(30)

const toggleDDoSProtection = () => {
  ddosProtection.value = !ddosProtection.value
}

const toggleDNSSEC = () => {
  dnssecEnabled.value = !dnssecEnabled.value
}

const addIp = () => {
  if (newIp.value && isValidIp(newIp.value)) {
    allowedIps.value.push(newIp.value)
    newIp.value = ''
  }
}

const removeIp = (index: number) => {
  allowedIps.value.splice(index, 1)
}

const isValidIp = (ip: string): boolean => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipRegex.test(ip)) return false

  const parts = ip.split('.')
  return parts.every(part => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255
  })
}

const saveSecuritySettings = () => {
  // Implementar salvamento das configurações
  console.log('Salvando configurações de segurança...')
}
</script> 