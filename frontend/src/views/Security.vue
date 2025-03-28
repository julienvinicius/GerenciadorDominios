<script setup lang="ts">
import { ref } from 'vue'
import { useDomainStore } from '@/stores/domain'

const domainStore = useDomainStore()

const securitySettings = ref({
  twoFactorAuth: false,
  emailNotifications: true,
  loginAttempts: 5,
  sessionTimeout: 30,
  passwordExpiration: 90,
  ipWhitelist: '',
  lastPasswordChange: new Date().toISOString().split('T')[0]
})

const isLoading = ref(false)
const isSaving = ref(false)

const loadSettings = async () => {
  isLoading.value = true
  try {
    const settings = await domainStore.getSecuritySettings()
    securitySettings.value = { ...securitySettings.value, ...settings }
  } catch (error) {
    console.error('Erro ao carregar configurações de segurança:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSaveSettings = async () => {
  isSaving.value = true
  try {
    await domainStore.updateSecuritySettings(securitySettings.value)
    alert('Configurações de segurança atualizadas com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar configurações de segurança:', error)
    alert('Erro ao salvar as configurações. Tente novamente.')
  } finally {
    isSaving.value = false
  }
}

const handleGenerateBackupCodes = async () => {
  if (!confirm('Isso irá gerar novos códigos de backup e invalidar os anteriores. Deseja continuar?')) return

  try {
    const codes = await domainStore.generateBackupCodes()
    alert('Códigos de backup gerados com sucesso! Guarde-os em um local seguro.')
    console.log('Códigos de backup:', codes)
  } catch (error) {
    console.error('Erro ao gerar códigos de backup:', error)
    alert('Erro ao gerar códigos de backup. Tente novamente.')
  }
}

const handleRevokeAllSessions = async () => {
  if (!confirm('Isso irá desconectar todas as sessões ativas. Deseja continuar?')) return

  try {
    await domainStore.revokeAllSessions()
    alert('Todas as sessões foram revogadas com sucesso!')
  } catch (error) {
    console.error('Erro ao revogar sessões:', error)
    alert('Erro ao revogar sessões. Tente novamente.')
  }
}

loadSettings()
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Configurações de Segurança</h1>
        <p class="mt-1 text-sm text-gray-500">Gerencie as configurações de segurança da sua conta</p>
      </div>
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="handleSaveSettings"
        :disabled="isSaving"
      >
        <svg
          v-if="isSaving"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
      </button>
    </div>

    <!-- Configurações -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="isLoading" class="text-center py-12">
          <svg
            class="animate-spin mx-auto h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>

        <div v-else class="space-y-6">
          <!-- Autenticação de Dois Fatores -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Autenticação de Dois Fatores</h3>
            <div class="mt-2">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  v-model="securitySettings.twoFactorAuth"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="twoFactorAuth" class="ml-2 block text-sm text-gray-900">
                  Habilitar autenticação de dois fatores
                </label>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Adicione uma camada extra de segurança à sua conta usando autenticação de dois fatores.
              </p>
              <button
                v-if="securitySettings.twoFactorAuth"
                type="button"
                class="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="handleGenerateBackupCodes"
              >
                Gerar Códigos de Backup
              </button>
            </div>
          </div>

          <!-- Notificações -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Notificações de Segurança</h3>
            <div class="mt-2">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  v-model="securitySettings.emailNotifications"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="emailNotifications" class="ml-2 block text-sm text-gray-900">
                  Receber notificações por e-mail
                </label>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Receba alertas sobre atividades suspeitas e alterações de segurança.
              </p>
            </div>
          </div>

          <!-- Tentativas de Login -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Tentativas de Login</h3>
            <div class="mt-2">
              <label for="loginAttempts" class="block text-sm font-medium text-gray-700">
                Número máximo de tentativas de login
              </label>
              <input
                type="number"
                id="loginAttempts"
                v-model="securitySettings.loginAttempts"
                min="1"
                max="10"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p class="mt-1 text-sm text-gray-500">
                Número de tentativas de login antes de bloquear temporariamente o acesso.
              </p>
            </div>
          </div>

          <!-- Timeout de Sessão -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Timeout de Sessão</h3>
            <div class="mt-2">
              <label for="sessionTimeout" class="block text-sm font-medium text-gray-700">
                Tempo limite de sessão (minutos)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                v-model="securitySettings.sessionTimeout"
                min="5"
                max="120"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p class="mt-1 text-sm text-gray-500">
                Tempo em minutos antes de desconectar automaticamente a sessão.
              </p>
            </div>
          </div>

          <!-- Expiração de Senha -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Expiração de Senha</h3>
            <div class="mt-2">
              <label for="passwordExpiration" class="block text-sm font-medium text-gray-700">
                Dias para expiração da senha
              </label>
              <input
                type="number"
                id="passwordExpiration"
                v-model="securitySettings.passwordExpiration"
                min="30"
                max="365"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p class="mt-1 text-sm text-gray-500">
                Número de dias antes de exigir a alteração da senha.
              </p>
            </div>
          </div>

          <!-- Lista de IPs Permitidos -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Lista de IPs Permitidos</h3>
            <div class="mt-2">
              <label for="ipWhitelist" class="block text-sm font-medium text-gray-700">
                IPs permitidos (separados por vírgula)
              </label>
              <input
                type="text"
                id="ipWhitelist"
                v-model="securitySettings.ipWhitelist"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="192.168.1.1, 10.0.0.1"
              />
              <p class="mt-1 text-sm text-gray-500">
                Lista de endereços IP permitidos para acessar a conta. Deixe em branco para permitir todos.
              </p>
            </div>
          </div>

          <!-- Última Alteração de Senha -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Última Alteração de Senha</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Sua senha foi alterada pela última vez em:
                <span class="font-medium">{{ new Date(securitySettings.lastPasswordChange).toLocaleDateString() }}</span>
              </p>
            </div>
          </div>

          <!-- Revogar Sessões -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Sessões Ativas</h3>
            <div class="mt-2">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                @click="handleRevokeAllSessions"
              >
                Revogar Todas as Sessões
              </button>
              <p class="mt-1 text-sm text-gray-500">
                Desconecta todas as sessões ativas, exigindo novo login em todos os dispositivos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 