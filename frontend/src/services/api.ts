import axios from 'axios'

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Cache de requisições
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos em milissegundos

// Função para gerar chave de cache
const getCacheKey = (method: string, url: string, data?: any) => {
    return `${method}:${url}:${data ? JSON.stringify(data) : ''}`
}

// Função para verificar se o cache é válido
const isCacheValid = (timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION
}

// Interceptor para cache de requisições
api.interceptors.request.use(
    async (config) => {
        if (config.method?.toLowerCase() === 'get') {
            const cacheKey = getCacheKey(config.method, config.url || '', config.data)
            const cachedResponse = cache.get(cacheKey)

            if (cachedResponse && isCacheValid(cachedResponse.timestamp)) {
                // Retorna os dados do cache
                return Promise.reject({
                    config,
                    response: { data: cachedResponse.data, status: 304 }
                })
            }
        }

        console.log('Enviando requisição:', {
            method: config.method,
            url: config.url,
            data: config.data
        })
        return config
    },
    (error) => {
        console.error('Erro na requisição:', error)
        return Promise.reject(error)
    }
)

// Interceptor para respostas
api.interceptors.response.use(
    (response) => {
        // Armazena a resposta no cache para requisições GET
        if (response.config.method?.toLowerCase() === 'get') {
            const cacheKey = getCacheKey(
                response.config.method,
                response.config.url || '',
                response.config.data
            )
            cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            })
        }

        console.log('Resposta recebida:', {
            status: response.status,
            data: response.data
        })
        return response
    },
    (error) => {
        // Se o erro for do cache, retorna os dados do cache
        if (error.response?.status === 304) {
            return Promise.resolve(error.response)
        }

        console.error('Erro na resposta:', error.response || error)
        return Promise.reject(error)
    }
)

// Função para limpar o cache
export const clearCache = () => {
    cache.clear()
}

export const domainService = {
    // Função para limpar cache específico
    clearCache: (pattern?: string) => {
        if (pattern) {
            for (const key of cache.keys()) {
                if (key.includes(pattern)) {
                    cache.delete(key)
                }
            }
        } else {
            cache.clear()
        }
    },

    // Domínios
    getDomains: () => api.get('/domains'),
    getDomain: (id: string) => api.get(`/domains/${id}`),
    createDomain: (data: any) => {
        domainService.clearCache('/domains')
        return api.post('/domains', data)
    },
    updateDomain: (id: string, data: any) => {
        domainService.clearCache('/domains')
        return api.put(`/domains/${id}`, data)
    },
    deleteDomain: (id: string) => {
        domainService.clearCache('/domains')
        return api.delete(`/domains/${id}`)
    },
    checkDomainStatus: (id: string) => api.post(`/domains/${id}/check-status`),
    renewDomain: (id: string) => api.post(`/domains/${id}/renew`),

    // Registradores
    getRegistrars: () => api.get('/registrars'),
    getRegistrar: (id: string) => api.get(`/registrars/${id}`),
    createRegistrar: (data: any) => {
        domainService.clearCache('/registrars')
        return api.post('/registrars', data)
    },
    updateRegistrar: (id: string, data: any) => {
        domainService.clearCache('/registrars')
        return api.put(`/registrars/${id}`, data)
    },
    deleteRegistrar: (id: string) => {
        domainService.clearCache('/registrars')
        return api.delete(`/registrars/${id}`)
    },
    testRegistrarConnection: (id: string) => api.post(`/registrars/${id}/test-connection`),

    // Registros DNS
    getDnsRecords: (domainId: string) => api.get(`/domains/${domainId}/dns-records`),
    createDnsRecord: (domainId: string, data: any) => {
        domainService.clearCache(`/domains/${domainId}/dns-records`)
        return api.post(`/domains/${domainId}/dns-records`, data)
    },
    updateDnsRecord: (domainId: string, recordId: string, data: any) => {
        domainService.clearCache(`/domains/${domainId}/dns-records`)
        return api.put(`/domains/${domainId}/dns-records/${recordId}`, data)
    },
    deleteDnsRecord: (domainId: string, recordId: string) => {
        domainService.clearCache(`/domains/${domainId}/dns-records`)
        return api.delete(`/domains/${domainId}/dns-records/${recordId}`)
    },

    // Certificados SSL
    getSslCertificates: (domainId: string) => api.get(`/domains/${domainId}/ssl-certificates`),
    createSslCertificate: (domainId: string, data: any) => {
        domainService.clearCache(`/domains/${domainId}/ssl-certificates`)
        return api.post(`/domains/${domainId}/ssl-certificates`, data)
    },
    updateSslCertificate: (domainId: string, certificateId: string, data: any) => {
        domainService.clearCache(`/domains/${domainId}/ssl-certificates`)
        return api.put(`/domains/${domainId}/ssl-certificates/${certificateId}`, data)
    },
    deleteSslCertificate: (domainId: string, certificateId: string) => {
        domainService.clearCache(`/domains/${domainId}/ssl-certificates`)
        return api.delete(`/domains/${domainId}/ssl-certificates/${certificateId}`)
    },
    renewSslCertificate: (domainId: string, certificateId: string) => api.post(`/domains/${domainId}/ssl-certificates/${certificateId}/renew`),

    // Transferências
    getTransfers: (domainId: string) => api.get(`/domains/${domainId}/transfers`),
    getAllTransfers: () => api.get('/transfers'),
    createTransfer: (domainId: string, data: any) => {
        domainService.clearCache('/transfers')
        domainService.clearCache(`/domains/${domainId}/transfers`)
        return api.post(`/domains/${domainId}/transfers`, data)
    },
    updateTransfer: (domainId: string, transferId: string, data: any) => {
        domainService.clearCache('/transfers')
        domainService.clearCache(`/domains/${domainId}/transfers`)
        return api.put(`/domains/${domainId}/transfers/${transferId}`, data)
    },
    deleteTransfer: (domainId: string, transferId: string) => {
        domainService.clearCache('/transfers')
        domainService.clearCache(`/domains/${domainId}/transfers`)
        return api.delete(`/domains/${domainId}/transfers/${transferId}`)
    },
    getTransferStatus: (domainId: string, transferId: string) => api.get(`/domains/${domainId}/transfers/${transferId}/status`),
    cancelTransfer: (domainId: string, transferId: string) => {
        domainService.clearCache('/transfers')
        domainService.clearCache(`/domains/${domainId}/transfers`)
        return api.post(`/domains/${domainId}/transfers/${transferId}/cancel`)
    },
    resendTransferEmail: (domainId: string, transferId: string) => api.post(`/domains/${domainId}/transfers/${transferId}/resend-email`),
    getTransferCost: (domainId: string, registrarId: string) => api.get(`/domains/${domainId}/transfer-cost/${registrarId}`),

    // Segurança
    getSecuritySettings: () => api.get('/security/settings'),
    updateSecuritySettings: (settings: any) => {
        domainService.clearCache('/security/settings')
        return api.put('/security/settings', settings)
    },
    generateBackupCodes: () => api.post('/security/backup-codes'),
    revokeAllSessions: () => api.post('/security/revoke-sessions')
} 