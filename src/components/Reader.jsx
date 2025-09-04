import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ScrollProgress from "./ScrollProgress";

export default function Reader({ file, fileName, onBack, theme, onThemeChange }) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(18);
  const [scrollPosition, setScrollPosition] = useState(0);
  const textContentRef = useRef(null);

  // Load saved preferences and scroll position from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('webnovel-font-size');
    const savedScrollPosition = localStorage.getItem(`webnovel-scroll-${fileName}`);

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedScrollPosition) setScrollPosition(parseInt(savedScrollPosition));
  }, [fileName]);

  // Set text content from file object
  useEffect(() => {
    if (file && file.content) {
      setText(file.content);
    }
  }, [file]);

  // Restore scroll position after text loads
  useEffect(() => {
    if (text && scrollPosition > 0) {
      const timeoutId = setTimeout(() => {
        if (textContentRef.current) {
          textContentRef.current.scrollTop = scrollPosition;
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [text, scrollPosition]);

  // Save font size to localStorage when changed
  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    localStorage.setItem('webnovel-font-size', newSize);
  };

  // Handle theme change through props
  const handleThemeChange = (e) => {
    onThemeChange(e.target.value);
  };

  // Save scroll position periodically
  const handleScroll = () => {
    if (textContentRef.current) {
      const position = textContentRef.current.scrollTop;
      setScrollPosition(position);
      // Debounce saving to localStorage
      clearTimeout(window.scrollSaveTimeout);
      window.scrollSaveTimeout = setTimeout(() => {
        localStorage.setItem(`webnovel-scroll-${fileName}`, position);
      }, 500);
    }
  };

  // Calculate reading stats
  const wordsCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordsCount / 200); // Average reading speed: 200 words/minute

  return (
    <motion.div 
      className={`reader ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ScrollProgress scrollRef={textContentRef} />
      
      <motion.div 
        className="reader-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button 
          className="back-button" 
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Library
        </motion.button>
        <div className="book-info">
          <h2 className="book-title">{fileName?.replace('.txt', '')}</h2>
          <div className="book-stats">
            <span>{wordsCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="controls"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="control-group">
          <label>Font Size: {fontSize}px</label>
          <input 
            type="range" 
            min="14" 
            max="32" 
            value={fontSize}
            onChange={handleFontSizeChange}
            className="font-slider"
          />
        </div>
        
        <div className="control-group desktop-only">
          <label>Theme:</label>
          <select 
            onChange={handleThemeChange} 
            value={theme}
            className="theme-select"
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="sepia">📜 Sepia</option>
          </select>
        </div>
      </motion.div>
      
      <motion.div 
        className="text-content" 
        style={{ fontSize: `${fontSize}px` }}
        ref={textContentRef}
        onScroll={handleScroll}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {text || "Loading..."}
      </motion.div>
    </motion.div>
  );
}