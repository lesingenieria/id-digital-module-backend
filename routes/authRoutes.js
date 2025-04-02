// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const ms = require('ms');
const { getProfileByEmail } = require('../models/Profile'); // Asegúrate de tener esta función en tu modelo

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar el perfil por email
    const profile = await getProfileByEmail(email);
    if (!profile) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }
    
    // Comparar la contraseña proporcionada con la almacenada (encriptada)
    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }
    
    // Generar el JWT (incluye el rol en el payload, por ejemplo)
    const token = jwt.sign(
      { userId: profile.id_uuid, role: profile.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log(token);

    // Puedes enviarlo en una cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(Date.now() + ms(process.env.JWT_EXPIRATION)) // 1 hora
    });
    
    return res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });
    
    return res.json({ message: 'Cierre de sesión exitoso' });
  });
  

module.exports = router;
