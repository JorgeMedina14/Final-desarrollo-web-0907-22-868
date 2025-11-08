import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Login from './components/Login';
import Menu from './components/Menu';
import CRUD from './components/CRUD';
import Gallery from './components/Gallery';
import DynamicForm from './components/DynamicForm';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('crud');
  const [loading, setLoading] = useState(true);

  // Verificar si existe sesión al cargar
  useEffect(() => {
    fetch('http://localhost:5000/auth/session-status', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setAuthenticated(data.autenticado);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .then(() => {
        setAuthenticated(false);
        setCurrentView('crud');
      });
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Menu 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      />
      
      <div className="main-content">
        {currentView === 'crud' && <CRUD />}
        {currentView === 'gallery' && <Gallery />}
        {currentView === 'form' && <DynamicForm />}
      </div>
    </div>
  );
}

export default App;
