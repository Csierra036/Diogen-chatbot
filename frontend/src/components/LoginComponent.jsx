import React, { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Sparkles, Moon, Sun, CheckCircle } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [showFormTransition, setShowFormTransition] = useState(false); // Para controlar la transición del formulario

  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // useEffect para que el formulario de login "aparezca" al cargar la página
  useEffect(() => {
    setShowFormTransition(false); // Al montar, asegúrate de que esté visible para la animación de entrada
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.access_token);

        // Paso 1: Iniciar la transición de desvanecimiento del formulario de login
        setShowFormTransition(true); // Activa la salida del formulario de login

        setTimeout(() => {
          // Después de que el formulario se desvanezca, mostrar la animación de bienvenida
          setShowWelcomeAnimation(true);
          // Opcional: Podrías resetear los campos aquí si no quieres que se vean cuando la animación termine
          // setEmail('');
          // setPassword('');

          setTimeout(() => {
            // Redirigir al chatbot después de la animación de bienvenida
            navigate('/chatbot');
          }, 2500); // Tiempo para que la animación de bienvenida se muestre
        }, 500); // Tiempo para que el formulario de login se desvanezca (debe coincidir con la duración de la transición)
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Credenciales incorrectas.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
      setIsLoading(false);
    }
  };

  // Función para manejar el clic en el enlace de registro
  const handleRegisterLinkClick = (e) => {
    e.preventDefault(); // Evita la navegación inmediata
    setShowFormTransition(true); // Inicia la transición de desvanecimiento del formulario actual
    setTimeout(() => {
      navigate('/register'); // Navega después de que el formulario se desvanezca
    }, 500); // Coincide con la duración de la transición
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
      isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
        : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    }`}>
      {/* Fondo animado similar al chatbot */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 w-40 h-40 rounded-full blur-2xl animate-pulse transition-all duration-1000 ${
          isDarkMode ? 'bg-purple-400/30' : 'bg-blue-400/30'
        }`}></div>
        <div className={`absolute top-40 right-20 w-32 h-32 rounded-full blur-xl animate-bounce transition-all duration-1000 ${
          isDarkMode ? 'bg-pink-400/40' : 'bg-indigo-400/40'
        }`} style={{ animationDuration: '3s' }}></div>
        <div className={`absolute bottom-32 left-20 w-48 h-48 rounded-full blur-3xl animate-pulse transition-all duration-1000 ${
          isDarkMode ? 'bg-indigo-400/20' : 'bg-cyan-400/20'
        }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-20 right-10 w-36 h-36 rounded-full blur-2xl animate-bounce transition-all duration-1000 ${
          isDarkMode ? 'bg-cyan-300/30' : 'bg-blue-300/30'
        }`} style={{ animationDuration: '4s', animationDelay: '2s' }}></div>

        {/* Partículas flotantes */}
        <div className={`absolute top-1/4 left-1/4 w-3 h-3 rotate-45 animate-ping transition-all duration-1000 ${
          isDarkMode ? 'bg-purple-300/60' : 'bg-white/60'
        }`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute top-3/4 right-1/3 w-2 h-2 rounded-full animate-ping transition-all duration-1000 ${
          isDarkMode ? 'bg-pink-300/80' : 'bg-blue-300/80'
        }`} style={{ animationDelay: '1.5s' }}></div>
        <div className={`absolute top-1/2 left-1/6 w-2.5 h-2.5 rotate-45 animate-ping transition-all duration-1000 ${
          isDarkMode ? 'bg-cyan-300/70' : 'bg-indigo-300/70'
        }`} style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Contenido del formulario de Login con transición de desvanecimiento */}
      <div className={`relative z-10 w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl backdrop-blur-lg border transition-all duration-500 ${ // Duración de 500ms
        isDarkMode
          ? 'bg-gray-800/30 border-gray-700/50'
          : 'bg-white/10 border-white/20'
      } ${showFormTransition ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 animate-fadeInUp'}`}> {/* Aquí la clase de transición */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className={`relative p-3 rounded-xl transition-all duration-500 hover:scale-110 transform ${
              isDarkMode
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 hover:text-yellow-200'
                : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200'
            }`}
          >
            <div className="relative">
              <Sun className={`w-5 h-5 absolute transition-all duration-500 ${
                isDarkMode
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 rotate-180 scale-75'
              }`} />
              <Moon className={`w-5 h-5 absolute transition-all duration-500 ${
                isDarkMode
                  ? 'opacity-0 -rotate-180 scale-75'
                  : 'opacity-100 rotate-0 scale-100'
              }`} />
            </div>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-xl transition-all duration-500 ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-600'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          }`}>
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className={`text-4xl font-extrabold transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-gray-100'
          }`}>Iniciar Sesión</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-200'
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'bg-white/10 border-white/30 text-white placeholder-blue-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-200'
              }`}
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'bg-white/10 border-white/30 text-white placeholder-blue-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || showFormTransition} // Deshabilitar durante la transición
            className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm transition-colors duration-500 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-200'
        }`}>
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            onClick={handleRegisterLinkClick} // Añadir el onClick aquí
            className={`font-medium transition-colors duration-300 hover:underline ${
              isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-300 hover:text-blue-200'
            }`}>
            Regístrate aquí
          </Link>
        </p>
      </div>

     {/* Welcome/Success Animation Overlay - Sin recuadro */}
      {showWelcomeAnimation && (
        <div className={`fixed inset-0 z-50 transition-all duration-700 ${
            isDarkMode ? 'bg-black/0' : 'bg-slate-900/0' // Puedes ajustar esta opacidad si quieres un ligero oscurecimiento
          } animate-fadeOutOpacity`}>
          {/* Este div está intencionalmente vacío para solo manejar la transición */}
        </div>
      )}

  <style>{`
      /* New animation for a subtle fade-out overlay */
        @keyframes fadeOutOpacity {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeOutOpacity {
          animation: fadeOutOpacity 0.1s ease-out forwards; /* Ajusta la duración si es necesario */
        }

      /* Animación para la entrada del formulario */
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
      }

      /* Animaciones de pop y bounce (si las usas en otras partes) */
      @keyframes popIn {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); }
      }
      .animate-popIn {
        animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
      }

      @keyframes bounceIn {
        0% { transform: scale(0.1); opacity: 0; }
        60% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); }
      }
      .animate-bounceIn {
        animation: bounceIn 0.8s ease-out;
      }
  `}</style>
    </div>
  );
}

export default Login;