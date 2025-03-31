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

// Rotas da API
app.use('/api', routes);

// Iniciar verificação agendada de domínios
scheduleDomainCheck();

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        details: err.message
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 