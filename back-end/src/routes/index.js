const express = require('express');
const router = express.Router();
const domainRoutes = require('./domains');
const registrarRoutes = require('./registrars');
const logRoutes = require('./logs');
const configRoutes = require('./configs');
const alertRoutes = require('./alerts');

// Rotas de domínios
router.use('/domains', domainRoutes);

// Rotas de registradores
router.use('/registrars', registrarRoutes);

// Rotas de logs
router.use('/logs', logRoutes);

// Rotas de configurações
router.use('/configs', configRoutes);

// Rotas de alertas
router.use('/alerts', alertRoutes);

module.exports = router; 