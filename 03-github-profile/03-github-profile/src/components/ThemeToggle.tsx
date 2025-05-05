// src/components/ThemeToggle.tsx

import { useEffect, useState } from "preact/hooks";

interface ThemeToggleProps {
  initialTheme?: 'light' | 'dark';
  sunIcon?: string;
  moonIcon?: string;
  className?: string;
}

export default function ThemeToggle({
  initialTheme,
  sunIcon = '☀️',
  moonIcon = '🌙',
  className = ''
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme || 'light');

  useEffect(() => {
    // Verificar tema guardado en localStorage o preferencia del sistema
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initial = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      className={`
        fixed top-4 right-4 z-50
        p-3 rounded-full shadow-lg
        bg-white dark:bg-gray-800
        text-gray-800 dark:text-yellow-300
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${className}
      `}    >
      {theme === 'light' ? sunIcon : moonIcon}
    </button>
  );
}