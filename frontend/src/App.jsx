import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'; 

// Componentes que crearemos
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import ChatbotComponent from './components/ChatbotComponent'; 

function App() {
  // Estado para el token de autenticación
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);

  // Función para manejar el login exitoso
  const handleLoginSuccess = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token); // Almacena el token
 
  };

  // Función para manejar el logout
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken'); // Elimina el token
   
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para el componente de Login */}
        <Route path="/login" element={<LoginComponent onLoginSuccess={handleLoginSuccess} />} />

        {/* Ruta para el componente de Registro */}
        <Route path="/register" element={<RegisterComponent />} />

        {/* Ruta para el Chatbot - Protegida */}
        <Route
          path="/"
          element={
            // Si hay un token, muestra el Chatbot; de lo contrario, redirige al login
            authToken ? (
              <ChatbotComponent authToken={authToken} onLogout={handleLogout} />
            ) : (
              <LoginComponent onLoginSuccess={handleLoginSuccess} /> // Redirigir al login si no hay token
            )
          }
        />
     
      </Routes>
    </Router>
  );
}

export default App;