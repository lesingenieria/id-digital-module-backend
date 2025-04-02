const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. No se proporcionó token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(400).json({ message: "Token inválido." });
  }
};

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Se requiere rol de administrador." });
    }
  
    next();
  };

  const checkOwnershipOrAdmin = (req, res, next) => {
    const { id } = req.params; 
  
    if (req.user.role === "ADMIN" || req.user.userId === id) {
      return next();
    }
  
    return res.status(403).json({ message: "No tienes permisos para modificar este perfil." });
  };

module.exports =  {authMiddleware, adminMiddleware, checkOwnershipOrAdmin} ;
