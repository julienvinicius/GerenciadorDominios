const express = require('express');
const router = express.Router();
const DomainController = require('../controllers/DomainController');

// Listar todos os domínios
router.get('/', DomainController.index);

// Buscar um domínio específico
router.get('/:id', DomainController.show);

// Criar um novo domínio
router.post('/', DomainController.store);

// Atualizar um domínio
router.put('/:id', DomainController.update);

// Excluir um domínio
router.delete('/:id', DomainController.destroy);

module.exports = router; 