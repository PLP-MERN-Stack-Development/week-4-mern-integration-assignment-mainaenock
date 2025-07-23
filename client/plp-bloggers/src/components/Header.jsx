import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav className="flex items-center gap-4">
        <NavLink to="/" className="font-bold text-lg text-gray-800 dark:text-gray-100">Home</NavLink>
        {user && (
          <NavLink to="/create" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm">Create Post</NavLink>
        )}
        {user ? (
          <span className="text-gray-600 dark:text-gray-300">Welcome, {user.username}</span>
        ) : null}
      </nav>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <span role="img" aria-label="Light mode">🌞</span>
          ) : (
            <span role="img" aria-label="Dark mode">🌙</span>
          )}
        </button>
        {user ? (
          <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
        ) : (
          <>
            <NavLink to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</NavLink>
            <NavLink to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 