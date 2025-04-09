import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useInView } from 'react-intersection-observer';

const Particles: React.FC = () => {
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    triggerOnce: true
  });

  useEffect(() => {
    if (!particlesContainerRef.current || !inView) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    particlesContainerRef.current.appendChild(renderer.domElement);

    // Optimize particle count based on device
    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 50 : 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      particlesPositions[i * 3] = (Math.random() - 0.5) * window.innerWidth;
      particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight;
      particlesPositions[i * 3 + 2] = Math.random() * window.innerHeight;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: '#ff69b4',
      size: isMobile ? 3 : 2,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = window.innerHeight / 2;

    let animationFrameId: number;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;

      if (deltaTime > interval) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
        renderer.render(scene, camera);
        lastTime = currentTime - (deltaTime % interval);
      }
    };

    window.addEventListener('resize', handleResize);
    animate(0);
    setIsReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      scene.remove(particles);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      if (particlesContainerRef.current?.contains(renderer.domElement)) {
        particlesContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [inView]);

  // Set up the refs properly
  useEffect(() => {
    if (particlesContainerRef.current) {
      inViewRef(particlesContainerRef.current);
    }
  }, [inViewRef]);

  return (
    <div 
      ref={particlesContainerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
      style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
    />
  );
};

export default Particles;