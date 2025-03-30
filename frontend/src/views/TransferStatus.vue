<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import type { DomainTransfer } from '@/types/domain'

const route = useRoute()
const router = useRouter()
const domainStore = useDomainStore()

const transfer = ref<DomainTransfer | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const statusInterval = ref<number | null>(null)

const fetchTransferStatus = async () => {
  try {
    const domainId = route.params.id as string
    const transferId = route.params.transferId as string
    
    const status = await domainStore.getTransferStatus(domainId, transferId)
    transfer.value = status

    // Se a transferência estiver em andamento, continua atualizando
    if (status.status === 'in_progress' || status.status === 'pending') {
      statusInterval.value = window.setInterval(fetchTransferStatus, 30000) // Atualiza a cada 30 segundos
    }
  } catch (err: any) {
    console.error('Erro ao carregar status da transferência:', err)
    error.value = err.message || 'Erro ao carregar status da transferência'
  } finally {
    loading.value = false
  }
}

const handleResendEmail = async () => {
  try {
    const domainId = route.params.id as string
    const transferId = route.params.transferId as string
    
    await domainStore.resendTransferEmail(domainId, transferId)
    alert('Email de transferência reenviado com sucesso!')
  } catch (err: any) {
    console.error('Erro ao reenviar email:', err)
    alert('Erro ao reenviar email de transferência')
  }
}

const handleCancel = async () => {
  if (!confirm('Tem certeza que deseja cancelar esta transferência?')) {
    return
  }

  try {
    const domainId = route.params.id as string
    const transferId = route.params.transferId as string
    
    await domainStore.cancelDomainTransfer(domainId, transferId)
    router.push('/transfers')
  } catch (err: any) {
    console.error('Erro ao cancelar transferência:', err)
    alert('Erro ao cancelar transferência')
  }
}

onMounted(() => {
  fetchTransferStatus()
})

onUnmounted(() => {
  if (statusInterval.value) {
    clearInterval(statusInterval.value)
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Status da Transferência
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button
          @click="router.push('/transfers')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar para Transferências
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-8 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="mt-8">
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erro</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Status -->
    <div v-else-if="transfer" class="mt-8">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Informações da Transferência
          </h3>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span :class="[
                  transfer.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transfer.status === 'failed' ? 'bg-red-100 text-red-800' :
                  transfer.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800',
                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                ]">
                  {{ transfer.status === 'in_progress' ? 'Em Andamento' :
                     transfer.status === 'completed' ? 'Concluída' :
                     transfer.status === 'failed' ? 'Falhou' :
                     transfer.status === 'cancelled' ? 'Cancelada' :
                     'Pendente' }}
                </span>
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Registrador de Origem</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ transfer.fromRegistrar }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Registrador de Destino</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ transfer.toRegistrar }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Data de Início</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ new Date(transfer.startDate).toLocaleDateString() }}
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Previsão de Conclusão</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ new Date(transfer.estimatedCompletionDate).toLocaleDateString() }}
              </dd>
            </div>
            <div v-if="transfer.progress" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Progresso</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-600 h-2.5 rounded-full"
                    :style="{ width: `${transfer.progress}%` }"
                  ></div>
                </div>
                <p class="mt-1 text-sm text-gray-500">{{ transfer.progress }}% concluído</p>
              </dd>
            </div>
            <div v-if="transfer.error" class="bg-red-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-red-800">Erro</dt>
              <dd class="mt-1 text-sm text-red-700 sm:mt-0 sm:col-span-2">
                {{ transfer.error }}
              </dd>
            </div>
            <div v-if="transfer.notes" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Observações</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ transfer.notes }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Transfer Steps -->
      <div v-if="transfer.transferStatus" class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Etapas da Transferência</h3>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul class="divide-y divide-gray-200">
            <li v-for="step in transfer.transferStatus" :key="step.step" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      :class="[
                        step.completed ? 'text-green-400' : 'text-gray-400',
                        'h-5 w-5'
                      ]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        v-if="step.completed"
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                      <path
                        v-else
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <p class="ml-3 text-sm font-medium text-gray-900">{{ step.description }}</p>
                </div>
                <div v-if="step.error" class="ml-4">
                  <p class="text-sm text-red-600">{{ step.error }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex justify-end space-x-3">
        <button
          v-if="transfer.status === 'pending'"
          @click="handleResendEmail"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reenviar Email
        </button>
        <button
          v-if="transfer.status === 'pending' || transfer.status === 'in_progress'"
          @click="handleCancel"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cancelar Transferência
        </button>
      </div>
    </div>
  </div>
</template> 