import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import ContactForm from './ContactForm';
import AboutUsModal from './AboutUsModal';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-imperial-blue/95 dark:bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="logo-container group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="logo-text"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                85
              </motion.span>
            </motion.div>
            <div className="text-center md:text-left">
              <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-imperial-gold animate-glow tracking-wider">
                85th Imperium
              </h1>
              <p className="font-montserrat text-imperial-ivory/80 dark:text-imperial-charcoal/80 text-sm md:text-base tracking-wide">
                Commanding Innovation Since the 85th
              </p>
            </div>
          </motion.div>
          
          <motion.nav 
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a 
              href="#projects" 
              onClick={handleProjectsClick}
              className="nav-link"
            >
              Projects
            </a>
            <button 
              onClick={() => setShowAboutModal(true)}
              className="nav-link"
            >
              About
            </button>
            <motion.button
              onClick={() => setShowContactForm(true)}
              className="elegant-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className="theme-toggle"
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              <span className="theme-icon">
                {isDark ? '☀️' : '🌙'}
              </span>
            </motion.button>
          </motion.nav>
        </div>
      </div>
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
      <AboutUsModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </motion.header>
  );
};

export default Header;