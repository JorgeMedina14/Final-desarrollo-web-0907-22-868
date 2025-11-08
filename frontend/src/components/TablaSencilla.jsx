import React from 'react';
import '../styles/TablaSencilla.css';

function TablaSencilla({ datos, onEdit, onDelete }) {
  if (!datos || datos.length === 0) {
    return (
      <div className="tabla-vacia">
        <p>No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="tabla-container">
      <table className="tabla-sencilla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario ID</th>
            <th>Título</th>
            <th>Completado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td className="titulo-cell">{item.title}</td>
              <td>
                <span className={`badge ${item.completed ? 'completado' : 'pendiente'}`}>
                  {item.completed ? '✓ Completado' : '○ Pendiente'}
                </span>
              </td>
              <td className="acciones-cell">
                <button 
                  className="btn-editar" 
                  onClick={() => onEdit(item)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  className="btn-eliminar" 
                  onClick={() => onDelete(item.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaSencilla;
