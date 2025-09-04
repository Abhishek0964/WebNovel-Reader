import React from 'react';
import { motion } from 'framer-motion';

export default function CreditLine() {
  return (
    <motion.div
      className="credit-line"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
    >
      <motion.span
        className="credit-text"
        whileHover={{ 
          opacity: 0.7,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        Developer and Author: Abhishek Choudhary
      </motion.span>
    </motion.div>
  );
}