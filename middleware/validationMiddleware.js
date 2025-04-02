// middlewares/validationMiddleware.js
const { body, validationResult } = require("express-validator");
const passwordValidation = body("password")
  .isLength({ min: 8 })
  .withMessage("La contraseña debe tener al menos 8 caracteres")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
  .withMessage(
    "La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales"
  );

// Validaciones comunes para crear un perfil
const validateCreateProfile = [
  body("email").isEmail().withMessage("Debe ser un correo electrónico válido"),
  body("email").normalizeEmail(),
  passwordValidation,
];

const validatePassword = [passwordValidation];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCreateProfile,
  handleValidationErrors,
  validatePassword,
};
