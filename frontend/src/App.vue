<script setup lang="ts">
import Sidebar from '@/components/layouts/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Conteúdo Principal -->
    <div class="pl-64">
      <!-- Barra Superior -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between h-16 px-6">
          <div class="flex items-center">
            <h2 class="text-lg font-semibold text-gray-800">
              {{ $route.meta.title }}
            </h2>
          </div>
        </div>
      </header>

      <!-- Conteúdo da Página -->
      <main class="p-6">
        <div class="max-w-7xl mx-auto">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
@import './style.css';
</style>
