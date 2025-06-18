import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

function LoginComponent({ onLoginSuccess }) {
  const [email, setEmail] = useState(''); // Cambiado de username a email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores anteriores

    try {
 
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Envía 'email' y 'password'
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token; 
        onLoginSuccess(token); // Guarda el token en el estado global y localStorage
        navigate('/'); // Redirige a la página principal del chatbot
      } else {
        const errorData = await response.json();
        // Ajusta el mensaje de error si el backend lo devuelve en un campo diferente
        setError(errorData.detail || errorData.message || 'Error de inicio de sesión. Credenciales inválidas.');
      }
    } catch (err) {
      console.error("Error al intentar iniciar sesión:", err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}

export default LoginComponent;