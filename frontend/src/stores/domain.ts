import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { domainService } from '@/services/api'
import type { Domain, DomainFormData, DNSRecord } from '@/types/domain'

export const useDomainStore = defineStore('domain', () => {
  const domains = ref<Domain[]>([])
  const currentDomain = ref<Domain | null>(null)
  const isLoading = ref(false)

  const getActiveDomains = computed(() => {
    return domains.value.filter(domain => domain.status === 'active')
  })

  const fetchDomains = async () => {
    isLoading.value = true
    try {
      const response = await domainService.getDomains()
      domains.value = response.data
    } catch (error) {
      console.error('Erro ao buscar domínios:', error)
    } finally {
      isLoading.value = false
    }
  }

  const getDomainById = (id: string) => {
    return domains.value.find(domain => domain.id === id)
  }

  const createDomain = async (data: DomainFormData) => {
    try {
      const response = await domainService.createDomain(data)
      domains.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao criar domínio:', error)
      throw error
    }
  }

  const updateDomain = async (id: string, data: DomainFormData) => {
    try {
      const response = await domainService.updateDomain(id, data)
      const index = domains.value.findIndex(d => d.id === id)
      if (index !== -1) {
        domains.value[index] = response.data
      }
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar domínio:', error)
      throw error
    }
  }

  const deleteDomain = async (id: string) => {
    try {
      await domainService.deleteDomain(id)
      domains.value = domains.value.filter(d => d.id !== id)
    } catch (error) {
      console.error('Erro ao excluir domínio:', error)
      throw error
    }
  }

  const getDNSRecords = async (domainId: string) => {
    try {
      const response = await domainService.getDnsRecords(domainId)
      return response.data
    } catch (error) {
      console.error('Erro ao carregar registros DNS:', error)
      throw error
    }
  }

  const addDNSRecord = async (domainId: string, data: DNSRecord) => {
    try {
      const response = await domainService.createDnsRecord(domainId, data)
      return response.data
    } catch (error) {
      console.error('Erro ao adicionar registro DNS:', error)
      throw error
    }
  }

  const deleteDNSRecord = async (domainId: string, recordId: string) => {
    try {
      await domainService.deleteDnsRecord(domainId, recordId)
    } catch (error) {
      console.error('Erro ao excluir registro DNS:', error)
      throw error
    }
  }

  const getSecuritySettings = async () => {
    try {
      const response = await domainService.getSecuritySettings()
      return response.data
    } catch (error) {
      console.error('Erro ao carregar configurações de segurança:', error)
      throw error
    }
  }

  const updateSecuritySettings = async (settings: any) => {
    try {
      const response = await domainService.updateSecuritySettings(settings)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar configurações de segurança:', error)
      throw error
    }
  }

  const generateBackupCodes = async () => {
    try {
      const response = await domainService.generateBackupCodes()
      return response.data
    } catch (error) {
      console.error('Erro ao gerar códigos de backup:', error)
      throw error
    }
  }

  const revokeAllSessions = async () => {
    try {
      await domainService.revokeAllSessions()
    } catch (error) {
      console.error('Erro ao revogar sessões:', error)
      throw error
    }
  }

  const getDomainTransfers = async (domainId: string) => {
    try {
      const response = await domainService.getTransfers(domainId)
      return response.data
    } catch (error) {
      console.error('Erro ao carregar transferências:', error)
      throw error
    }
  }

  const createDomainTransfer = async (data: any) => {
    try {
      const response = await domainService.createTransfer(data.domainId, data)
      return response.data
    } catch (error) {
      console.error('Erro ao criar transferência:', error)
      throw error
    }
  }

  const cancelDomainTransfer = async (domainId: string, transferId: string) => {
    try {
      await domainService.deleteTransfer(domainId, transferId)
    } catch (error) {
      console.error('Erro ao cancelar transferência:', error)
      throw error
    }
  }

  return {
    domains,
    currentDomain,
    isLoading,
    getActiveDomains,
    fetchDomains,
    getDomainById,
    createDomain,
    updateDomain,
    deleteDomain,
    getDNSRecords,
    addDNSRecord,
    deleteDNSRecord,
    getSecuritySettings,
    updateSecuritySettings,
    generateBackupCodes,
    revokeAllSessions,
    getDomainTransfers,
    createDomainTransfer,
    cancelDomainTransfer
  }
}) 