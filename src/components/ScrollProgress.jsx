import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress({ scrollRef }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef?.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const totalScrollable = scrollHeight - clientHeight;
        const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const scrollElement = scrollRef?.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
      
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollRef]);

  return (
    <div className="scroll-progress-container">
      <motion.div
        className="scroll-progress-bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
    </div>
  );
}