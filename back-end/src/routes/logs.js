const express = require('express');
const router = express.Router();
const LogController = require('../controllers/LogController');

// Listar todos os logs
router.get('/', LogController.index);

// Registrar um novo log
router.post('/', LogController.store);

// Buscar logs por domínio
router.get('/domain/:domain_id', LogController.getByDomain);

// Buscar logs por registrador
router.get('/registrar/:registrar_id', LogController.getByRegistrar);

module.exports = router; 