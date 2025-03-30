import { defineStore } from 'pinia'
import { domainService } from '@/services/api'
import type { Transfer } from '@/types/transfer'

export const useTransferStore = defineStore('transfer', {
  state: () => ({
    transfers: [] as Transfer[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchTransfers() {
      this.loading = true
      try {
        const response = await domainService.getAllTransfers()
        this.transfers = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        this.error = 'Erro ao carregar transferências'
        console.error('Erro ao buscar transferências:', error)
      } finally {
        this.loading = false
      }
    },

    async createTransfer(domainId: number, data: Partial<Transfer>) {
      this.loading = true
      try {
        const response = await domainService.createTransfer(domainId.toString(), data)
        if (response.data) {
          this.transfers.unshift(response.data)
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao criar transferência'
        console.error('Erro ao criar transferência:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTransfer(domainId: number, transferId: number, data: Partial<Transfer>) {
      this.loading = true
      try {
        const response = await domainService.updateTransfer(domainId.toString(), transferId.toString(), data)
        if (response.data) {
          const index = this.transfers.findIndex(t => t.id === transferId)
          if (index !== -1) {
            this.transfers[index] = response.data
          }
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao atualizar transferência'
        console.error('Erro ao atualizar transferência:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelTransfer(domainId: number, transferId: number) {
      this.loading = true
      try {
        const response = await domainService.cancelTransfer(domainId.toString(), transferId.toString())
        if (response.data) {
          const index = this.transfers.findIndex(t => t.id === transferId)
          if (index !== -1) {
            this.transfers[index] = response.data
          }
        }
        return response.data
      } catch (error) {
        this.error = 'Erro ao cancelar transferência'
        console.error('Erro ao cancelar transferência:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 