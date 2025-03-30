import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Interceptor para logs de requisição
api.interceptors.request.use(
    (config) => {
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

// Interceptor para logs de resposta
api.interceptors.response.use(
    (response) => {
        console.log('Resposta recebida:', {
            status: response.status,
            data: response.data
        })
        return response
    },
    (error) => {
        console.error('Erro na resposta:', error.response || error)
        return Promise.reject(error)
    }
)

export const domainService = {
    // Domínios
    getDomains: () => api.get('/domains'),
    getDomain: (id: string) => api.get(`/domains/${id}`),
    createDomain: (data: any) => api.post('/domains', data),
    updateDomain: (id: string, data: any) => api.put(`/domains/${id}`, data),
    deleteDomain: (id: string) => api.delete(`/domains/${id}`),
    checkDomainStatus: (id: string) => api.post(`/domains/${id}/check-status`),
    renewDomain: (id: string) => api.post(`/domains/${id}/renew`),

    // Registradores
    getRegistrars: () => api.get('/registrars'),
    getRegistrar: (id: string) => api.get(`/registrars/${id}`),
    createRegistrar: (data: any) => api.post('/registrars', data),
    updateRegistrar: (id: string, data: any) => api.put(`/registrars/${id}`, data),
    deleteRegistrar: (id: string) => api.delete(`/registrars/${id}`),
    testRegistrarConnection: (id: string) => api.post(`/registrars/${id}/test-connection`),

    // Registros DNS
    getDnsRecords: (domainId: string) => api.get(`/domains/${domainId}/dns-records`),
    createDnsRecord: (domainId: string, data: any) => api.post(`/domains/${domainId}/dns-records`, data),
    updateDnsRecord: (domainId: string, recordId: string, data: any) => api.put(`/domains/${domainId}/dns-records/${recordId}`, data),
    deleteDnsRecord: (domainId: string, recordId: string) => api.delete(`/domains/${domainId}/dns-records/${recordId}`),

    // Certificados SSL
    getSslCertificates: (domainId: string) => api.get(`/domains/${domainId}/ssl-certificates`),
    createSslCertificate: (domainId: string, data: any) => api.post(`/domains/${domainId}/ssl-certificates`, data),
    updateSslCertificate: (domainId: string, certificateId: string, data: any) => api.put(`/domains/${domainId}/ssl-certificates/${certificateId}`, data),
    deleteSslCertificate: (domainId: string, certificateId: string) => api.delete(`/domains/${domainId}/ssl-certificates/${certificateId}`),
    renewSslCertificate: (domainId: string, certificateId: string) => api.post(`/domains/${domainId}/ssl-certificates/${certificateId}/renew`),

    // Transferências de Domínio
    getTransfers: (domainId: string) => api.get(`/domains/${domainId}/transfers`),
    createTransfer: (domainId: string, data: any) => api.post(`/domains/${domainId}/transfers`, data),
    updateTransfer: (domainId: string, transferId: string, data: any) => api.put(`/domains/${domainId}/transfers/${transferId}`, data),
    deleteTransfer: (domainId: string, transferId: string) => api.delete(`/domains/${domainId}/transfers/${transferId}`),
    checkTransferStatus: (domainId: string, transferId: string) => api.post(`/domains/${domainId}/transfers/${transferId}/check-status`),

    // Segurança
    getSecuritySettings: () => api.get('/security/settings'),
    updateSecuritySettings: (settings: any) => api.put('/security/settings', settings),
    generateBackupCodes: () => api.post('/security/backup-codes'),
    revokeAllSessions: () => api.post('/security/revoke-sessions')
} 