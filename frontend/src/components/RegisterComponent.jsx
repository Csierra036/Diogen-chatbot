// frontend/src/components/RegisterComponent.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

function RegisterComponent() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState(''); 
  const [lastname, setLastname] = useState('');   
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
 
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envía todos los campos requeridos por tu backend
        body: JSON.stringify({ email, password, confirm_password: confirmPassword, firstname, lastname }),
      });

      if (response.ok) {
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        // Limpiar los campos después del registro exitoso
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstname('');
        setLastname('');

        // Redirigir al login después de un breve retraso
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirige después de 2 segundos
      } else {
        const errorData = await response.json();
        // Ajusta el mensaje de error si el backend lo devuelve en un campo diferente
        setError(errorData.detail || errorData.message || 'Error en el registro. Intenta con otro email o datos válidos.');
      }
    } catch (err) {
      console.error("Error al intentar registrarse:", err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-email">Email:</label> 
          <input
            type="email" 
            id="reg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Contraseña:</label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstname">Nombre:</label> 
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Apellido:</label> 
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Registrar</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}

export default RegisterComponent;