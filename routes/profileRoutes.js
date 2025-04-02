const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const {authMiddleware, adminMiddleware, checkOwnershipOrAdmin} = require('../middleware/authMiddleware');
const {validateCreateProfile, handleValidationErrors, validatePassword} = require('../middleware/validationMiddleware');

// Rutas para el perfil
router.post('/', validateCreateProfile, handleValidationErrors, profileController.create);  // Crear un perfil
router.get('/:id', authMiddleware, profileController.getById);  // Obtener perfil por ID
router.put('/:id', authMiddleware, checkOwnershipOrAdmin, profileController.update);  // Actualizar perfil
router.delete('/:id', authMiddleware, adminMiddleware, profileController.remove);  // Eliminar perfil
router.post('/change-password', authMiddleware, validatePassword, handleValidationErrors, profileController.changePassword);  // Cambiar contraseña

module.exports = router;
