const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/ConfigController');

// Listar todas as configurações
router.get('/', ConfigController.index);

// Atualizar uma configuração
router.put('/:key', ConfigController.update);

// Obter valor de uma configuração específica
router.get('/:key', ConfigController.getValue);

// Resetar configurações para valores padrão
router.post('/reset', ConfigController.reset);

module.exports = router; 