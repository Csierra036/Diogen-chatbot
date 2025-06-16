// frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Importa tus estilos CSS aquí

function App() {
  // Estado para controlar el modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Estado para almacenar los mensajes del chat
  const [messages, setMessages] = useState([]);
  // Estado para el texto de la caja de consulta
  const [queryText, setQueryText] = useState('');
  // Referencia para el contenedor de mensajes para hacer scroll automático
  const messagesEndRef = useRef(null);

  // Efecto para aplicar el modo oscuro al body y otros elementos
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    // Para otros elementos, es mejor manejar las clases dentro de los propios componentes React
    // o usar clases dinámicas en el JSX. Aquí lo haremos simple para el ejemplo.
  }, [isDarkMode]);

  // Efecto para hacer scroll al final de los mensajes cada vez que se actualizan
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Manejador para el toggle de modo oscuro
  const handleToggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Función para agregar un mensaje al chat
  const addMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  // Manejador para enviar el mensaje de consulta
  const handleSendMessage = async () => {
    if (queryText.trim() === '') return;

    // Agrega el mensaje del usuario
    addMessage(queryText, 'user');
    setQueryText(''); // Limpia la caja de texto

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: queryText })
      });
      const data = await response.json();
      const botResponse = typeof data === "string" ? data : JSON.stringify(data);
      addMessage(botResponse, 'bot');
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      addMessage("Error al conectar con el servidor.", 'bot');
    }
  };

  // Manejador para la subida de archivos
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        // let result = await response.json(); // Si necesitas el resultado, puedes usarlo aquí
        addMessage("Archivo subido correctamente.", 'bot');
        // Opcional: Si tu diseño original mostraba algún indicador de archivo cargado
        // event.target.nextElementSibling.classList.add('archivo-cargado');
      } else {
        throw new Error("Error al subir el archivo.");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      addMessage("Error al subir el archivo.", 'bot');
    }
  };

  // Manejador para la tecla "Enter" en el textarea
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Permite Shift+Enter para nueva línea
      event.preventDefault(); // Previene el salto de línea por defecto
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
          <div ref={messagesEndRef} /> {/* Elemento para hacer scroll */}
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
        </div>
      </div>
    </>
  );
}

export default App;