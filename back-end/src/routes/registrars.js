const express = require('express');
const router = express.Router();
const RegistrarController = require('../controllers/RegistrarController');

// Listar todos os registradores
router.get('/', RegistrarController.index);

// Buscar um registrador específico
router.get('/:id', RegistrarController.show);

// Criar um novo registrador
router.post('/', RegistrarController.store);

// Atualizar um registrador
router.put('/:id', RegistrarController.update);

// Excluir um registrador
router.delete('/:id', RegistrarController.destroy);

module.exports = router; 