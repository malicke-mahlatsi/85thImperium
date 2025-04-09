import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const SkyBackground: React.FC = memo(() => {
  const [stars] = useState<Star[]>(() => 
    Array.from({ length: window.innerWidth < 768 ? 50 : 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }))
  );

  const [isDark, setIsDark] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const handleResize = () => {
      // Force re-render on window resize for responsive star count
      setIsDark(prev => prev);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden transition-colors duration-1000">
      <AnimatePresence mode="wait">
        {!isDark ? (
          <motion.div
            key="day"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] dark:from-white dark:to-gray-100"
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={`cloud-${index}`}
                className="cloud"
                initial={{ x: '-100%' }}
                animate={{ x: '100vw' }}
                transition={{
                  duration: 20 + index * 5,
                  repeat: Infinity,
                  delay: -index * 7,
                  ease: "linear"
                }}
                style={{
                  width: `${180 + (index * 20)}px`,
                  height: `${90 + (index * 10)}px`,
                  top: `${10 + (index * 15)}%`,
                  opacity: 0.8 - (index * 0.1)
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="night"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364]"
          >
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SkyBackground.displayName = 'SkyBackground';

export default SkyBackground;