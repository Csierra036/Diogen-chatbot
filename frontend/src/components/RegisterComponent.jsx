import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Sparkles, Moon, Sun, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import YourLogo from '../assets/logo.png';


function RegisterComponent() {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [showFormTransition, setShowFormTransition] = useState(false); // Para controlar la transición del formulario

  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // useEffect para asegurar que el formulario de registro "aparezca" al cargar la página
  useEffect(() => {
    // Al montar el componente, aseguramos que la transición esté en su estado inicial (apareciendo)
    setShowFormTransition(false); // False significa que está visible y se animará a 'opacity-100 scale-100'
  }, []); // Se ejecuta solo una vez al montar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirm_password: confirmPassword, firstname, lastname }),
      });

      if (response.ok) {
        setSuccess('¡Registro exitoso! Redirigiendo...');
        setShowWelcomeAnimation(true); // Muestra la animación de éxito

        // Limpiar los campos después del registro exitoso
        setEmail('');
        setFirstname('');
        setLastname('');
        setPassword('');
        setConfirmPassword('');

        // Paso 1: Iniciar la transición de desvanecimiento del formulario de registro
        setShowFormTransition(true); // Activa la salida del formulario de registro

        // Redirigir al login después de un breve retraso y que la animación se muestre
        setTimeout(() => {
          navigate('/login');
        }, 2500); // Un poco más de tiempo para que la animación sea visible
      } else {
        const errorData = await response.json();
        setError(errorData.detail || errorData.message || 'Error en el registro. Intenta con otro email o datos válidos.');
      }
    } catch (err) {
      console.error("Error al intentar registrarse:", err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el clic en el enlace de login
  const handleLoginLinkClick = (e) => {
    e.preventDefault(); // Evita la navegación inmediata
    setShowFormTransition(true); // Inicia la transición de desvanecimiento del formulario actual
    setTimeout(() => {
      navigate('/login'); // Navega después de que el formulario se desvanezca
    }, 500); // Coincide con la duración de la transición
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-in-out ${
      isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
        : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    }`}>
      {/* Animated Background Elements - Adaptado al modo oscuro */}
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

        {/* Partículas flotantes - Adaptado al modo oscuro */}
        <div className={`absolute top-1/4 left-1/4 w-3 h-3 rotate-45 animate-ping transition-all duration-1000 ${
          isDarkMode ? 'bg-purple-300/60' : 'bg-white/60'
        }`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute top-3/4 right-1/3 w-2 h-2 rounded-full animate-ping transition-all duration-1000 ${
          isDarkMode ? 'bg-pink-300/80' : 'bg-blue-300/80'
        }`} style={{ animationDelay: '1.5s' }}></div>
        <div className={`absolute top-1/2 left-1/6 w-2.5 h-2.5 rotate-45 animate-ping transition-all duration-1000 ${
          isDarkMode ? 'bg-cyan-300/70' : 'bg-indigo-300/70'
        }`} style={{ animationDelay: '2.5s' }}></div>

        {/* Gradient Overlay - Adaptado al modo oscuro */}
        <div className={`absolute inset-0 transition-all duration-700 ${
          isDarkMode
            ? 'bg-gradient-to-t from-gray-900/50 via-transparent to-slate-900/30'
            : 'bg-gradient-to-t from-blue-900/50 via-transparent to-indigo-900/30'
        }`}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Dark Mode Toggle - Añadido al registro */}
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

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-xl transition-all duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            }`}>
            <img src={YourLogo} alt="Diogen-AI Logo" className="w-full h-full object-contain p-2 animate-pulse" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'}} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-white'
            }`}>Crear Cuenta</h1>
            <p className={`transition-colors duration-500 ${
              isDarkMode ? 'text-purple-200/80' : 'text-blue-200/80'
            }`}>Regístrate para comenzar</p>
          </div>

          {/* Registration Form - Adaptado al modo oscuro con transición */}
          <div className={`rounded-2xl p-8 shadow-2xl border transition-all duration-500 ${ // Duración de 500ms
            isDarkMode
              ? 'bg-gray-800/30 border-gray-700/50'
              : 'bg-white/10 border-white/20'
          } ${showFormTransition ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 animate-fadeInUp'}`}> {/* Aquí la clase de transición y animate-fadeInUp */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name Field */}
              <div className="group">
                <label
                  htmlFor="firstname"
                  className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-blue-100'
                  }`}
                >
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${
                      isDarkMode ? 'text-purple-300/70 group-focus-within:text-purple-300' : 'text-blue-300/70 group-focus-within:text-blue-300'
                    }`} />
                  </div>
                  <input
                    type="text"
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/60'
                        : 'bg-white/10 border-white/20 text-white placeholder-blue-200/50 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/20'
                    }`}
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              {/* Last Name Field */}
              <div className="group">
                <label
                  htmlFor="lastname"
                  className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-blue-100'
                  }`}
                >
                  Apellido
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${
                      isDarkMode ? 'text-purple-300/70 group-focus-within:text-purple-300' : 'text-blue-300/70 group-focus-within:text-blue-300'
                    }`} />
                  </div>
                  <input
                    type="text"
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/60'
                        : 'bg-white/10 border-white/20 text-white placeholder-blue-200/50 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/20'
                    }`}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-blue-100'
                  }`}
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors ${
                      isDarkMode ? 'text-purple-300/70 group-focus-within:text-purple-300' : 'text-blue-300/70 group-focus-within:text-blue-300'
                    }`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/60'
                        : 'bg-white/10 border-white/20 text-white placeholder-blue-200/50 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/20'
                    }`}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-blue-100'
                  }`}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${
                      isDarkMode ? 'text-purple-300/70 group-focus-within:text-purple-300' : 'text-blue-300/70 group-focus-within:text-blue-300'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/60'
                        : 'bg-white/10 border-white/20 text-white placeholder-blue-200/50 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                      isDarkMode ? 'text-purple-300/70 hover:text-purple-200' : 'text-blue-300/70 hover:text-blue-200'
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-blue-100'
                  }`}
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${
                      isDarkMode ? 'text-purple-300/70 group-focus-within:text-purple-300' : 'text-blue-300/70 group-focus-within:text-blue-300'
                    }`} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/60'
                        : 'bg-white/10 border-white/20 text-white placeholder-blue-200/50 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                      isDarkMode ? 'text-purple-300/70 hover:text-purple-200' : 'text-blue-300/70 hover:text-blue-200'
                    }`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`rounded-xl p-3 animate-shake transition-colors duration-500 ${
                  isDarkMode ? 'bg-red-500/20 border border-red-400/30' : 'bg-red-500/20 border border-red-400/30'
                }`}>
                  <p className={`text-sm text-center transition-colors duration-500 ${
                    isDarkMode ? 'text-red-200' : 'text-red-200'
                  }`}>{error}</p>
                </div>
              )}

              {/* Success Message (antes del botón, si no hay animación) */}
              {success && !showWelcomeAnimation && (
                <div className={`rounded-xl p-3 transition-colors duration-500 ${
                  isDarkMode ? 'bg-green-500/20 border border-green-400/30' : 'bg-green-500/20 border border-green-400/30'
                }`}>
                  <p className={`text-sm text-center transition-colors duration-500 ${
                    isDarkMode ? 'text-green-200' : 'text-green-200'
                  }`}>{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || showFormTransition}
                className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 disabled:from-purple-500/50 disabled:to-pink-600/50 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-blue-500/50 disabled:to-indigo-600/50 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Crear Cuenta</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className={`transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-blue-200/80'
              }`}>
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  onClick={handleLoginLinkClick} // Añadir el onClick aquí
                  className={`font-medium transition-colors duration-300 hover:underline ${
                    isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-300 hover:text-white'
                  }`}
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome/Success Animation Overlay - Mismo overlay, puedes mantenerlo si lo deseas */}
      {showWelcomeAnimation && (
        <div className={`fixed inset-0 z-50 transition-all duration-700 ${
            isDarkMode ? 'bg-black/0' : 'bg-slate-900/0' // Ajusta si es necesario
          } animate-fadeOutOpacity`}>
        </div>
      )}

      {/* Styles (Ya existentes, asegúrate de que animate-fadeInUp y otros estilos base estén ahí) */}
      <style>{`
        /* Animación para la entrada del formulario */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        /* Puedes añadir otras animaciones si las usas en este componente */
        /* New animation for a subtle fade-out overlay */
        @keyframes fadeOutOpacity {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeOutOpacity {
          animation: fadeOutOpacity 0.1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default RegisterComponent;