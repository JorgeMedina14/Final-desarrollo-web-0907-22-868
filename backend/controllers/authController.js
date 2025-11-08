const authController = {
  login: (req, res) => {
    req.session.usuario = 'admin';
    res.json({ 
      success: true, 
      mensaje: 'Sesion iniciada correctamente',
      usuario: 'admin',
      timestamp: new Date().toISOString()
    });
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error al cerrar sesion',
          detalle: err.message
        });
      }
      res.json({ 
        success: true, 
        mensaje: 'Sesion cerrada correctamente' 
      });
    });
  },

  sessionStatus: (req, res) => {
    if (req.session && req.session.usuario) {
      res.json({ 
        autenticado: true, 
        usuario: req.session.usuario,
        cookie: {
          expires: req.session.cookie.expires,
          maxAge: req.session.cookie.maxAge
        }
      });
    } else {
      res.json({ 
        autenticado: false,
        mensaje: 'No hay sesion activa'
      });
    }
  }
};

module.exports = authController;
