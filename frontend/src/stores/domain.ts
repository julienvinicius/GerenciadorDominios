import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { domainService } from '@/services/api'
import type { Domain, DomainFormData, DNSRecord } from '@/types/domain'
import axios from '@/plugins/axios'

export const useDomainStore = defineStore('domain', {
  state: () => ({
    domains: [] as Domain[],
    currentDomain: null as Domain | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchDomains() {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.getDomains()
        this.domains = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        this.error = 'Erro ao carregar domínios'
        console.error('Erro ao buscar domínios:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchDomain(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.getDomain(id)
        this.currentDomain = response.data
        return response.data
      } catch (error) {
        this.error = 'Erro ao carregar domínio'
        console.error('Erro ao buscar domínio:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDomain(domain: Partial<Domain>) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.createDomain(domain)
        if (response.data) {
          this.domains.unshift(response.data)
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao criar domínio'
        console.error('Erro ao criar domínio:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateDomain(id: string, domain: Partial<Domain>) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.updateDomain(id, domain)
        const index = this.domains.findIndex(d => d.id === id)
        if (index !== -1) {
          this.domains[index] = response.data
        }
        if (this.currentDomain?.id === id) {
          this.currentDomain = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao atualizar domínio'
        console.error('Erro ao atualizar domínio:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDomain(id: string) {
      this.loading = true
      this.error = null
      try {
        await domainService.deleteDomain(id)
        this.domains = this.domains.filter(d => d.id !== id)
        if (this.currentDomain?.id === id) {
          this.currentDomain = null
        }
      } catch (error) {
        this.error = 'Erro ao excluir domínio'
        console.error('Erro ao excluir domínio:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getDNSRecords(domainId: string) {
      try {
        const response = await domainService.getDnsRecords(domainId)
        return response.data
      } catch (error) {
        console.error('Erro ao carregar registros DNS:', error)
        throw error
      }
    },

    async addDNSRecord(domainId: string, data: DNSRecord) {
      try {
        const response = await domainService.createDnsRecord(domainId, data)
        return response.data
      } catch (error) {
        console.error('Erro ao adicionar registro DNS:', error)
        throw error
      }
    },

    async deleteDNSRecord(domainId: string, recordId: string) {
      try {
        await domainService.deleteDnsRecord(domainId, recordId)
      } catch (error) {
        console.error('Erro ao excluir registro DNS:', error)
        throw error
      }
    },

    async getSecuritySettings() {
      try {
        const response = await domainService.getSecuritySettings()
        return response.data
      } catch (error) {
        console.error('Erro ao carregar configurações de segurança:', error)
        throw error
      }
    },

    async updateSecuritySettings(settings: any) {
      try {
        const response = await domainService.updateSecuritySettings(settings)
        return response.data
      } catch (error) {
        console.error('Erro ao atualizar configurações de segurança:', error)
        throw error
      }
    },

    async generateBackupCodes() {
      try {
        const response = await domainService.generateBackupCodes()
        return response.data
      } catch (error) {
        console.error('Erro ao gerar códigos de backup:', error)
        throw error
      }
    },

    async revokeAllSessions() {
      try {
        await domainService.revokeAllSessions()
      } catch (error) {
        console.error('Erro ao revogar sessões:', error)
        throw error
      }
    },

    async getDomainTransfers(domainId: string) {
      try {
        const response = await domainService.getTransfers(domainId)
        return response.data
      } catch (error) {
        console.error('Erro ao carregar transferências:', error)
        throw error
      }
    },

    async createDomainTransfer(data: any) {
      try {
        const response = await domainService.createTransfer(data.domainId, data)
        return response.data
      } catch (error) {
        console.error('Erro ao criar transferência:', error)
        throw error
      }
    },

    async cancelDomainTransfer(domainId: string, transferId: string) {
      try {
        await domainService.cancelTransfer(domainId, transferId)
      } catch (error) {
        console.error('Erro ao cancelar transferência:', error)
        throw error
      }
    },

    async getTransferStatus(domainId: string, transferId: string) {
      try {
        const response = await domainService.getTransferStatus(domainId, transferId)
        return response.data
      } catch (error) {
        console.error('Erro ao obter status da transferência:', error)
        throw error
      }
    },

    async resendTransferEmail(domainId: string, transferId: string) {
      try {
        await domainService.resendTransferEmail(domainId, transferId)
      } catch (error) {
        console.error('Erro ao reenviar email de transferência:', error)
        throw error
      }
    },

    async getTransferCost(domainId: string, registrarId: string) {
      try {
        const response = await domainService.getTransferCost(domainId, registrarId)
        return response.data
      } catch (error) {
        console.error('Erro ao obter custo da transferência:', error)
        throw error
      }
    },

    async checkDNS(id: number) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`/api/domains/${id}/check-dns`)
        return response.data
      } catch (err) {
        this.error = 'Erro ao verificar DNS'
        console.error('Erro ao verificar DNS:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async transferDomain(id: number, data: { registrarId: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`/api/domains/${id}/transfer`, data)
        const index = this.domains.findIndex(d => d.id === id)
        if (index !== -1) {
          this.domains[index] = response.data
        }
        return response.data
      } catch (err) {
        this.error = 'Erro ao transferir domínio'
        console.error('Erro ao transferir domínio:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async checkDomainStatus(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.checkDomainStatus(id)
        const index = this.domains.findIndex(d => d.id === id)
        if (index !== -1) {
          this.domains[index] = { ...this.domains[index], ...response.data }
        }
        if (this.currentDomain?.id === id) {
          this.currentDomain = { ...this.currentDomain, ...response.data }
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao verificar status do domínio'
        throw error
      } finally {
        this.loading = false
      }
    },

    async renewDomain(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.renewDomain(id)
        const index = this.domains.findIndex(d => d.id === id)
        if (index !== -1) {
          this.domains[index] = { ...this.domains[index], ...response.data }
        }
        if (this.currentDomain?.id === id) {
          this.currentDomain = { ...this.currentDomain, ...response.data }
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao renovar domínio'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 