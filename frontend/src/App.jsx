import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LoginComponent'; // Asegúrate de que la ruta sea correcta
import Register from './components/RegisterComponent'; // Asegúrate de que la ruta sea correcta
import ChatbotComponent from './components/ChatbotComponent'; // Asegúrate de que la ruta sea correcta
import { ThemeProvider } from './contexts/ThemeContext'; // Importar ThemeProvider

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    // Redirección manejada por el useEffect en ChatbotComponent
  };

  return (
    // Envuelve toda tu aplicación con ThemeProvider
    <ThemeProvider> 
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/chatbot" 
            element={authToken ? <ChatbotComponent authToken={authToken} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/chatbot" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;