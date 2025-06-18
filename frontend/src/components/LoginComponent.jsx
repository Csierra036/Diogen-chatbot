// frontend/src/components/LoginComponent.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importa los íconos de lucide-react
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';

//import logo from '../assets/logo.png'; 


function LoginComponent({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el botón de carga
  const navigate = useNavigate();

  const handleSubmit = async (e) => { // Eliminado el tipo React.FormEvent
    e.preventDefault();
    setError('');
    setIsLoading(true); // Activar el estado de carga

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
        const token = data.access_token;
        const userFirstName = data.user_info ? data.user_info.firstname : email; // Ajusta según tu backend
        
        onLoginSuccess(token);
        localStorage.setItem('userFirstName', userFirstName); // Guarda el nombre del usuario
        
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || errorData.message || 'Error de inicio de sesión. Credenciales inválidas.');
      }
    } catch (err) {
      console.error("Error al intentar iniciar sesión:", err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false); // Desactivar el estado de carga siempre
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400/30 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-cyan-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rotate-45 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-300/60 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-indigo-300/50 rotate-45 animate-ping" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-indigo-900/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
      
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
            <p className="text-blue-200/80">Inicia sesión en tu cuenta</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-300 transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-300 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300/70 hover:text-blue-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 animate-shake">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-500/50 disabled:to-indigo-600/50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-blue-200/80">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="text-blue-300 hover:text-white font-medium transition-colors duration-300 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-blue-200/60 text-sm">
              Al iniciar sesión, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for shake animation - Tailwind no tiene esto por defecto */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default LoginComponent;