import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios'

interface Registrar {
  id: number
  name: string
  apiUrl: string
  apiKey?: string
  status: string
}

export const useRegistrarStore = defineStore('registrar', () => {
  const registrars = ref<Registrar[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRegistrars = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/api/registrars')
      registrars.value = response.data
    } catch (err) {
      error.value = 'Erro ao carregar registradores'
      console.error('Erro ao carregar registradores:', err)
    } finally {
      loading.value = false
    }
  }

  const createRegistrar = async (data: Omit<Registrar, 'id' | 'status'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/api/registrars', data)
      registrars.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Erro ao criar registrador'
      console.error('Erro ao criar registrador:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRegistrar = async (id: number, data: Partial<Registrar>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/api/registrars/${id}`, data)
      const index = registrars.value.findIndex(r => r.id === id)
      if (index !== -1) {
        registrars.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Erro ao atualizar registrador'
      console.error('Erro ao atualizar registrador:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRegistrar = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await axios.delete(`/api/registrars/${id}`)
      registrars.value = registrars.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = 'Erro ao excluir registrador'
      console.error('Erro ao excluir registrador:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const testConnection = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`/api/registrars/${id}/test`)
      return response.data
    } catch (err) {
      error.value = 'Erro ao testar conexão'
      console.error('Erro ao testar conexão:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    registrars,
    loading,
    error,
    fetchRegistrars,
    createRegistrar,
    updateRegistrar,
    deleteRegistrar,
    testConnection
  }
}) 