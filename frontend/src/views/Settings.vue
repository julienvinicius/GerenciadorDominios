<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Configurações</h1>
          <p class="text-gray-500">Gerencie suas preferências e configurações de conta</p>
        </div>

        <!-- Perfil do Usuário -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold text-gray-800">Perfil do Usuário</h2>
              <p class="text-gray-500">Atualize suas informações pessoais</p>
            </div>
          </div>
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                id="name"
                v-model="profile.name"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                v-model="profile.email"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="seu@email.com"
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        <!-- Preferências -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold text-gray-800">Preferências</h2>
              <p class="text-gray-500">Personalize sua experiência</p>
            </div>
          </div>
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Notificações por E-mail</h3>
                <p class="text-sm text-gray-500">Receber notificações sobre seus domínios</p>
              </div>
              <button
                type="button"
                :class="[
                  preferences.emailNotifications ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                ]"
                @click="toggleEmailNotifications"
              >
                <span
                  :class="[
                    preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  ]"
                />
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Modo Escuro</h3>
                <p class="text-sm text-gray-500">Ativar tema escuro da interface</p>
              </div>
              <button
                type="button"
                :class="[
                  preferences.darkMode ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                ]"
                @click="toggleDarkMode"
              >
                <span
                  :class="[
                    preferences.darkMode ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Segurança -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold text-gray-800">Segurança</h2>
              <p class="text-gray-500">Proteja sua conta</p>
            </div>
          </div>
          <form @submit.prevent="updatePassword" class="space-y-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
              <input
                type="password"
                id="currentPassword"
                v-model="security.currentPassword"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Digite sua senha atual"
              />
            </div>
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                v-model="security.newPassword"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Digite sua nova senha"
              />
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="security.confirmPassword"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Confirme sua nova senha"
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Alterar Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Estado do perfil
const profile = ref({
  name: '',
  email: ''
})

// Estado das preferências
const preferences = ref({
  emailNotifications: true,
  darkMode: false
})

// Estado da segurança
const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Funções
const updateProfile = () => {
  // Implementar lógica de atualização do perfil
  console.log('Atualizando perfil:', profile.value)
}

const toggleEmailNotifications = () => {
  preferences.value.emailNotifications = !preferences.value.emailNotifications
}

const toggleDarkMode = () => {
  preferences.value.darkMode = !preferences.value.darkMode
}

const updatePassword = () => {
  // Implementar lógica de atualização de senha
  console.log('Atualizando senha:', security.value)
}
</script> 