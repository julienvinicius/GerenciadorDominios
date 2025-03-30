<script setup lang="ts">
import { ref } from 'vue'

interface DNSRecord {
  type: string
  name: string
  content: string
  ttl: number
  priority?: number
}

const props = defineProps<{
  template?: {
    id: number
    name: string
    description: string
    records: DNSRecord[]
  }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const formData = ref({
  name: props.template?.name || '',
  description: props.template?.description || '',
  records: props.template?.records || [
    { type: 'A', name: '@', content: '', ttl: 3600 }
  ]
})

const errors = ref<Record<string, string>>({})

const recordTypes = [
  'A',
  'AAAA',
  'CNAME',
  'MX',
  'TXT',
  'NS',
  'SRV',
  'CAA'
]

const addRecord = () => {
  formData.value.records.push({
    type: 'A',
    name: '@',
    content: '',
    ttl: 3600
  })
}

const removeRecord = (index: number) => {
  formData.value.records.splice(index, 1)
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.name) {
    errors.value.name = 'O nome é obrigatório'
  }

  if (!formData.value.description) {
    errors.value.description = 'A descrição é obrigatória'
  }

  if (formData.value.records.length === 0) {
    errors.value.records = 'Adicione pelo menos um registro'
    return false
  }

  let hasRecordError = false
  formData.value.records.forEach((record, index) => {
    if (!record.name) {
      errors.value[`record-${index}-name`] = 'O nome é obrigatório'
      hasRecordError = true
    }
    if (!record.content) {
      errors.value[`record-${index}-content`] = 'O conteúdo é obrigatório'
      hasRecordError = true
    }
    if (record.type === 'MX' && !record.priority) {
      errors.value[`record-${index}-priority`] = 'A prioridade é obrigatória para registros MX'
      hasRecordError = true
    }
  })

  return !hasRecordError && Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  emit('submit', {
    ...formData.value,
    id: props.template?.id
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ props.template ? 'Editar Template' : 'Novo Template' }}
        </h3>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Nome e Descrição -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.name }"
            />
            <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
            <input
              type="text"
              id="description"
              v-model="formData.description"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.description }"
            />
            <p v-if="errors.description" class="mt-2 text-sm text-red-600">{{ errors.description }}</p>
          </div>
        </div>

        <!-- Registros DNS -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-base font-medium text-gray-900">Registros DNS</h4>
            <button
              type="button"
              @click="addRecord"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Adicionar Registro
            </button>
          </div>

          <div v-if="errors.records" class="mb-4 text-sm text-red-600">
            {{ errors.records }}
          </div>

          <div class="space-y-4">
            <div
              v-for="(record, index) in formData.records"
              :key="index"
              class="bg-gray-50 p-4 rounded-lg"
            >
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-5">
                <!-- Tipo -->
                <div>
                  <label :for="'record-type-' + index" class="block text-xs font-medium text-gray-700">Tipo</label>
                  <select
                    :id="'record-type-' + index"
                    v-model="record.type"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option v-for="type in recordTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>

                <!-- Nome -->
                <div>
                  <label :for="'record-name-' + index" class="block text-xs font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    :id="'record-name-' + index"
                    v-model="record.name"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="{ 'border-red-300': errors[`record-${index}-name`] }"
                  />
                  <p v-if="errors[`record-${index}-name`]" class="mt-1 text-xs text-red-600">
                    {{ errors[`record-${index}-name`] }}
                  </p>
                </div>

                <!-- Conteúdo -->
                <div>
                  <label :for="'record-content-' + index" class="block text-xs font-medium text-gray-700">Conteúdo</label>
                  <input
                    type="text"
                    :id="'record-content-' + index"
                    v-model="record.content"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="{ 'border-red-300': errors[`record-${index}-content`] }"
                  />
                  <p v-if="errors[`record-${index}-content`]" class="mt-1 text-xs text-red-600">
                    {{ errors[`record-${index}-content`] }}
                  </p>
                </div>

                <!-- TTL -->
                <div>
                  <label :for="'record-ttl-' + index" class="block text-xs font-medium text-gray-700">TTL</label>
                  <input
                    type="number"
                    :id="'record-ttl-' + index"
                    v-model="record.ttl"
                    min="60"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <!-- Prioridade (apenas para MX) -->
                <div v-if="record.type === 'MX'">
                  <label :for="'record-priority-' + index" class="block text-xs font-medium text-gray-700">Prioridade</label>
                  <input
                    type="number"
                    :id="'record-priority-' + index"
                    v-model="record.priority"
                    min="0"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="{ 'border-red-300': errors[`record-${index}-priority`] }"
                  />
                  <p v-if="errors[`record-${index}-priority`]" class="mt-1 text-xs text-red-600">
                    {{ errors[`record-${index}-priority`] }}
                  </p>
                </div>

                <!-- Remover Registro -->
                <div v-if="formData.records.length > 1" class="flex items-end">
                  <button
                    type="button"
                    @click="removeRecord(index)"
                    class="text-red-600 hover:text-red-700"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ props.template ? 'Salvar' : 'Adicionar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 