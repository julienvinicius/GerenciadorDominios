import axios from 'axios'

const auth = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Interceptor para logs de requisição
auth.interceptors.request.use(
    (config) => {
        console.log('Enviando requisição de autenticação:', {
            method: config.method,
            url: config.url,
            data: config.data
        })
        return config
    },
    (error) => {
        console.error('Erro na requisição de autenticação:', error)
        return Promise.reject(error)
    }
)

// Interceptor para logs de resposta
auth.interceptors.response.use(
    (response) => {
        console.log('Resposta de autenticação recebida:', {
            status: response.status,
            data: response.data
        })
        return response
    },
    (error) => {
        console.error('Erro na resposta de autenticação:', error.response || error)
        return Promise.reject(error)
    }
)

export const authService = {
    getCsrfCookie: () => axios.get('/sanctum/csrf-cookie'),
    login: (credentials: { email: string; password: string }) => auth.post('/login', credentials),
    logout: () => auth.post('/logout'),
    getUser: () => auth.get('/user'),
    isAuthenticated: async () => {
        try {
            await authService.getUser()
            return true
        } catch {
            return false
        }
    }
}

export default authService 