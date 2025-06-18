import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Crear el contexto
export const ThemeContext = createContext();

// 2. Crear el proveedor del contexto
export const ThemeProvider = ({ children }) => {
  // Intentar cargar el modo oscuro desde el localStorage, por defecto falso
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Guardar el modo oscuro en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    // Aplicar la clase 'dark' al <body> para Tailwind CSS JIT/dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema fácilmente
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};