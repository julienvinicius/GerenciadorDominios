<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Editar Template DNS' : 'Novo Template DNS' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome do Template</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="input-field"
              placeholder="Ex: Template WordPress"
              required
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              id="description"
              v-model="form.description"
              class="input-field"
              rows="3"
              placeholder="Descreva o propósito deste template"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Registros DNS</label>
            <div class="space-y-4">
              <div v-for="(record, index) in form.records" :key="index" class="flex items-start space-x-4">
                <div class="flex-1">
                  <select
                    v-model="record.type"
                    class="input-field"
                  >
                    <option value="A">A</option>
                    <option value="AAAA">AAAA</option>
                    <option value="CNAME">CNAME</option>
                    <option value="MX">MX</option>
                    <option value="TXT">TXT</option>
                    <option value="NS">NS</option>
                    <option value="SRV">SRV</option>
                  </select>
                </div>
                <div class="flex-1">
                  <input
                    type="text"
                    v-model="record.name"
                    class="input-field"
                    placeholder="Nome do registro"
                  />
                </div>
                <div class="flex-1">
                  <input
                    type="text"
                    v-model="record.value"
                    class="input-field"
                    placeholder="Valor do registro"
                  />
                </div>
                <div class="w-24">
                  <input
                    type="number"
                    v-model="record.ttl"
                    class="input-field"
                    placeholder="TTL"
                  />
                </div>
                <button
                  type="button"
                  @click="removeRecord(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addRecord"
              class="mt-2 btn-secondary w-full"
            >
              Adicionar Registro
            </button>
          </div>

          <div class="flex justify-end space-x-4">
            <button type="button" @click="$emit('close')" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Salvar Alterações' : 'Criar Template' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  template?: {
    id: number
    name: string
    description: string
    records: Array<{
      type: string
      name: string
      value: string
      ttl: number
    }>
  }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const isEditing = !!props.template

const form = ref({
  name: '',
  description: '',
  records: [] as Array<{
    type: string
    name: string
    value: string
    ttl: number
  }>
})

onMounted(() => {
  if (props.template) {
    form.value = {
      name: props.template.name,
      description: props.template.description,
      records: [...props.template.records]
    }
  }
})

const addRecord = () => {
  form.value.records.push({
    type: 'A',
    name: '',
    value: '',
    ttl: 3600
  })
}

const removeRecord = (index: number) => {
  form.value.records.splice(index, 1)
}

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    id: props.template?.id
  })
}
</script> 