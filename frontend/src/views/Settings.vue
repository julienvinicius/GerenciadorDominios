<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Configurações do Sistema</h1>
          <p class="text-gray-500">Gerencie as configurações do gerenciador de domínios</p>
        </div>

        <!-- Tabs de Navegação -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Conteúdo das Tabs -->
          <div class="mt-8">
            <!-- Configurações Gerais -->
            <div v-if="activeTab === 'general'" class="space-y-6">
              <div>
                <label for="defaultTTL" class="block text-sm font-medium text-gray-700 mb-1">TTL Padrão (segundos)</label>
                <input
                  type="number"
                  id="defaultTTL"
                  v-model="generalSettings.defaultTTL"
                  class="input-field"
                  min="60"
                  max="86400"
                />
              </div>
              <div>
                <label for="defaultNameservers" class="block text-sm font-medium text-gray-700 mb-1">Nameservers Padrão</label>
                <textarea
                  id="defaultNameservers"
                  v-model="generalSettings.defaultNameservers"
                  class="input-field"
                  rows="3"
                  placeholder="ns1.exemplo.com&#10;ns2.exemplo.com"
                ></textarea>
              </div>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Verificação Automática de DNS</h3>
                  <p class="text-sm text-gray-500">Verificar automaticamente as alterações de DNS</p>
                </div>
                <button
                  type="button"
                  :class="[
                    generalSettings.autoCheckDNS ? 'bg-primary-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  ]"
                  @click="toggleAutoCheckDNS"
                >
                  <span
                    :class="[
                      generalSettings.autoCheckDNS ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    ]"
                  />
                </button>
              </div>
            </div>

            <!-- Registradores DNS -->
            <div v-if="activeTab === 'registrars'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Registradores DNS Configurados</h3>
                <button type="button" class="btn-primary">
                  Adicionar Registrador
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="registrar in registrars" :key="registrar.id" class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ registrar.name }}</h4>
                      <p class="text-sm text-gray-500">{{ registrar.apiUrl }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button type="button" class="btn-secondary btn-sm">
                        Editar
                      </button>
                      <button type="button" class="btn-danger btn-sm">
                        Remover
                      </button>
                    </div>
                  </div>
                  <div class="mt-2 text-sm text-gray-500">
                    <span class="inline-flex items-center">
                      <span :class="[
                        registrar.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                      ]">
                        {{ registrar.status === 'active' ? 'Ativo' : 'Inativo' }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Templates DNS -->
            <div v-if="activeTab === 'templates'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Templates DNS</h3>
                <button type="button" class="btn-primary">
                  Novo Template
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="template in dnsTemplates" :key="template.id" class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ template.name }}</h4>
                      <p class="text-sm text-gray-500">{{ template.description }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button type="button" class="btn-secondary btn-sm">
                        Editar
                      </button>
                      <button type="button" class="btn-danger btn-sm">
                        Remover
                      </button>
                    </div>
                  </div>
                  <div class="mt-2">
                    <span class="text-sm text-gray-500">
                      {{ template.records.length }} registros
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Integrações -->
            <div v-if="activeTab === 'integrations'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Integração com Cloudflare -->
                <div class="bg-gray-50 p-6 rounded-lg">
                  <div class="flex items-center mb-4">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">Cloudflare</h3>
                  </div>
                  <p class="text-sm text-gray-500 mb-4">Integre com Cloudflare para gerenciamento avançado de DNS e segurança</p>
                  <div class="flex items-center justify-between">
                    <span :class="[
                      integrations.cloudflare ? 'text-green-600' : 'text-gray-500',
                      'text-sm'
                    ]">
                      {{ integrations.cloudflare ? 'Conectado' : 'Não conectado' }}
                    </span>
                    <button type="button" class="btn-secondary btn-sm">
                      {{ integrations.cloudflare ? 'Desconectar' : 'Conectar' }}
                    </button>
                  </div>
                </div>

                <!-- Integração com Let's Encrypt -->
                <div class="bg-gray-50 p-6 rounded-lg">
                  <div class="flex items-center mb-4">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">Let's Encrypt</h3>
                  </div>
                  <p class="text-sm text-gray-500 mb-4">Gerenciamento automático de certificados SSL</p>
                  <div class="flex items-center justify-between">
                    <span :class="[
                      integrations.letsEncrypt ? 'text-green-600' : 'text-gray-500',
                      'text-sm'
                    ]">
                      {{ integrations.letsEncrypt ? 'Ativo' : 'Inativo' }}
                    </span>
                    <button type="button" class="btn-secondary btn-sm">
                      {{ integrations.letsEncrypt ? 'Desativar' : 'Ativar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Logs e Monitoramento -->
            <div v-if="activeTab === 'monitoring'" class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Configurações de Monitoramento</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Monitoramento de Disponibilidade</h4>
                      <p class="text-sm text-gray-500">Verificar status dos domínios periodicamente</p>
                    </div>
                    <button
                      type="button"
                      :class="[
                        monitoring.availability ? 'bg-primary-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                      ]"
                      @click="toggleAvailabilityMonitoring"
                    >
                      <span
                        :class="[
                          monitoring.availability ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        ]"
                      />
                    </button>
                  </div>
                  <div>
                    <label for="checkInterval" class="block text-sm font-medium text-gray-700 mb-1">Intervalo de Verificação (minutos)</label>
                    <input
                      type="number"
                      id="checkInterval"
                      v-model="monitoring.checkInterval"
                      class="input-field"
                      min="5"
                      max="1440"
                    />
                  </div>
                  <div>
                    <label for="alertThreshold" class="block text-sm font-medium text-gray-700 mb-1">Limite de Alertas (falhas)</label>
                    <input
                      type="number"
                      id="alertThreshold"
                      v-model="monitoring.alertThreshold"
                      class="input-field"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Segurança -->
            <div v-if="activeTab === 'security'" class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Configurações de Segurança</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Proteção contra Ataques DDoS</h4>
                      <p class="text-sm text-gray-500">Ativar proteção contra ataques distribuídos de negação de serviço</p>
                    </div>
                    <button
                      type="button"
                      :class="[
                        security.ddosProtection ? 'bg-primary-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                      ]"
                      @click="toggleDdosProtection"
                    >
                      <span
                        :class="[
                          security.ddosProtection ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        ]"
                      />
                    </button>
                  </div>
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">DNSSEC</h4>
                      <p class="text-sm text-gray-500">Ativar extensões de segurança do DNS</p>
                    </div>
                    <button
                      type="button"
                      :class="[
                        security.dnssec ? 'bg-primary-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                      ]"
                      @click="toggleDnssec"
                    >
                      <span
                        :class="[
                          security.dnssec ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        ]"
                      />
                    </button>
                  </div>
                  <div>
                    <label for="ipWhitelist" class="block text-sm font-medium text-gray-700 mb-1">Lista de IPs Permitidos</label>
                    <textarea
                      id="ipWhitelist"
                      v-model="security.ipWhitelist"
                      class="input-field"
                      rows="3"
                      placeholder="Digite os IPs permitidos, um por linha"
                    ></textarea>
                  </div>
                  <div>
                    <label for="rateLimit" class="block text-sm font-medium text-gray-700 mb-1">Limite de Requisições (por minuto)</label>
                    <input
                      type="number"
                      id="rateLimit"
                      v-model="security.rateLimit"
                      class="input-field"
                      min="10"
                      max="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Logs -->
            <div v-if="activeTab === 'logs'" class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Configurações de Logs</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Logs Detalhados</h4>
                      <p class="text-sm text-gray-500">Registrar informações detalhadas de todas as operações</p>
                    </div>
                    <button
                      type="button"
                      :class="[
                        logs.detailed ? 'bg-primary-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                      ]"
                      @click="toggleDetailedLogs"
                    >
                      <span
                        :class="[
                          logs.detailed ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        ]"
                      />
                    </button>
                  </div>
                  <div>
                    <label for="logRetention" class="block text-sm font-medium text-gray-700 mb-1">Retenção de Logs (dias)</label>
                    <input
                      type="number"
                      id="logRetention"
                      v-model="logs.retention"
                      class="input-field"
                      min="7"
                      max="365"
                    />
                  </div>
                  <div>
                    <label for="logLevel" class="block text-sm font-medium text-gray-700 mb-1">Nível de Log</label>
                    <select
                      id="logLevel"
                      v-model="logs.level"
                      class="input-field"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div class="flex justify-end">
                    <button type="button" class="btn-secondary">
                      Exportar Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Backup -->
            <div v-if="activeTab === 'backup'" class="space-y-6">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Backup Automático</h3>
                  <p class="text-sm text-gray-500">Realizar backup automático dos dados</p>
                </div>
                <button
                  type="button"
                  :class="[
                    backup.auto ? 'bg-primary-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  ]"
                  @click="toggleAutoBackup"
                >
                  <span
                    :class="[
                      backup.auto ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    ]"
                  />
                </button>
              </div>
              <div>
                <label for="backupFrequency" class="block text-sm font-medium text-gray-700 mb-1">Frequência do Backup</label>
                <select
                  id="backupFrequency"
                  v-model="backup.frequency"
                  class="input-field"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div class="flex justify-end space-x-4">
                <button type="button" class="btn-secondary">
                  Restaurar Backup
                </button>
                <button type="button" class="btn-primary">
                  Criar Backup Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Estado das tabs
