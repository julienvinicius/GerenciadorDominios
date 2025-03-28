import { defineStore } from 'pinia'
import axios from 'axios'

export const useDomainStore = defineStore('domain', {
  state: () => ({
    domains: [],
    currentDomain: null,
    loading: false,
    error: null
  }),

  getters: {
    getDomainById: (state) => (id) => {
      return state.domains.find(domain => domain.id === id)
    },
    
    getActiveDomains: (state) => {
      return state.domains.filter(domain => domain.status === 'active')
    }
  },

  actions: {
    async fetchDomains() {
      this.loading = true
      try {
        const response = await axios.get('/api/domains')
        this.domains = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createDomain(domainData) {
      this.loading = true
      try {
        const response = await axios.post('/api/domains', domainData)
        this.domains.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateDomain(id, domainData) {
      this.loading = true
      try {
        const response = await axios.put(`/api/domains/${id}`, domainData)
        const index = this.domains.findIndex(domain => domain.id === id)
        if (index !== -1) {
          this.domains[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDomain(id) {
      this.loading = true
      try {
        await axios.delete(`/api/domains/${id}`)
        this.domains = this.domains.filter(domain => domain.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentDomain(domain) {
      this.currentDomain = domain
    },

    clearError() {
      this.error = null
    }
  }
}) 