import React, { useState } from 'react';
import '../styles/DynamicForm.css';

function DynamicForm({ fields = [], onSubmit }) {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  // Configuración por defecto de ejemplo - Simplificado
  const defaultFields = [
    {
      label: 'Nombre',
      name: 'nombre',
      type: 'text',
      placeholder: 'Ingresa tu nombre',
      required: true
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'ejemplo@correo.com',
      required: true
    },
    {
      label: 'Mensaje',
      name: 'mensaje',
      type: 'textarea',
      placeholder: 'Escribe tu mensaje...',
      rows: 4,
      required: false
    }
  ];

  const formFields = fields.length > 0 ? fields : defaultFields;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      const currentValues = formValues[name] || [];
      if (checked) {
        setFormValues({
          ...formValues,
          [name]: [...currentValues, value]
        });
      } else {
        setFormValues({
          ...formValues,
          [name]: currentValues.filter(v => v !== value)
        });
      }
    } else if (type === 'file') {
      setFormValues({
        ...formValues,
        [name]: files[0]
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    formFields.forEach(field => {
      if (field.required) {
        const value = formValues[field.name];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `El campo ${field.label} es obligatorio`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formValues);
      } else {
        console.log('Datos del formulario:', formValues);
        alert('Formulario enviado correctamente!\n\nDatos:\n' + JSON.stringify(formValues, null, 2));
      }
    } else {
      alert('Por favor completa todos los campos obligatorios');
    }
  };

  const handleReset = () => {
    setFormValues({});
    setErrors({});
  };

  const renderField = (field) => {
    const { label, name, type, placeholder, required, options, ...rest } = field;
    const value = formValues[name] || '';
    const error = errors[name];

    switch (type) {
      case 'textarea':
        return (
          <div key={name} className="form-field">
            <label htmlFor={name}>
              {label} {required && <span className="required">*</span>}
            </label>
            <textarea
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className={error ? 'error' : ''}
              {...rest}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={name} className="form-field">
            <label htmlFor={name}>
              {label} {required && <span className="required">*</span>}
            </label>
            <select
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              className={error ? 'error' : ''}
              {...rest}
            >
              {options?.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'radio':
        return (
          <div key={name} className="form-field">
            <label>
              {label} {required && <span className="required">*</span>}
            </label>
            <div className="radio-group">
              {options?.map((opt, idx) => (
                <label key={idx} className="radio-label">
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={handleChange}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={name} className="form-field">
            <label>
              {label} {required && <span className="required">*</span>}
            </label>
            <div className="checkbox-group">
              {options?.map((opt, idx) => (
                <label key={idx} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={name}
                    value={opt.value}
                    checked={(formValues[name] || []).includes(opt.value)}
                    onChange={handleChange}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      default:
        return (
          <div key={name} className="form-field">
            <label htmlFor={name}>
              {label} {required && <span className="required">*</span>}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={type === 'file' ? undefined : value}
              onChange={handleChange}
              placeholder={placeholder}
              className={error ? 'error' : ''}
              {...rest}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );
    }
  };

  return (
    <div className="dynamic-form-container">
      <div className="form-header">
        <h2>Formulario Dinamico</h2>
        <p className="form-description">
          Este formulario se construye automaticamente basado en una configuracion de campos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="dynamic-form">
        {formFields.map(field => renderField(field))}

        <div className="form-actions">
          <button type="button" className="btn-reset" onClick={handleReset}>
            Limpiar
          </button>
          <button type="submit" className="btn-submit">
            Enviar
          </button>
        </div>
      </form>

      {/* Información de configuración */}
      <div className="form-info">
        <h3>ℹ️ Configuración del Formulario</h3>
        <p>Este formulario renderiza {formFields.length} campos dinámicamente.</p>
        <details>
          <summary>Ver configuración JSON</summary>
          <pre>{JSON.stringify(formFields, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}

export default DynamicForm;
