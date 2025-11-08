const fs = require('fs');
const path = require('path');

const galleryController = {
  getGallery: (req, res) => {
    const imagenSolicitada = req.query.imagen;
    const directorioImagenes = path.join(__dirname, '..', 'images');

    if (imagenSolicitada) {
      const rutaImagen = path.join(directorioImagenes, imagenSolicitada);
      
      if (fs.existsSync(rutaImagen)) {
        res.sendFile(rutaImagen);
      } else {
        res.status(404).json({ 
          error: 'Imagen no encontrada',
          imagen: imagenSolicitada,
          sugerencia: 'Usar GET /gallery para ver imagenes disponibles'
        });
      }
      return;
    }

    fs.readdir(directorioImagenes, (err, archivos) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error al leer directorio de imagenes',
          detalle: err.message
        });
      }

      const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      
      const imagenes = archivos.filter(archivo => {
        const ext = path.extname(archivo).toLowerCase();
        return extensionesValidas.includes(ext);
      });

      const PORT = process.env.PORT || 5000;
      const listaImagenes = imagenes.map(imagen => ({
        nombre: imagen,
        url: `http://localhost:${PORT}/images/${imagen}`,
        extension: path.extname(imagen)
      }));

      res.json({
        total: listaImagenes.length,
        imagenes: listaImagenes,
        mensaje: listaImagenes.length === 0 
          ? 'No hay imagenes en la galeria. Agrega imagenes en images/' 
          : `Se encontraron ${listaImagenes.length} imagenes`
      });
    });
  }
};

module.exports = galleryController;
