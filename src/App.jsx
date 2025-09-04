import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reader from "./components/Reader";
import BookCard from "./components/BookCard";
import EmptyState from "./components/EmptyState";
import FloatingThemeToggle from "./components/FloatingThemeToggle";
import CreditLine from "./components/CreditLine";

export default function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [theme, setTheme] = useState("light");
  const [autoSort, setAutoSort] = useState(false);

  // Load saved files, last opened book, and theme from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('webnovel-files');
    const lastOpenedBook = localStorage.getItem('webnovel-last-book');
    const savedTheme = localStorage.getItem('webnovel-theme');
    const savedAutoSort = localStorage.getItem('webnovel-auto-sort');
    
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        const sortedFiles = savedAutoSort === 'true' ? 
          [...parsedFiles].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })) :
          parsedFiles;
        setFiles(sortedFiles);
        
        // Restore last opened book if it exists
        if (lastOpenedBook && sortedFiles.find(f => f.name === lastOpenedBook)) {
          const lastFile = sortedFiles.find(f => f.name === lastOpenedBook);
          setSelectedFile(lastFile);
          setSelectedFileName(lastFile.name);
        }
      } catch (error) {
        console.error('Error loading saved files:', error);
      }
    }

    // Restore saved theme
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Restore auto-sort preference
    if (savedAutoSort) {
      setAutoSort(savedAutoSort === 'true');
    }
  }, []);

  // Save files to localStorage whenever files change
  useEffect(() => {
    if (files.length > 0) {
      const filesToSave = files.map(file => ({
        name: file.name,
        content: file.content,
        lastModified: file.lastModified,
        size: file.size
      }));
      localStorage.setItem('webnovel-files', JSON.stringify(filesToSave));
    }
  }, [files]);

  // Save theme to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('webnovel-theme', theme);
  }, [theme]);

  // Save auto-sort preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('webnovel-auto-sort', autoSort.toString());
  }, [autoSort]);
  const handleFileChange = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    await processFiles(uploadedFiles);
  };

  const processFiles = async (uploadedFiles) => {
    // Read file contents and store them
    const filesWithContent = await Promise.all(
      uploadedFiles.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              content: reader.result,
              lastModified: file.lastModified,
              size: file.size
            });
          };
          reader.readAsText(file);
        });
      })
    );

    setFiles(prev => {
      const newFiles = [...prev, ...filesWithContent];
      // Auto-sort if enabled
      return autoSort ? 
        newFiles.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })) :
        newFiles;
    });
  };

  const handleBookSelect = (file) => {
    setSelectedFile(file);
    setSelectedFileName(file.name);
    // Save last opened book to localStorage
    localStorage.setItem('webnovel-last-book', file.name);
  };

  const handleBackToLibrary = () => {
    setSelectedFile(null);
    setSelectedFileName(null);
    localStorage.removeItem('webnovel-last-book');
  };

  const handleDeleteBook = (fileToDelete) => {
    const updatedFiles = files.filter(file => 
      file.name !== fileToDelete.name || file.lastModified !== fileToDelete.lastModified
    );
    setFiles(updatedFiles);
    
    // Update localStorage
    if (updatedFiles.length > 0) {
      const filesToSave = updatedFiles.map(file => ({
        name: file.name,
        content: file.content,
        lastModified: file.lastModified,
        size: file.size
      }));
      localStorage.setItem('webnovel-files', JSON.stringify(filesToSave));
    } else {
      localStorage.removeItem('webnovel-files');
    }
    
    // If the deleted book was currently open, go back to library
    if (selectedFile && selectedFile.name === fileToDelete.name && 
        selectedFile.lastModified === fileToDelete.lastModified) {
      handleBackToLibrary();
    }
    
    // Remove any saved scroll position for this book
    localStorage.removeItem(`webnovel-scroll-${fileToDelete.name}`);
    
    // If this was the last opened book, clear that too
    const lastOpenedBook = localStorage.getItem('webnovel-last-book');
    if (lastOpenedBook === fileToDelete.name) {
      localStorage.removeItem('webnovel-last-book');
    }
  };

  const handleSortAZ = () => {
    const sortedFiles = [...files].sort((a, b) => 
      a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    );
    setFiles(sortedFiles);
    setAutoSort(true);
    
    // Update localStorage with sorted files
    if (sortedFiles.length > 0) {
      const filesToSave = sortedFiles.map(file => ({
        name: file.name,
        content: file.content,
        lastModified: file.lastModified,
        size: file.size
      }));
      localStorage.setItem('webnovel-files', JSON.stringify(filesToSave));
    }
  };

  // Global theme change handler
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'text/plain' || file.name.endsWith('.txt')
    );
    
    if (droppedFiles.length > 0) {
      await processFiles(droppedFiles);
    }
  };

  return (
    <div className={`app ${theme}`}>
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              📖 Offline Webnovel Reader
            </motion.h1>
            
            <motion.div 
              className={`upload-section ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <input 
                type="file" 
                accept=".txt" 
                multiple 
                onChange={handleFileChange}
                id="file-input"
              />
              <label htmlFor="file-input" className="upload-button">
                <span className="upload-icon">📁</span>
                Choose .txt files
              </label>
              <p className="upload-hint">or drag and drop files here</p>
            </motion.div>

            {files.length > 1 && (
              <motion.div 
                className="library-controls"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <motion.button
                  className="sort-button"
                  onClick={handleSortAZ}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sort books alphabetically A-Z"
                >
                  📚 Organize A-Z
                </motion.button>
                {autoSort && (
                  <motion.span 
                    className="auto-sort-indicator"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✓ Auto-sort enabled
                  </motion.span>
                )}
              </motion.div>
            )}

            <div className="bookshelf">
              {files.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div 
                  className="books-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {files.map((file, idx) => (
                    <BookCard
                      key={`${file.name}-${idx}`}
                      file={file}
                      index={idx}
                      onClick={handleBookSelect}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Reader 
              file={selectedFile} 
              fileName={selectedFileName}
              onBack={handleBackToLibrary}
              theme={theme}
              onThemeChange={handleThemeChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global floating theme toggle - always visible */}
      <FloatingThemeToggle theme={theme} onThemeChange={handleThemeChange} />
      
      {/* Credit line - always visible */}
      <CreditLine />
    </div>
  );
}