import { defineStore } from 'pinia'
import { authService } from '@/services/auth'

interface User {
    id: number
    name: string
    email: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    }),

    getters: {
        currentUser: (state) => state.user,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error !== null
    },

    actions: {
        async login(email: string, password: string) {
            this.loading = true
            this.error = null
            try {
                await authService.getCsrfCookie()
                await authService.login({ email, password })
                const response = await authService.getUser()
                this.user = response.data
                this.isAuthenticated = true
            } catch (error: any) {
                this.error = error.response?.data?.message || 'Erro ao fazer login'
                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            this.loading = true
            this.error = null
            try {
                await authService.logout()
                this.user = null
                this.isAuthenticated = false
            } catch (error: any) {
                this.error = error.response?.data?.message || 'Erro ao fazer logout'
                throw error
            } finally {
                this.loading = false
            }
        },

        async checkAuth() {
            this.loading = true
            this.error = null
            try {
                const response = await authService.getUser()
                this.user = response.data
                this.isAuthenticated = true
            } catch (error) {
                this.user = null
                this.isAuthenticated = false
            } finally {
                this.loading = false
            }
        }
    }
}) 