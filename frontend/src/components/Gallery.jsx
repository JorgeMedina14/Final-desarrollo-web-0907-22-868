import React, { useState, useEffect, useRef } from 'react';
import '../styles/Gallery.css';

function Gallery({ images = [] }) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);

  // Cargar imágenes del backend solo una vez al montar
  useEffect(() => {
    fetchImagesFromBackend();
  }, []); // Array vacío = solo se ejecuta una vez

  const fetchImagesFromBackend = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/gallery', {
        credentials: 'include'
      });

      if (response.status === 401) {
        throw new Error('Sesión no válida. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        throw new Error('No se pudieron cargar las imágenes del servidor.');
      }

      const data = await response.json();
      
      if (data.imagenes && data.imagenes.length > 0) {
        setGalleryImages(data.imagenes.map(img => img.url));
      } else {
        setError('No hay imágenes disponibles en el servidor. Por favor, agrega imágenes en backend/images/');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar las imágenes');
      console.error('Error en fetchImagesFromBackend:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (index) => {
    setCurrentIndex(index);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  // Navegación con teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (dialogRef.current?.open) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeDialog();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []); // Sin dependencias para evitar re-renderizados

  if (loading) {
    return (
      <div className="gallery-loading">
        <p>Cargando galeria...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-error">
        <p>{error}</p>
        <button onClick={fetchImagesFromBackend} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <div className="gallery-empty">
        <p>No hay imagenes en la galeria</p>
        <small>Agrega imagenes en la carpeta backend/images/</small>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Galeria de Imagenes</h2>
        <p className="gallery-count">
          Total: <strong>{galleryImages.length}</strong> imagenes
        </p>
      </div>

      <div className="gallery-main-viewer">
        <button 
          className="nav-button prev" 
          onClick={prevImage}
          title="Imagen anterior"
        >
          ❮
        </button>
        
        <div className="main-image-container">
          <img 
            src={galleryImages[currentIndex]} 
            alt={`Imagen ${currentIndex + 1}`}
            className="main-image"
            onClick={() => openDialog(currentIndex)}
          />
          <div className="image-counter">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        </div>
        
        <button 
          className="nav-button next" 
          onClick={nextImage}
          title="Imagen siguiente"
        >
          ❯
        </button>
      </div>

      <div className="gallery-thumbnails">
        <h3>Miniaturas</h3>
        <div className="thumbnails-grid">
          {galleryImages.slice(0, 20).map((image, index) => (
            <div 
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => openDialog(index)}
            >
              <img 
                src={image} 
                alt={`Miniatura ${index + 1}`}
                loading="lazy"
              />
              <span className="thumbnail-number">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <dialog ref={dialogRef} className="gallery-dialog">
        <div className="dialog-header">
          <h3>Imagen {currentIndex + 1} de {galleryImages.length}</h3>
          <button className="close-dialog" onClick={closeDialog}>×</button>
        </div>
        
        <div className="dialog-content">
          <button className="dialog-nav prev" onClick={prevImage}>❮</button>
          
          <img 
            src={galleryImages[currentIndex]} 
            alt={`Imagen ampliada ${currentIndex + 1}`}
            className="dialog-image"
          />
          
          <button className="dialog-nav next" onClick={nextImage}>❯</button>
        </div>

        <div className="dialog-footer">
          <button onClick={prevImage} className="footer-btn">Anterior</button>
          <span>{currentIndex + 1} / {galleryImages.length}</span>
          <button onClick={nextImage} className="footer-btn">Siguiente</button>
        </div>
      </dialog>
    </div>
  );
}

export default Gallery;
