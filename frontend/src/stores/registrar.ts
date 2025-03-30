import { defineStore } from 'pinia'
import { domainService } from '@/services/api'
import type { Registrar } from '@/types/registrar'

export const useRegistrarStore = defineStore('registrar', {
  state: () => ({
    registrars: [] as Registrar[],
    currentRegistrar: null as Registrar | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchRegistrars() {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.getRegistrars()
        this.registrars = response.data
      } catch (error) {
        this.error = 'Erro ao carregar registradores'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchRegistrar(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.getRegistrar(id)
        this.currentRegistrar = response.data
        return response.data
      } catch (error) {
        this.error = 'Erro ao carregar registrador'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createRegistrar(registrar: Partial<Registrar>) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.createRegistrar(registrar)
        this.registrars.push(response.data)
        return response.data
      } catch (error) {
        this.error = 'Erro ao criar registrador'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRegistrar(id: string, registrar: Partial<Registrar>) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.updateRegistrar(id, registrar)
        const index = this.registrars.findIndex(r => r.id === id)
        if (index !== -1) {
          this.registrars[index] = response.data
        }
        if (this.currentRegistrar?.id === id) {
          this.currentRegistrar = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao atualizar registrador'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRegistrar(id: string) {
      this.loading = true
      this.error = null
      try {
        await domainService.deleteRegistrar(id)
        this.registrars = this.registrars.filter(r => r.id !== id)
        if (this.currentRegistrar?.id === id) {
          this.currentRegistrar = null
        }
      } catch (error) {
        this.error = 'Erro ao excluir registrador'
        throw error
      } finally {
        this.loading = false
      }
    },

    async testConnection(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.testRegistrarConnection(id)
        return response.data
      } catch (error) {
        this.error = 'Erro ao testar conexão'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 