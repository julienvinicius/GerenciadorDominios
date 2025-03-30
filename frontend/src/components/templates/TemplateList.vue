<script setup lang="ts">
import { ref } from 'vue'
import TemplateForm from './TemplateForm.vue'

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

const templates = ref<Template[]>([
  {
    id: 1,
    name: 'Template Básico',
    description: 'Configuração básica de DNS com registros A e CNAME',
    records: [
      { type: 'A', name: '@', content: '192.168.1.1', ttl: 3600 },
      { type: 'CNAME', name: 'www', content: '@', ttl: 3600 }
    ]
  },
  {
    id: 2,
    name: 'Template Email',
    description: 'Configuração para servidores de email',
    records: [
      { type: 'MX', name: '@', content: 'mail.example.com', ttl: 3600, priority: 10 },
      { type: 'TXT', name: '@', content: 'v=spf1 mx -all', ttl: 3600 }
    ]
  }
])

const showForm = ref(false)
const selectedTemplate = ref<Template | undefined>(undefined)

const handleAdd = () => {
  selectedTemplate.value = undefined
  showForm.value = true
}

const handleEdit = (template: Template) => {
  selectedTemplate.value = template
  showForm.value = true
}

const handleDelete = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir este template?')) return
  
  // TODO: Implementar chamada à API
  templates.value = templates.value.filter(t => t.id !== id)
}

const handleSubmit = async (data: any) => {
  // TODO: Implementar chamada à API
  if (data.id) {
    // Editar
    const index = templates.value.findIndex(t => t.id === data.id)
    if (index !== -1) {
      templates.value[index] = { ...templates.value[index], ...data }
    }
  } else {
    // Adicionar
    templates.value.push({
      ...data,
      id: Math.max(...templates.value.map(t => t.id)) + 1
    })
  }
  
  showForm.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">Templates de DNS</h2>
      <button
        @click="handleAdd"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Adicionar Template
      </button>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="template in templates" :key="template.id" class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ template.name }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ template.description }}</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="(record, index) in template.records"
                  :key="index"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ record.type }} {{ record.name }}
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="handleEdit(template)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                @click="handleDelete(template.id)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <TemplateForm
      v-if="showForm"
      :template="selectedTemplate"
      @close="showForm = false"
      @submit="handleSubmit"
    />
  </div>
</template> 