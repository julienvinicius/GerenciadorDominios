<!-- DomainDNS.vue -->
<template>
  <div class="domain-dns">
    <h2>Registros DNS</h2>
    
    <!-- Formulário para adicionar novo registro -->
    <div class="add-record-form" v-if="showAddForm">
      <h3>Adicionar Novo Registro</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="type">Tipo</label>
          <select v-model="newRecord.type" id="type" required>
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="MX">MX</option>
            <option value="TXT">TXT</option>
            <option value="NS">NS</option>
          </select>
        </div>

        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" v-model="newRecord.name" id="name" required>
        </div>

        <div class="form-group">
          <label for="content">Conteúdo</label>
          <input type="text" v-model="newRecord.content" id="content" required>
        </div>

        <div class="form-group" v-if="newRecord.type === 'MX'">
          <label for="priority">Prioridade</label>
          <input type="number" v-model="newRecord.priority" id="priority" min="0">
        </div>

        <div class="form-group">
          <label for="ttl">TTL</label>
          <input type="number" v-model="newRecord.ttl" id="ttl" min="0" required>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Salvar</button>
          <button type="button" @click="showAddForm = false" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Lista de registros -->
    <div class="records-list">
      <div class="list-header">
        <button @click="showAddForm = true" class="btn-primary" v-if="!showAddForm">
          Adicionar Registro
        </button>
      </div>

      <table v-if="records.length">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Conteúdo</th>
            <th>TTL</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.type }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.content }}</td>
            <td>{{ record.ttl }}</td>
            <td>
              <button @click="editRecord(record)" class="btn-secondary">Editar</button>
              <button @click="deleteRecord(record.id)" class="btn-danger">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="no-records">
        Nenhum registro DNS encontrado
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { domainService } from '@/services/api'

interface DnsRecord {
  id: string
  type: string
  name: string
  content: string
  ttl: number
  priority?: number
}

export default defineComponent({
  name: 'DomainDNS',
  
  setup() {
    const route = useRoute()
    const records = ref<DnsRecord[]>([])
    const showAddForm = ref(false)
    const newRecord = ref({
      type: 'A',
      name: '',
      content: '',
      ttl: 3600,
      priority: 0
    })

    const loadRecords = async () => {
      try {
        const response = await domainService.getDnsRecords(route.params.id as string)
        records.value = response.data
      } catch (error) {
        console.error('Erro ao carregar registros DNS:', error)
      }
    }

    const handleSubmit = async () => {
      try {
        await domainService.createDnsRecord(route.params.id as string, newRecord.value)
        await loadRecords()
        showAddForm.value = false
        newRecord.value = {
          type: 'A',
          name: '',
          content: '',
          ttl: 3600,
          priority: 0
        }
      } catch (error) {
        console.error('Erro ao criar registro DNS:', error)
      }
    }

    const editRecord = (record: DnsRecord) => {
      newRecord.value = {
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        priority: record.priority || 0
      }
      showAddForm.value = true
    }

    const deleteRecord = async (recordId: string) => {
      if (!confirm('Tem certeza que deseja excluir este registro?')) return

      try {
        await domainService.deleteDnsRecord(route.params.id as string, recordId)
        await loadRecords()
      } catch (error) {
        console.error('Erro ao excluir registro DNS:', error)
      }
    }

    onMounted(loadRecords)

    return {
      records,
      showAddForm,
      newRecord,
      handleSubmit,
      editRecord,
      deleteRecord
    }
  }
})
</script>

<style scoped>
.domain-dns {
  padding: 20px;
}

.add-record-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.records-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.list-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  background: #f9f9f9;
}

.no-records {
  padding: 20px;
  text-align: center;
  color: #666;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.btn-danger {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-danger:hover {
  opacity: 0.9;
}
</style> 