const express = require('express');
const path = require('path');

const corsConfig = require('./config/cors');
const sessionConfig = require('./config/session');

const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsConfig);
app.use(express.json());
app.use(sessionConfig);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoutes);
app.use('/gallery', galleryRoutes);

app.get('/', (req, res) => {
  res.json({
    nombre: 'API Backend - Proyecto Final',
    version: '2.0.0',
    arquitectura: 'MVC Modular',
    descripcion: 'API REST para autenticacion y gestion de galeria de imagenes',
    endpoints: {
      autenticacion: {
        login: 'POST /auth/login',
        logout: 'POST /auth/logout',
        sessionStatus: 'GET /auth/session-status'
      },
      galeria: {
        listar: 'GET /gallery (requiere sesion)',
        obtener: 'GET /gallery?imagen=nombre.jpg (requiere sesion)'
      }
    },
    tecnologias: ['Node.js', 'Express', 'express-session', 'CORS']
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    mensaje: `La ruta ${req.method} ${req.path} no existe`,
    sugerencia: 'Visita GET / para ver los endpoints disponibles'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
});
