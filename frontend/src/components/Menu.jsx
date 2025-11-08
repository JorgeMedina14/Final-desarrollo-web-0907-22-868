import React from 'react';
import '../styles/Menu.css';

function Menu({ currentView, setCurrentView, onLogout }) {
  return (
    <nav className="menu">
      <div className="menu-brand">
        <h2>Proyecto Final</h2>
      </div>
      
      <div className="menu-items">
        <button 
          className={currentView === 'crud' ? 'active' : ''} 
          onClick={() => setCurrentView('crud')}
        >
          CRUD
        </button>
        
        <button 
          className={currentView === 'gallery' ? 'active' : ''} 
          onClick={() => setCurrentView('gallery')}
        >
          Galeria
        </button>
        
        <button 
          className={currentView === 'form' ? 'active' : ''} 
          onClick={() => setCurrentView('form')}
        >
          Formulario Dinamico
        </button>
      </div>

      <button className="logout-button" onClick={onLogout}>
        Cerrar Sesion
      </button>
    </nav>
  );
}

export default Menu;
