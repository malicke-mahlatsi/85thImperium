import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center bg-gradient-elegant"
    >
      <div className="text-center md:text-left mb-6 md:mb-0">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-deep-teal dark:text-muted-gold tracking-tight"
        >
          85th Imperium
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-lg text-gray-600 dark:text-light-gray font-light"
        >
          Commanding Innovation Since the 85th
        </motion.p>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => setShowContact(true)}
          className="elegant-button hover-lift"
        >
          Contact Us
        </button>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-full bg-light-gray dark:bg-gray-800 transition-colors hover:bg-opacity-80"
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </motion.div>
      {showContact && <ContactForm onClose={() => setShowContact(false)} />}
    </motion.header>
  );
};

export default Header;