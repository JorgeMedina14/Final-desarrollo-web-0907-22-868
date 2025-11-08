import React, { useState, useRef } from 'react';
import TablaSencilla from './TablaSencilla';
import '../styles/CRUD.css';

function CRUD() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    userId: 1,
    title: '',
    completed: false
  });
  
  const dialogRef = useRef(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        userId: item.userId,
        title: item.title,
        completed: item.completed
      });
    } else {
      setEditingItem(null);
      setFormData({
        userId: 1,
        title: '',
        completed: false
      });
    }
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setEditingItem(null);
    setFormData({
      userId: 1,
      title: '',
      completed: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      if (editingItem) {
        // Actualizar
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${editingItem.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              id: editingItem.id
            })
          }
        );
        const updatedItem = await response.json();
        
        setTodos(todos.map(todo => 
          todo.id === editingItem.id ? { ...updatedItem, id: editingItem.id } : todo
        ));
        
        alert('Registro actualizado correctamente');
      } else {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        const newItem = await response.json();
        
        const newId = Math.max(...todos.map(t => t.id), 0) + 1;
        setTodos([{ ...newItem, id: newId }, ...todos]);
        
        alert('Registro creado correctamente');
      }
      
      closeDialog();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el registro');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Estas seguro de eliminar este registro?')) {
      return;
    }

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE'
      });
      
      setTodos(todos.filter(todo => todo.id !== id));
      alert('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el registro');
    }
  };

  if (loading) {
    return <div className="crud-loading">Cargando datos...</div>;
  }

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>📝 Gestión de Tareas (CRUD)</h2>
        <button className="btn-nuevo" onClick={() => openDialog()}>
          ➕ Nueva Tarea
        </button>
      </div>

      <TablaSencilla 
        datos={todos}
        onEdit={openDialog}
        onDelete={handleDelete}
      />

      {/* Dialog HTML5 para formulario */}
      <dialog ref={dialogRef} className="crud-dialog">
        <div className="dialog-header">
          <h3>{editingItem ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}</h3>
          <button className="close-dialog" onClick={closeDialog}>×</button>
        </div>
        
        <div className="dialog-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userId">Usuario ID:</label>
              <input
                type="number"
                id="userId"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Título:</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ingresa el título de la tarea"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              />
              <label htmlFor="completed">¿Tarea completada?</label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={closeDialog}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar">
                {editingItem ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default CRUD;
