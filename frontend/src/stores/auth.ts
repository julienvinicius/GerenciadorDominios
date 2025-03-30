import { defineStore } from 'pinia'
import { domainService } from '@/services/api'

interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.login(credentials)
        this.user = response.data.user
      } catch (error) {
        this.error = 'Erro ao fazer login'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(data: RegisterData) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.register(data)
        this.user = response.data.user
      } catch (error) {
        this.error = 'Erro ao criar conta'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        await domainService.logout()
        this.user = null
      } catch (error) {
        this.error = 'Erro ao fazer logout'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.getUser()
        this.user = response.data
      } catch (error) {
        this.error = 'Erro ao carregar usuário'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data: Partial<User>) {
      this.loading = true
      this.error = null
      try {
        const response = await domainService.updateProfile(data)
        this.user = response.data
      } catch (error) {
        this.error = 'Erro ao atualizar perfil'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePassword(data: { current_password: string; password: string; password_confirmation: string }) {
      this.loading = true
      this.error = null
      try {
        await domainService.updatePassword(data)
      } catch (error) {
        this.error = 'Erro ao atualizar senha'
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email: string) {
      this.loading = true
      this.error = null
      try {
        await domainService.forgotPassword(email)
      } catch (error) {
        this.error = 'Erro ao enviar e-mail de recuperação'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }) {
      this.loading = true
      this.error = null
      try {
        await domainService.resetPassword(data)
      } catch (error) {
        this.error = 'Erro ao redefinir senha'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 