import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Moon, Sun, CheckCircle, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import YourLogo from '../assets/logo.png';


function RegisterComponent() {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormTransition, setShowFormTransition] = useState(false);

  // Animación de éxito
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successPhase, setSuccessPhase] = useState('celebration'); // 'celebration' | 'message' | 'fadeOut' | 'complete'

  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    setShowFormTransition(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot-python-7jfj.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirm_password: confirmPassword, firstname, lastname }),
      });

      if (response.ok) {
        setShowFormTransition(true); // Oculta el formulario

        setTimeout(() => {
          setShowSuccessAnimation(true);
          setSuccessPhase('celebration');

          setTimeout(() => {
            setSuccessPhase('message');
            setTimeout(() => {
              setSuccessPhase('fadeOut');
              setTimeout(() => {
                setSuccessPhase('complete');
                navigate('/login');
              }, 1000);
            }, 2000);
          }, 1500);
        }, 500);

        // Limpia los campos
        setEmail('');
        setFirstname('');
        setLastname('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || errorData.message || 'Error en el registro. Intenta con otro email o datos válidos.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginLinkClick = (e) => {
    e.preventDefault();
    setShowFormTransition(true);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  // Pantalla de animación de éxito
  if (showSuccessAnimation) {
    return (
      <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-in-out ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900" 
          : "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900"
      }`}>
        {/* Fondo animado de celebración */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-3 h-3 rotate-45 animate-bounce ${isDarkMode ? 'bg-yellow-300' : 'bg-yellow-400'}`} style={{ animationDelay: '0s', animationDuration: '1s' }}></div>
          <div className={`absolute top-32 right-20 w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-pink-300' : 'bg-pink-400'}`} style={{ animationDelay: '0.2s', animationDuration: '1.2s' }}></div>
          <div className={`absolute top-40 left-1/4 w-2.5 h-2.5 rotate-45 animate-bounce ${isDarkMode ? 'bg-blue-300' : 'bg-blue-400'}`} style={{ animationDelay: '0.4s', animationDuration: '0.8s' }}></div>
          <div className={`absolute top-60 right-1/3 w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-green-300' : 'bg-green-400'}`} style={{ animationDelay: '0.6s', animationDuration: '1.4s' }}></div>
          <div className={`absolute top-80 left-1/6 w-3 h-3 rotate-45 animate-bounce ${isDarkMode ? 'bg-purple-300' : 'bg-purple-400'}`} style={{ animationDelay: '0.8s', animationDuration: '1s' }}></div>
          <div className={`absolute bottom-40 right-10 w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-orange-300' : 'bg-orange-400'}`} style={{ animationDelay: '1s', animationDuration: '1.1s' }}></div>
          <div className={`absolute bottom-60 left-20 w-2.5 h-2.5 rotate-45 animate-bounce ${isDarkMode ? 'bg-red-300' : 'bg-red-400'}`} style={{ animationDelay: '1.2s', animationDuration: '0.9s' }}></div>
          <div className={`absolute bottom-80 right-1/4 w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-indigo-300' : 'bg-indigo-400'}`} style={{ animationDelay: '1.4s', animationDuration: '1.3s' }}></div>
          <div className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl animate-pulse ${isDarkMode ? 'bg-emerald-300/30' : 'bg-emerald-400/30'}`}></div>
          <div className={`absolute top-1/3 right-1/4 w-40 h-40 rounded-full blur-2xl animate-pulse ${isDarkMode ? 'bg-teal-300/20' : 'bg-teal-400/20'}`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute bottom-1/4 left-1/3 w-36 h-36 rounded-full blur-xl animate-pulse ${isDarkMode ? 'bg-cyan-300/25' : 'bg-cyan-400/25'}`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-gray-900/60 via-transparent to-emerald-900/40' : 'bg-gradient-to-t from-emerald-900/60 via-transparent to-teal-900/40'}`}></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            {/* Fase de celebración */}
            {successPhase === 'celebration' && (
              <div className="animate-scaleIn">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-8 shadow-2xl animate-bounce ${
                  isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}>
                  <CheckCircle className="w-16 h-16 text-white animate-pulse" />
                </div>
                <div className="relative">
                  <Star className={`absolute -top-20 -left-8 w-6 h-6 animate-spin ${isDarkMode ? 'text-yellow-300' : 'text-yellow-400'}`} style={{ animationDuration: '2s' }} />
                  <Star className={`absolute -top-16 right-4 w-4 h-4 animate-spin ${isDarkMode ? 'text-pink-300' : 'text-pink-400'}`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                  <Star className={`absolute -bottom-12 -right-6 w-5 h-5 animate-spin ${isDarkMode ? 'text-blue-300' : 'text-blue-400'}`} style={{ animationDuration: '1.8s' }} />
                  <Star className={`absolute -bottom-8 left-2 w-4 h-4 animate-spin ${isDarkMode ? 'text-purple-300' : 'text-purple-400'}`} style={{ animationDuration: '1.3s', animationDirection: 'reverse' }} />
                </div>
              </div>
            )}
            {/* Fase de mensaje */}
            {successPhase === 'message' && (
              <div className={`transition-all duration-1000 ${
                successPhase === 'fadeOut' ? 'opacity-0 scale-95 transform translate-y-4' : 'opacity-100 scale-100 animate-fadeInUp'
              }`}>
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-2xl ${
                  isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}>
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${
                  isDarkMode ? 'bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300' : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
                } bg-clip-text text-transparent`}>
                  ¡Registro Exitoso!
                </h1>
                <p className={`text-xl md:text-2xl font-light mb-8 ${
                  isDarkMode ? 'text-emerald-100/80' : 'text-emerald-200/80'
                }`}>
                  Tu cuenta ha sido creada correctamente
                </p>
                <div className="flex justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-emerald-300' : 'bg-emerald-400'}`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-teal-300' : 'bg-teal-400'}`} style={{ animationDelay: '0.1s' }}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-400'}`} style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className={`mt-6 text-lg ${isDarkMode ? 'text-emerald-200/60' : 'text-emerald-300/60'}`}>
                  Redirigiendo al inicio de sesión...
                </p>
              </div>
            )}
            {/* Fase de desvanecimiento */}
            {successPhase === 'fadeOut' && (
              <div className="opacity-0 scale-95 transform translate-y-4 transition-all duration-1000">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-2xl ${
                  isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}>
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className={`text-5xl font-bold mb-4 ${
                  isDarkMode ? 'bg-gradient-to-r from-emerald-300 to-cyan-300' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                } bg-clip-text text-transparent`}>
                  ¡Registro Exitoso!
                </h1>
              </div>
            )}
          </div>
        </div>
        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.5) rotate(-180deg); }
            to { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-scaleIn {
            animation: scaleIn 1.5s ease-out forwards;
          }
          .animate-fadeInUp {
            animation: fadeInUp 1s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

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