const tabs = [
  { id: 'general', name: 'Geral' },
  { id: 'registrars', name: 'Registradores' },
  { id: 'templates', name: 'Templates DNS' },
  { id: 'integrations', name: 'Integrações' },
  { id: 'monitoring', name: 'Monitoramento' },
  { id: 'backup', name: 'Backup' },
  { id: 'security', name: 'Segurança' },
  { id: 'logs', name: 'Logs' }
]
const activeTab = ref('general')

// Estado das configurações gerais
const generalSettings = ref({
  defaultTTL: 3600,
  defaultNameservers: '',
  autoCheckDNS: true
})

// Estado dos registradores
const registrars = ref([
  {
    id: 1,
    name: 'Registro.br',
    apiUrl: 'https://api.registro.br',
    status: 'active'
  },
  {
    id: 2,
    name: 'GoDaddy',
    apiUrl: 'https://api.godaddy.com',
    status: 'inactive'
  }
])

// Estado dos templates DNS
const dnsTemplates = ref([
  {
    id: 1,
    name: 'Template Básico',
    description: 'Configuração básica com A, AAAA e MX',
    records: ['A', 'AAAA', 'MX']
  },
  {
    id: 2,
    name: 'Template WordPress',
    description: 'Configuração otimizada para WordPress',
    records: ['A', 'AAAA', 'MX', 'CNAME', 'TXT']
  }
])

