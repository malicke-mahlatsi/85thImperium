import React, { useEffect, memo } from 'react';
import { useSpring, animated } from '@react-spring/web';

const Cursor: React.FC = memo(() => {
  const [dotProps, setDotProps] = useSpring(() => ({ 
    x: 0, 
    y: 0,
    scale: 1,
    config: { tension: 500, friction: 25 }
  }));
  const [outlineProps, setOutlineProps] = useSpring(() => ({ 
    x: 0, 
    y: 0,
    scale: 1,
    config: { tension: 400, friction: 30 }
  }));

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let rafId: number;
    let lastX = 0;
    let lastY = 0;

    const mouseMoveEvent = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Smooth interpolation
        lastX = lastX + (x - lastX) * 0.2;
        lastY = lastY + (y - lastY) * 0.2;
        
        setDotProps.start({ x, y });
        setOutlineProps.start({ x: lastX, y: lastY });
      });
    };

    const handleInteraction = (isActive: boolean) => {
      setDotProps.start({ scale: isActive ? 1.5 : 1 });
      setOutlineProps.start({ scale: isActive ? 1.5 : 1 });
    };

    document.addEventListener('mousemove', mouseMoveEvent);
    document.addEventListener('mousedown', () => handleInteraction(true));
    document.addEventListener('mouseup', () => handleInteraction(false));

    return () => {
      document.removeEventListener('mousemove', mouseMoveEvent);
      document.removeEventListener('mousedown', () => handleInteraction(true));
      document.removeEventListener('mouseup', () => handleInteraction(false));
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return null;
  }

  return (
    <>
      <animated.div
        style={{
          transform: dotProps.x.to((x) => `translate3d(${x}px, ${dotProps.y.get()}px, 0) scale(${dotProps.scale.get()})`)
        }}
        className="cursor-dot"
      />
      <animated.div
        style={{
          transform: outlineProps.x.to((x) => `translate3d(${x}px, ${outlineProps.y.get()}px, 0) scale(${outlineProps.scale.get()})`)
        }}
        className="cursor-outline"
      />
    </>
  );
});

Cursor.displayName = 'Cursor';

export default Cursor;