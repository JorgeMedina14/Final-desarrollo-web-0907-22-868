import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        onLogin();
      } else {
        setError('Error al iniciar sesión');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesion</h1>
        <p className="login-info">Usuario: <strong>admin</strong></p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Iniciando sesion...' : 'Entrar como Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
