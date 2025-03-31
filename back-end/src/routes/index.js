const express = require('express');
const router = express.Router();

const DomainController = require('../controllers/DomainController');
const RegistrarController = require('../controllers/RegistrarController');

// Rotas para Domínios
router.get('/domains', DomainController.index);
router.get('/domains/:id', DomainController.show);
router.post('/domains', DomainController.store);
router.put('/domains/:id', DomainController.update);
router.delete('/domains/:id', DomainController.destroy);

// Rotas para Registradores
router.get('/registrars', RegistrarController.index);
router.get('/registrars/:id', RegistrarController.show);
router.post('/registrars', RegistrarController.store);
router.put('/registrars/:id', RegistrarController.update);
router.delete('/registrars/:id', RegistrarController.destroy);

module.exports = router; 