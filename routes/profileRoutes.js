const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('./middleware/authMiddleware');

// Rutas para el perfil
router.post('/', authMiddleware, profileController.create);  // Crear un perfil
router.get('/:id', authMiddleware, profileController.getById);  // Obtener perfil por ID
router.put('/:id', authMiddleware, profileController.update);  // Actualizar perfil
router.delete('/:id', authMiddleware, profileController.remove);  // Eliminar perfil

module.exports = router;
