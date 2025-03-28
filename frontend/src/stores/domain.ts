import { defineStore } from 'pinia'
import axios from 'axios'
import type { Domain, DomainFormData, DomainState } from '@/types/domain'

export const useDomainStore = defineStore('domain', {
  state: (): DomainState => ({
    domains: [],
    currentDomain: null,
    loading: false,
    error: null
  }),

  getters: {
    getDomainById: (state) => (id: number): Domain | undefined => {
      return state.domains.find(domain => domain.id === id)
    },
    
    getActiveDomains: (state): Domain[] => {
      return state.domains.filter(domain => domain.status === 'active')
    },

    getExpiringDomains: (state): Domain[] => {
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return state.domains.filter(domain => {
        const expirationDate = new Date(domain.expirationDate)
        return expirationDate <= thirtyDaysFromNow && domain.status !== 'expired'
      })
    }
  },

  actions: {
    async fetchDomains(): Promise<void> {
      this.loading = true
      try {
        const response = await axios.get<Domain[]>('/api/domains')
        this.domains = response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao buscar domínios'
      } finally {
        this.loading = false
      }
    },

    async createDomain(domainData: DomainFormData): Promise<Domain> {
      this.loading = true
      try {
        const response = await axios.post<Domain>('/api/domains', domainData)
        this.domains.push(response.data)
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao criar domínio'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateDomain(id: number, domainData: DomainFormData): Promise<Domain> {
      this.loading = true
      try {
        const response = await axios.put<Domain>(`/api/domains/${id}`, domainData)
        const index = this.domains.findIndex(domain => domain.id === id)
        if (index !== -1) {
          this.domains[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao atualizar domínio'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDomain(id: number): Promise<void> {
      this.loading = true
      try {
        await axios.delete(`/api/domains/${id}`)
        this.domains = this.domains.filter(domain => domain.id !== id)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao deletar domínio'
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentDomain(domain: Domain | null): void {
      this.currentDomain = domain
    },

    clearError(): void {
      this.error = null
    }
  }
}) 