import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios'

interface DNSRecord {
  type: string
  name: string
  content: string
  ttl: number
  priority?: number
}

interface Template {
  id: number
  name: string
  description: string
  records: DNSRecord[]
}

export const useTemplateStore = defineStore('template', () => {
  const templates = ref<Template[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTemplates = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/api/templates')
      templates.value = response.data
    } catch (err) {
      error.value = 'Erro ao carregar templates'
      console.error('Erro ao carregar templates:', err)
    } finally {
      loading.value = false
    }
  }

  const createTemplate = async (data: Omit<Template, 'id'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/api/templates', data)
      templates.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Erro ao criar template'
      console.error('Erro ao criar template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTemplate = async (id: number, data: Partial<Template>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/api/templates/${id}`, data)
      const index = templates.value.findIndex(t => t.id === id)
      if (index !== -1) {
        templates.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Erro ao atualizar template'
      console.error('Erro ao atualizar template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTemplate = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await axios.delete(`/api/templates/${id}`)
      templates.value = templates.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = 'Erro ao excluir template'
      console.error('Erro ao excluir template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  }
}) 