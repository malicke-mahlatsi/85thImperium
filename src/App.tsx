import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Showcase from './components/Showcase';
import ProjectDetail from './components/ProjectDetail';
import SkyBackground from './components/SkyBackground';
import Particles from './components/Particles';
import Cursor from './components/Cursor';
import Intro from './components/Intro';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<Showcase />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="min-h-screen text-imperial-ivory transition-colors duration-300 relative scroll-smooth">
        {isLoading ? (
          <Intro onComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <SkyBackground />
            <Particles />
            <Cursor />
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <AnimatedRoutes />
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;