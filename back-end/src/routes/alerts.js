const express = require('express');
const router = express.Router();
const AlertController = require('../controllers/AlertController');

// Listar todos os alertas
router.get('/', AlertController.index);

// Marcar alerta como lido
router.put('/:id/read', AlertController.markAsRead);

// Marcar todos os alertas como lidos
router.put('/read-all', AlertController.markAllAsRead);

// Buscar alertas não lidos
router.get('/unread', AlertController.getUnread);

// Verificar domínios próximos da expiração e criar alertas
router.post('/check-expiring', AlertController.checkExpiringDomains);

module.exports = router; 