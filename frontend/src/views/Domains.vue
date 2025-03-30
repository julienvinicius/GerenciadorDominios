<template>
  <div class="domains-view">
    <DomainFilters
      :registrars="registrars"
      :selected-status="selectedStatus"
      :selected-registrar="selectedRegistrar"
      @search="handleSearch"
      @status-change="handleStatusFilter"
      @registrar-change="handleRegistrarFilter"
      @create-domain="handleCreateDomain"
    />

    <DomainList
      :domains="filteredDomains"
      :is-loading="isLoading"
      :error="error"
      @domain-click="handleDomainClick"
      @view-details="handleDomainClick"
      @renew-domain="handleRenewDomain"
      @create-domain="handleCreateDomain"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import { useRegistrarStore } from '@/stores/registrar'
import DomainList from '@/components/DomainList.vue'
import DomainFilters from '@/components/DomainFilters.vue'

const router = useRouter()
const domainStore = useDomainStore()
const registrarStore = useRegistrarStore()

const isLoading = ref(true)
const error = ref<string | null>(null)
const searchTerm = ref('')
const selectedStatus = ref('all')
const selectedRegistrar = ref('all')

const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null
    await Promise.all([
      domainStore.fetchDomains(),
      registrarStore.fetchRegistrars()
    ])
  } catch (err) {
    error.value = 'Erro ao carregar dados. Por favor, tente novamente.'
    console.error('Erro ao carregar dados:', err)
  } finally {
    isLoading.value = false
  }
}

const filteredDomains = computed(() => {
  let domains = domainStore.domains

  // Aplicar filtro de busca
  if (searchTerm.value) {
    const query = searchTerm.value.toLowerCase()
    domains = domains.filter(domain => 
      domain.name.toLowerCase().includes(query) ||
      domain.registrar?.name.toLowerCase().includes(query)
    )
  }

  // Aplicar filtro de status
  if (selectedStatus.value !== 'all') {
    domains = domains.filter(domain => domain.status === selectedStatus.value)
  }

  // Aplicar filtro de registrador
  if (selectedRegistrar.value !== 'all') {
    domains = domains.filter(domain => domain.registrar_id === selectedRegistrar.value)
  }

  return domains
})

const registrars = computed(() => registrarStore.registrars)

const handleSearch = (term: string) => {
  searchTerm.value = term
}

const handleStatusFilter = (status: string) => {
  selectedStatus.value = status
}

const handleRegistrarFilter = (registrar: string) => {
  selectedRegistrar.value = registrar
}

const handleDomainClick = (domainId: string) => {
  router.push(`/domains/${domainId}`)
}

const handleCreateDomain = () => {
  router.push('/domains/create')
}

const handleRenewDomain = async (domainId: string) => {
  try {
    await domainStore.renewDomain(domainId)
    // Recarregar dados após renovação
    await loadData()
  } catch (err) {
    console.error('Erro ao renovar domínio:', err)
    error.value = 'Erro ao renovar domínio. Por favor, tente novamente.'
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.domains-view {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 