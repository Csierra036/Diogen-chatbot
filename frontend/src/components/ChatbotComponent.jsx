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
  MessageCircle, 
  Sparkles 
} from 'lucide-react';

function ChatbotComponent({ authToken, onLogout }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Obtener el nombre del usuario desde localStorage al cargar el componente
  const userFirstName = localStorage.getItem('userFirstName') || 'Usuario';

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const addMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, { 
      text, 
      sender, 
      timestamp: new Date() 
    }]);
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
        onLogout();
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

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setIsLoading(true);
    addMessage(`Subiendo ${files.length} archivo(s)...`, 'user');

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
      } else if (response.status === 401) {
        onLogout();
      } else {
        addMessage("Error al subir el archivo.", 'bot');
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      addMessage("Error al subir el archivo.", 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-700 ease-in-out ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black" 
        : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    }`}>
      {/* Animated Background Elements with smooth transitions */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-xl animate-pulse transition-all duration-700 ${
          isDarkMode ? 'bg-purple-400/20' : 'bg-blue-400/20'
        }`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 rounded-full blur-lg animate-bounce transition-all duration-700 ${
          isDarkMode ? 'bg-pink-400/30' : 'bg-indigo-400/30'
        }`} style={{ animationDuration: '3s' }}></div>
        <div className={`absolute bottom-32 left-20 w-40 h-40 rounded-full blur-2xl animate-pulse transition-all duration-700 ${
          isDarkMode ? 'bg-indigo-400/15' : 'bg-cyan-400/15'
        }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-20 right-10 w-28 h-28 rounded-full blur-xl animate-bounce transition-all duration-700 ${
          isDarkMode ? 'bg-cyan-300/25' : 'bg-blue-300/25'
        }`} style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        
        {/* Floating particles with color transitions */}
        <div className={`absolute top-1/4 left-1/4 w-2 h-2 rotate-45 animate-ping transition-all duration-700 ${
          isDarkMode ? 'bg-purple-300/40' : 'bg-white/40'
        }`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute top-3/4 right-1/3 w-1 h-1 rounded-full animate-ping transition-all duration-700 ${
          isDarkMode ? 'bg-pink-300/60' : 'bg-blue-300/60'
        }`} style={{ animationDelay: '1.5s' }}></div>
        <div className={`absolute top-1/2 left-1/6 w-1.5 h-1.5 rotate-45 animate-ping transition-all duration-700 ${
          isDarkMode ? 'bg-cyan-300/50' : 'bg-indigo-300/50'
        }`} style={{ animationDelay: '2.5s' }}></div>
        
        <div className={`absolute inset-0 transition-all duration-700 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-gray-900/50 via-transparent to-slate-900/30'
            : 'bg-gradient-to-t from-blue-900/50 via-transparent to-indigo-900/30'
        }`}></div>
      </div>

      {/* Header with smooth transitions */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 transition-all duration-500">
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
              {/* Dark Mode Toggle with enhanced animation */}
              <button
                onClick={handleToggleDarkMode}
                className={`relative p-3 rounded-xl transition-all duration-500 hover:scale-110 transform ${
                  isDarkMode 
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 hover:text-yellow-200' 
                    : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200'
                }`}
              >
                <div className="relative">
                  {/* Sun icon */}
                  <Sun className={`w-5 h-5 absolute transition-all duration-500 ${
                    isDarkMode 
                      ? 'opacity-100 rotate-0 scale-100' 
                      : 'opacity-0 rotate-180 scale-75'
                  }`} />
                  {/* Moon icon */}
                  <Moon className={`w-5 h-5 absolute transition-all duration-500 ${
                    isDarkMode 
                      ? 'opacity-0 -rotate-180 scale-75' 
                      : 'opacity-100 rotate-0 scale-100'
                  }`} />
                </div>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="relative z-10 flex flex-col h-[calc(100vh-80px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}>
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 transition-colors duration-500">¡Hola {userFirstName}! Soy Diogen-AI</h3>
                <p className={`text-lg transition-colors duration-500 ${
                  isDarkMode ? 'text-purple-200/80' : 'text-blue-200/80'
                }`}>¿En qué puedo ayudarte hoy?</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar with theme transitions */}
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
                  
                  {/* Message Bubble with smooth theme transitions */}
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
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        {/* Input Area with smooth transitions */}
        <div className={`border-t backdrop-blur-lg p-4 transition-all duration-500 ${
          isDarkMode 
            ? 'border-gray-600/30 bg-gray-800/20' 
            : 'border-white/20 bg-white/5'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              {/* File Upload with theme transitions */}
              <div className="relative">
                <input
                  type="file"
                  id="archivo"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
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
                </label>
              </div>

              {/* Message Input with smooth theme transitions */}
              <div className="flex-1 relative">
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu consulta aquí..."
                  rows={1}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-500 resize-none backdrop-blur-lg ${
                    isDarkMode 
                      ? 'bg-gray-800/30 border-gray-600/30 text-gray-100 placeholder-gray-400/70 focus:ring-purple-400/50 focus:border-purple-400/50' 
                      : 'bg-white/10 border-white/20 text-white placeholder-blue-200/50 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>

              {/* Send Button with theme transitions */}
              <button
                onClick={handleSendMessage}
                disabled={!queryText.trim() || isLoading}
                className={`flex items-center justify-center w-12 h-12 text-white rounded-xl transition-all duration-500 hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-purple-500/50 disabled:to-pink-600/50' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-500/50 disabled:to-indigo-600/50'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Smooth scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

export default ChatbotComponent;