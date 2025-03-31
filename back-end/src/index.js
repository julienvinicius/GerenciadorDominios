require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { scheduleDomainCheck } = require('./config/cron');

const app = express();

// Middleware para CORS
app.use(cors());

// Middleware para parsing de JSON
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API do Gerenciador de Domínios está funcionando!' });
});

// Rotas da API
app.use('/api', routes);

// Iniciar verificação agendada de domínios apenas se não estiver no Vercel
if (process.env.NODE_ENV !== 'production') {
    scheduleDomainCheck();
}

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        details: err.message
    });
});

const PORT = process.env.PORT || 8000;

// Exportar o app para o Vercel
module.exports = app;

// Iniciar o servidor apenas se não estiver no Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
} 