// Estado das integrações
const integrations = ref({
  cloudflare: false,
  letsEncrypt: true
})

// Estado do monitoramento
const monitoring = ref({
  availability: true,
  checkInterval: 15,
  alertThreshold: 3
})

// Estado do backup
const backup = ref({
  auto: true,
  frequency: 'daily'
})

// Estado da segurança
const security = ref({
  ddosProtection: true,
  dnssec: false,
  ipWhitelist: '',
  rateLimit: 100
})

// Estado dos logs
const logs = ref({
  detailed: true,
  retention: 30,
  level: 'info'
})

// Funções
const updateGeneralSettings = () => {
  console.log('Atualizando configurações gerais:', generalSettings.value)
}

const toggleAutoCheckDNS = () => {
  generalSettings.value.autoCheckDNS = !generalSettings.value.autoCheckDNS
}

const toggleAvailabilityMonitoring = () => {
  monitoring.value.availability = !monitoring.value.availability
}

const toggleAutoBackup = () => {
  backup.value.auto = !backup.value.auto
}

const toggleDdosProtection = () => {
  security.value.ddosProtection = !security.value.ddosProtection
}

const toggleDnssec = () => {
  security.value.dnssec = !security.value.dnssec
}

const toggleDetailedLogs = () => {
  logs.value.detailed = !logs.value.detailed
}
</script> 