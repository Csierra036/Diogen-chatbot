import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir

function ChatbotComponent({ authToken, onLogout }) { // Recibe authToken y onLogout como props
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [queryText, setQueryText] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); // Hook para la navegación


  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]); // Dependencias: authToken y navigate


  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const addMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const handleSendMessage = async () => {
    if (queryText.trim() === '') return;

    addMessage(queryText, 'user');
    setQueryText('');

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/chatbot/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ question: queryText })
      });
      const data = await response.json();
      const botResponse = typeof data === "string" ? data : JSON.stringify(data);
      addMessage(botResponse, 'bot');
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      addMessage("Error al conectar con el servidor.", 'bot');
  
      if (error.response && error.response.status === 401) { // Ejemplo: si backend devuelve 401 Unauthorized
          onLogout(); // Llama a la función de logout
      }
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/chatbot/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${authToken}` 
        },
        body: formData
      });

      if (response.ok) {
        addMessage("Archivo subido correctamente.", 'bot');
      } else {
        throw new Error("Error al subir el archivo.");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      addMessage("Error al subir el archivo.", 'bot');
      if (error.response && error.response.status === 401) {
          onLogout();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="cont">
        <h1 className={isDarkMode ? 'dark-text' : ''}>💻Diogen-AI</h1>
        <label className="switch">
          <input
            type="checkbox"
            id="toggleDarkMode"
            checked={isDarkMode}
            onChange={handleToggleDarkMode}
          />
          <span className="slider"></span>
          <span className="toggle-button"></span>
        </label>

     
      </div>

      <div className={`content ${isDarkMode ? 'dark-container' : ''}`}>
        <div className="item" style={{ height: '100%' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mensaje ${msg.sender === 'bot' ? 'mensaje-bot' : ''} ${isDarkMode && (msg.sender === 'user' ? 'dark-mensaje' : 'dark-mensaje-bot')}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="item">
          <input type="file" id="archivo" accept=".pdf" onChange={handleFileUpload} />
          <label htmlFor="archivo" className={`custom-file ${isDarkMode ? 'dark-custom-file' : ''}`}>
            📄<br /> Subir archivo
          </label>
          <textarea
            name="consulta"
            id="caja"
            rows="2"
            placeholder="Escribe la consulta que deseas realizar"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={handleKeyPress} 
            className={isDarkMode ? 'dark-textarea' : ''}
          ></textarea>
          <button
            id="enviar"
            onClick={handleSendMessage}
            className={isDarkMode ? 'dark-button' : ''}
            
          >
            ^
          </button>
             <button onClick={onLogout} className={isDarkMode ? 'dark-button' : ''}>
          Cerrar Sesión
        </button>
          
        </div>
        
      </div>
      
    </>
  );
}

export default ChatbotComponent;