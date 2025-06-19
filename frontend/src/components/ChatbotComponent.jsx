import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Upload,
  LogOut,
  Moon,
  Sun,
  Bot,
  User,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'; // Importar el hook useTheme

function ChatbotComponent({ authToken, onLogout }) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [messages, setMessages] = useState([]);
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Cambiado a un array para múltiples archivos

  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomePhase, setWelcomePhase] = useState('typing');
  const [typedWelcomeText, setTypedWelcomeText] = useState('');
  const welcomeTextContent = "Bienvenido";

  const [showFarewell, setShowFarewell] = useState(false);
  const [farewellPhase, setFarewellPhase] = useState('typing');
  const [typedFarewellText, setTypedFarewellText] = useState('');
  const farewellTextContent = "Hasta pronto";

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authToken && !showFarewell) {
      navigate('/login');
    }
  }, [authToken, navigate, showFarewell]);

  useEffect(() => {
    if (showWelcome && welcomePhase === 'typing') {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= welcomeTextContent.length) {
          setTypedWelcomeText(welcomeTextContent.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setWelcomePhase('complete');
          setTimeout(() => {
            setWelcomePhase('fadeOut');
            setTimeout(() => {
              setShowWelcome(false);
              setWelcomePhase('done');
            }, 1000);
          }, 2000);
        }
      }, 150);
      return () => clearInterval(typingInterval);
    }
  }, [showWelcome, welcomePhase, welcomeTextContent]);

  useEffect(() => {
    if (showFarewell && farewellPhase === 'typing') {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= farewellTextContent.length) {
          setTypedFarewellText(farewellTextContent.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setFarewellPhase('complete');
          setTimeout(() => {
            setFarewellPhase('fadeOut');
            setTimeout(() => {
              setShowFarewell(false);
              onLogout();
            }, 1000);
          }, 2000);
        }
      }, 150);
      return () => clearInterval(typingInterval);
    }
  }, [showFarewell, farewellPhase, farewellTextContent, onLogout]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, {
      text,
      sender,
      timestamp: new Date()
    }]);
  };

  const handleSendAction = async () => {
    if (queryText.trim() !== '') {
      await handleSendMessage();
    } else if (selectedFiles.length > 0) { // Revisar si hay archivos seleccionados
      await handleSendFile();
    }
    // Después de enviar, limpiar cualquier archivo seleccionado y el campo de texto
    setSelectedFiles([]);
    setQueryText('');
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpiar el input de archivo HTML
    }
  };

  const handleSendMessage = async () => {
    if (queryText.trim() === '') return;

    const userMessage = queryText;
    addMessage(userMessage, 'user');
    setQueryText('');
    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/chatbot/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ question: userMessage })
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = typeof data === "string" ? data : JSON.stringify(data);
        addMessage(botResponse, 'bot');
      } else if (response.status === 401) {
        initiateFarewell();
      } else {
        addMessage("Error al procesar tu consulta. Inténtalo de nuevo.", 'bot');
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      addMessage("Error al conectar con el servidor.", 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  // MODIFICADO: Guarda múltiples archivos en el estado
  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files); // Convertir FileList a Array
    if (files.length > 0) {
      setSelectedFiles(files);
      // No modificamos queryText aquí, solo actualizamos el contador visual
    } else {
      setSelectedFiles([]);
    }
  };

  // MODIFICADO: Sube todos los archivos en el estado `selectedFiles`
  const handleSendFile = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file); // Asegúrate de que el nombre del campo sea 'files' para tu backend de múltiples archivos
    });

    setIsLoading(true);
    addMessage(`Subiendo ${selectedFiles.length} archivo(s)...`, 'user'); // Mensaje genérico

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/chatbot/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (response.ok) {
        addMessage("Archivo(s) subido(s) correctamente. ¿En qué más puedo ayudarte con estos archivos?", 'bot');
      } else if (response.status === 401) {
        initiateFarewell();
      } else {
        addMessage("Error al subir el archivo(s). Inténtalo de nuevo.", 'bot');
      }
    } catch (error) {
      console.error("Error al subir el archivo(s):", error);
      addMessage("Error al subir el archivo(s).", 'bot');
    } finally {
      setIsLoading(false);
      setSelectedFiles([]); // Limpiar los archivos seleccionados después de intentar la subida
      setQueryText(''); // Limpiar el campo de texto
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // También limpiar el valor del input de archivo
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendAction();
    }
  };

  const initiateFarewell = () => {
    setShowFarewell(true);
    setFarewellPhase('typing');
    setTypedFarewellText('');
  };

  if (showWelcome) {
    return (
      <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-in-out ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
      }`}>
        {/* Animated Background for Welcome */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-40 h-40 rounded-full blur-2xl animate-pulse transition-all duration-1000 ${isDarkMode ? 'bg-purple-400/30' : 'bg-blue-400/30'}`}></div>
          <div className={`absolute top-40 right-20 w-32 h-32 rounded-full blur-xl animate-bounce transition-all duration-1000 ${isDarkMode ? 'bg-pink-400/40' : 'bg-indigo-400/40'}`} style={{ animationDuration: '3s' }}></div>
          <div className={`absolute bottom-32 left-20 w-48 h-48 rounded-full blur-3xl animate-pulse transition-all duration-1000 ${isDarkMode ? 'bg-indigo-400/20' : 'bg-cyan-400/20'}`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute bottom-20 right-10 w-36 h-36 rounded-full blur-2xl animate-bounce transition-all duration-1000 ${isDarkMode ? 'bg-cyan-300/30' : 'bg-blue-300/30'}`} style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
          <div className={`absolute top-1/4 left-1/4 w-3 h-3 rotate-45 animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-purple-300/60' : 'bg-white/60'}`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute top-3/4 right-1/3 w-2 h-2 rounded-full animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-pink-300/80' : 'bg-blue-300/80'}`} style={{ animationDelay: '1.5s' }}></div>
          <div className={`absolute top-1/2 left-1/6 w-2.5 h-2.5 rotate-45 animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-cyan-300/70' : 'bg-indigo-300/70'}`} style={{ animationDelay: '2.5s' }}></div>
          <div className={`absolute top-1/3 right-1/4 w-1 h-1 rounded-full animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-yellow-300/60' : 'bg-white/60'}`} style={{ animationDelay: '3s' }}></div>
          <div className={`absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rotate-45 animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-emerald-300/50' : 'bg-cyan-300/50'}`} style={{ animationDelay: '3.5s' }}></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className={`text-center transition-all duration-1000 ${welcomePhase === 'fadeOut' ? 'opacity-0 scale-95 transform translate-y-4' : 'opacity-100 scale-100'}`}>
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-2xl transition-all duration-1000 ${isDarkMode ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-600'}`} style={{ animation: 'logoFloat 3s ease-in-out infinite' }}>
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="relative">
              <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-4 transition-all duration-1000 ${isDarkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400' : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400'} bg-clip-text text-transparent`}>
                {typedWelcomeText}
                <span className={`inline-block w-1 h-16 md:h-20 lg:h-24 ml-2 animate-pulse ${welcomePhase === 'typing' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${isDarkMode ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
              </h1>
              <p className={`text-xl md:text-2xl font-light transition-all duration-1000 delay-500 ${welcomePhase === 'complete' || welcomePhase === 'fadeOut' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isDarkMode ? 'text-purple-200/80' : 'text-blue-200/80'}`}>
                a Diogen-AI
              </p>
            </div>
            <div className={`flex justify-center space-x-4 mt-8 transition-all duration-1000 delay-1000 ${welcomePhase === 'complete' || welcomePhase === 'fadeOut' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-pink-400' : 'bg-indigo-400'}`} style={{ animationDelay: '0.1s' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-indigo-400' : 'bg-cyan-400'}`} style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (showFarewell) {
    return (
      <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-in-out ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
      }`}>
        {/* Animated Background for Farewell */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-40 h-40 rounded-full blur-2xl animate-pulse transition-all duration-1000 ${isDarkMode ? 'bg-purple-400/30' : 'bg-blue-400/30'}`}></div>
          <div className={`absolute top-40 right-20 w-32 h-32 rounded-full blur-xl animate-bounce transition-all duration-1000 ${isDarkMode ? 'bg-pink-400/40' : 'bg-indigo-400/40'}`} style={{ animationDuration: '3s' }}></div>
          <div className={`absolute bottom-32 left-20 w-48 h-48 rounded-full blur-3xl animate-pulse transition-all duration-1000 ${isDarkMode ? 'bg-indigo-400/20' : 'bg-cyan-400/20'}`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute bottom-20 right-10 w-36 h-36 rounded-full blur-2xl animate-bounce transition-all duration-1000 ${isDarkMode ? 'bg-cyan-300/30' : 'bg-blue-300/30'}`} style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
          <div className={`absolute top-1/4 left-1/4 w-3 h-3 rotate-45 animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-purple-300/60' : 'bg-white/60'}`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute top-3/4 right-1/3 w-2 h-2 rounded-full animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-pink-300/80' : 'bg-blue-300/80'}`} style={{ animationDelay: '1.5s' }}></div>
          <div className={`absolute top-1/2 left-1/6 w-2.5 h-2.5 rotate-45 animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-cyan-300/70' : 'bg-indigo-300/70'}`} style={{ animationDelay: '2.5s' }}></div>
          <div className={`absolute top-1/3 right-1/4 w-1 h-1 rounded-full animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-yellow-300/60' : 'bg-white/60'}`} style={{ animationDelay: '3s' }}></div>
          <div className={`absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rotate-45 animate-ping transition-all duration-1000 ${isDarkMode ? 'bg-emerald-300/50' : 'bg-cyan-300/50'}`} style={{ animationDelay: '3.5s' }}></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className={`text-center transition-all duration-1000 ${farewellPhase === 'fadeOut' ? 'opacity-0 scale-95 transform translate-y-4' : 'opacity-100 scale-100'}`}>
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-2xl transition-all duration-1000 ${isDarkMode ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-600'}`} style={{ animation: 'logoFloat 3s ease-in-out infinite' }}>
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="relative">
              <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-4 transition-all duration-1000 ${isDarkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400' : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400'} bg-clip-text text-transparent`}>
                {typedFarewellText}
                <span className={`inline-block w-1 h-16 md:h-20 lg:h-24 ml-2 animate-pulse ${farewellPhase === 'typing' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${isDarkMode ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
              </h1>
              <p className={`text-xl md:text-2xl font-light transition-all duration-1000 delay-500 ${farewellPhase === 'complete' || farewellPhase === 'fadeOut' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isDarkMode ? 'text-purple-200/80' : 'text-blue-200/80'}`}>
                ¡Vuelve pronto!
              </p>
            </div>
            <div className={`flex justify-center space-x-4 mt-8 transition-all duration-1000 delay-1000 ${farewellPhase === 'complete' || farewellPhase === 'fadeOut' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-pink-400' : 'bg-indigo-400'}`} style={{ animationDelay: '0.1s' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-indigo-400' : 'bg-cyan-400'}`} style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-in-out animate-slideInUp ${
      isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
        : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    }`}>
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-xl animate-pulse transition-all duration-700 ${isDarkMode ? 'bg-purple-400/20' : 'bg-blue-400/20'}`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 rounded-full blur-lg animate-bounce transition-all duration-700 ${isDarkMode ? 'bg-pink-400/30' : 'bg-indigo-400/30'}`} style={{ animationDuration: '3s' }}></div>
        <div className={`absolute bottom-32 left-20 w-40 h-40 rounded-full blur-2xl animate-pulse transition-all duration-700 ${isDarkMode ? 'bg-indigo-400/15' : 'bg-cyan-400/15'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-20 right-10 w-28 h-28 rounded-full blur-xl animate-bounce transition-all duration-700 ${isDarkMode ? 'bg-cyan-300/25' : 'bg-blue-300/25'}`} style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        <div className={`absolute top-1/4 left-1/4 w-2 h-2 rotate-45 animate-ping transition-all duration-700 ${isDarkMode ? 'bg-purple-300/40' : 'bg-white/40'}`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute top-3/4 right-1/3 w-1 h-1 rounded-full animate-ping transition-all duration-700 ${isDarkMode ? 'bg-pink-300/60' : 'bg-blue-300/60'}`} style={{ animationDelay: '1.5s' }}></div>
        <div className={`absolute top-1/2 left-1/6 w-1.5 h-1.5 rotate-45 animate-ping transition-all duration-700 ${isDarkMode ? 'bg-cyan-300/50' : 'bg-indigo-300/50'}`} style={{ animationDelay: '2.5s' }}></div>
        <div className={`absolute inset-0 transition-all duration-700 ${
          isDarkMode
            ? 'bg-gradient-to-t from-gray-900/50 via-transparent to-slate-900/30'
            : 'bg-gradient-to-t from-blue-900/50 via-transparent to-indigo-900/30'
        }`}></div>
      </div>

      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 transition-all duration-500 animate-slideInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className={`rounded-lg p-2 transition-all duration-500 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white transition-colors duration-500">💻 Diogen-AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`relative p-3 rounded-xl transition-all duration-500 hover:scale-110 transform ${
                  isDarkMode
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 hover:text-yellow-200'
                    : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200'
                }`}
              >
                <div className="relative">
                  <Sun className={`w-5 h-5 absolute transition-all duration-500 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'}`} />
                  <Moon className={`w-5 h-5 absolute transition-all duration-500 ${isDarkMode ? 'opacity-0 -rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                </div>
              </button>
              <button
                onClick={initiateFarewell}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-col h-[calc(100vh-80px)] animate-fadeInUp">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-12 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}>
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 transition-colors duration-500">¡Hola! Soy Diogen-AI</h3>
                <p className={`text-lg transition-colors duration-500 ${isDarkMode ? 'text-purple-200/80' : 'text-blue-200/80'}`}>¿En qué puedo ayudarte hoy?</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    msg.sender === 'user'
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      : isDarkMode
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 ${
                    msg.sender === 'user'
                      ? isDarkMode
                        ? 'bg-purple-500/20 border-purple-400/30 text-purple-100'
                        : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
                      : isDarkMode
                        ? 'bg-gray-800/40 border-gray-600/30 text-gray-100'
                        : 'bg-white/10 border-white/20 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl backdrop-blur-lg border transition-all duration-500 ${
                    isDarkMode
                      ? 'bg-gray-800/40 border-gray-600/30'
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className={`border-t backdrop-blur-lg p-4 transition-all duration-500 animate-slideInUp ${
          isDarkMode
            ? 'border-gray-600/30 bg-gray-800/20'
            : 'border-white/5'
        }`} style={{ animationDelay: '0.5s' }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <input
                  type="file"
                  id="archivo"
                  accept=".pdf"
                  multiple // Permite seleccionar múltiples archivos
                  onChange={handleFileSelection}
                  className="hidden"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="archivo"
                  className={`flex flex-col items-center justify-center w-12 h-12 border rounded-xl cursor-pointer transition-all duration-500 hover:scale-110 group ${
                    isDarkMode
                      ? 'bg-gray-700/30 hover:bg-gray-600/40 border-gray-600/30'
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  }`}
                >
                  <Upload className={`w-5 h-5 transition-all duration-500 ${
                    isDarkMode
                      ? 'text-purple-300 group-hover:text-purple-200'
                      : 'text-blue-300 group-hover:text-white'
                  }`} />
                  {selectedFiles.length > 0 && ( // Mostrar contador solo si hay archivos
                    <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white ${
                      isDarkMode ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}>
                      {selectedFiles.length}
                    </span>
                  )}
                </label>
              </div>

              <div className="flex-1 relative">
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu consulta aquí..." // Vuelve al placeholder original
                  rows={1}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-500 resize-none backdrop-blur-lg ${
                    isDarkMode
                      ? 'bg-gray-800/30 border-gray-600/30 text-gray-100 placeholder-gray-400/70 focus:ring-purple-400/50 focus:border-purple-400/50'
                      : 'bg-white/10 border-white/20 text-white placeholder-blue-200/50 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                ></textarea>
              </div>

              <button
                onClick={handleSendAction}
                disabled={isLoading || (queryText.trim() === '' && selectedFiles.length === 0)} // Deshabilitar si no hay texto ni archivos
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotComponent;