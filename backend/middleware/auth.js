const verificarSesion = (req, res, next) => {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.status(401).json({ 
      error: 'No autorizado', 
      mensaje: 'Debe iniciar sesion primero',
      sugerencia: 'Usar POST /auth/login para autenticarse'
    });
  }
};

module.exports = { verificarSesion };
