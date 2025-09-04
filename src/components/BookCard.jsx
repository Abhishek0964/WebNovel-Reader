import React from 'react';
import { motion } from 'framer-motion';

export default function BookCard({ file, index, onClick, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent opening the book when clicking delete
    if (window.confirm(`Are you sure you want to remove "${file.name.replace('.txt', '')}"?`)) {
      onDelete(file);
    }
  };

  return (
    <motion.div
      className="book-card"
      onClick={() => onClick(file)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.button
        className="delete-button"
        onClick={handleDelete}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={`Remove ${file.name.replace('.txt', '')}`}
        aria-label={`Remove ${file.name.replace('.txt', '')}`}
      >
        🗑
      </motion.button>
      <div className="book-cover-placeholder">
        <div className="book-icon">📖</div>
      </div>
      <div className="book-info">
        <h3 className="book-title">{file.name.replace('.txt', '')}</h3>
        <div className="book-meta">
          <span className="book-size">{(file.size / 1024).toFixed(1)} KB</span>
          <span className="book-pages">
            {Math.ceil(file.content?.length / 2000) || 0} pages
          </span>
        </div>
      </div>
    </motion.div>
  );
}