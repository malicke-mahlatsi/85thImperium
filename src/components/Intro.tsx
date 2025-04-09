import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Intro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current || !overlayRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a2a, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xD4AF37, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xD4AF37, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create animated object
    const geometry = new THREE.IcosahedronGeometry(1, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0xD4AF37,
      wireframe: true,
      wireframeLinewidth: 2,
      transparent: true,
      opacity: 0,
      emissive: 0xD4AF37,
      emissiveIntensity: 0.5,
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    camera.position.z = 5;

    // Initial animations
    gsap.to(material, {
      opacity: 1,
      duration: 1,
      ease: "power2.inOut"
    });

    gsap.from(icosahedron.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    });

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Loading progress animation
    let startTime = Date.now();
    const duration = 4000; // 4 seconds

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        handleComplete();
      }
    };

    requestAnimationFrame(updateProgress);

    // Animation
    let rotationSpeed = { value: 0 };
    gsap.to(rotationSpeed, {
      value: 0.02,
      duration: 2,
      ease: "power2.inOut"
    });

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      icosahedron.rotation.x += rotationSpeed.value;
      icosahedron.rotation.y += rotationSpeed.value;
      
      // Pulse effect
      const pulseScale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
      icosahedron.scale.set(pulseScale, pulseScale, pulseScale);
      
      renderer.render(scene, camera);
      return animationId;
    };

    const animationId = animate();

    // Exit animation and cleanup
    const handleComplete = () => {
      gsap.to(material, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete();
        }
      });
    };

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-imperial-blue/95 z-50 flex flex-col items-center justify-center">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-cinzel text-imperial-gold mb-8 animate-glow">
          85th Imperium
        </h1>
        <div className="w-64 md:w-96 mx-auto">
          <div className="h-2 bg-imperial-gold/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-imperial-gold transition-transform duration-300 ease-out rounded-full"
              style={{ 
                transform: `translateX(-${100 - progress}%)`
              }}
            />
          </div>
          <p className="mt-4 text-imperial-gold font-montserrat">
            Loading Future Technologies... {progress}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;