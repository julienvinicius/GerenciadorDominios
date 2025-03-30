<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Domain } from '@/types/domain'

const route = useRoute()
const router = useRouter()
const domain = ref<Domain | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    // Verifica se o ID está presente na rota
    const domainId = route.params.id
    if (!domainId || typeof domainId !== 'string') {
      throw new Error('ID do domínio inválido')
    }

    // Busca o domínio diretamente da API
    const response = await axios.get(`/api/v1/domains/${domainId}`)
    const domainData = response.data
    
    // Garante que dnsRecords existe e é um array
    domain.value = {
      ...domainData,
      dnsRecords: Array.isArray(domainData.dnsRecords) ? domainData.dnsRecords : []
    }
  } catch (err: any) {
    console.error('Erro ao carregar detalhes do domínio:', err)
    error.value = err.message || 'Erro ao carregar detalhes do domínio'
  } finally {
    loading.value = false
  }
})

const handleBack = () => {
  router.push('/domains')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">Erro</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-4">
        <button
          @click="handleBack"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar para a lista de domínios
        </button>
      </div>
    </div>

    <!-- Domain Details -->
    <div v-else-if="domain" class="max-w-3xl mx-auto">
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {{ domain.name }}
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link
            :to="`/domains/${domain.id}/transfer`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Transferir Domínio
          </router-link>
          <button
            @click="handleBack"
            class="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voltar
          </button>
        </div>
      </div>

      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt class="text-sm font-medium text-gray-500">Registrador</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ domain.registrar_id }}</dd>
        </div>

        <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt class="text-sm font-medium text-gray-500">Data de Expiração</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ domain.expiration_date }}</dd>
        </div>
      </dl>

      <div class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Registros DNS</h3>
        <div class="mt-5">
          <div v-if="!domain?.dnsRecords?.length" class="text-center py-12">
            <p class="text-sm text-gray-500">Nenhum registro DNS encontrado.</p>
          </div>
          <div v-else-if="domain?.dnsRecords" class="flex flex-col">
            <div v-if="!domain?.dnsRecords?.length" class="text-center py-12">
              <p class="text-sm text-gray-500">Nenhum registro DNS encontrado.</p>
            </div>
            <div v-else-if="domain?.dnsRecords" class="flex flex-col">
              <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conteúdo
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TTL
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="record in domain.dnsRecords" :key="record.id">
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ record.type }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.name }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.content }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.ttl }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="domain.notes" class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Observações</h3>
        <div class="mt-5 bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <p class="text-sm text-gray-500">{{ domain.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">Domínio não encontrado</h3>
      <p class="mt-1 text-sm text-gray-500">O domínio que você está procurando não existe.</p>
      <div class="mt-4">
        <button
          @click="handleBack"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar para a lista de domínios
        </button>
      </div>
    </div>
  </div>
</template> 