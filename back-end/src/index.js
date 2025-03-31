require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware para CORS
app.use(cors());

// Middleware para parsing de JSON
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        message: 'API do Gerenciador de Domínios está funcionando!',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Rotas da API
app.use('/api', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
    });
});

// Exportar o app para o Vercel
module.exports = app;

// Iniciar o servidor apenas se não estiver no Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
} 