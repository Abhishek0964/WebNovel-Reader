import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingThemeToggle({ theme, onThemeChange }) {
  const themes = [
    { value: 'light', icon: '☀️', label: 'Light' },
    { value: 'dark', icon: '🌙', label: 'Dark' },
    { value: 'sepia', icon: '📜', label: 'Sepia' }
  ];

  const currentThemeIndex = themes.findIndex(t => t.value === theme);
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length];

  const handleThemeToggle = () => {
    if (onThemeChange && typeof onThemeChange === 'function') {
      onThemeChange(nextTheme.value);
    }
  };

  return (
    <motion.button
      className="floating-theme-toggle"
      onClick={handleThemeToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      title={`Switch to ${nextTheme.label} theme`}
      aria-label={`Switch to ${nextTheme.label} theme`}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {themes.find(t => t.value === theme)?.icon || '☀️'}
      </motion.span>
    </motion.button>
  );
}