<template>
  <div class="filters bg-white shadow-lg rounded-lg p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Filtros</h2>
        <p class="mt-1 text-sm text-gray-500">Refine sua busca por domínios</p>
      </div>
      <button
        @click="$emit('create-domain')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <svg class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Adicionar Domínio
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <!-- Busca -->
      <div class="relative">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
            placeholder="Buscar por domínio..."
            @input="$emit('search', ($event.target as HTMLInputElement).value)"
          >
        </div>
      </div>

      <!-- Status -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          id="status"
          :value="selectedStatus"
          @change="$emit('status-change', ($event.target as HTMLSelectElement).value)"
          class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors duration-200"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="expired">Expirados</option>
          <option value="expiring">A Expirar</option>
        </select>
      </div>

      <!-- Registrador -->
      <div>
        <label for="registrar" class="block text-sm font-medium text-gray-700 mb-1">Registrador</label>
        <select
          id="registrar"
          :value="selectedRegistrar"
          @change="$emit('registrar-change', ($event.target as HTMLSelectElement).value)"
          class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors duration-200"
        >
          <option value="all">Todos os Registradores</option>
          <option v-for="registrar in registrars" :key="registrar.id" :value="registrar.id">
            {{ registrar.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Registrar } from '@/types/registrar'

defineProps<{
  registrars: Registrar[]
  selectedStatus: string
  selectedRegistrar: string
}>()

defineEmits<{
  (e: 'search', term: string): void
  (e: 'status-change', status: string): void
  (e: 'registrar-change', registrarId: string): void
  (e: 'create-domain'): void
}>()
</script> 