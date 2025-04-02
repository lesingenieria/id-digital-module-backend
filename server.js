const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());  // Para parsear JSON
app.use(cookieParser());

app.use('/api', authRoutes);  // Rutas de autenticación
app.use('/api/profiles', profileRoutes);  // Rutas de perfiles

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
