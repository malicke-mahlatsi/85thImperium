import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ReactMarkdown from 'react-markdown';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === Number(id));
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(200, 200);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xD4AF37,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    
    scene.add(torusKnot);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!project) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-imperial-gold">Project not found</h2>
          <button
            onClick={() => navigate('/')}
            className="elegant-button text-white"
          >
            Return Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-imperial-blue/30 dark:bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-imperial-gold/10">
        <div className="p-8">
          <div ref={mountRef} className="w-48 h-48 mx-auto mb-8 floating" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4 text-imperial-gold dark:text-imperial-blue text-shadow"
          >
            {project.name}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-imperial-ivory/80 dark:text-imperial-charcoal/80 mb-6 font-light"
          >
            {project.desc}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="prose prose-invert dark:prose-invert max-w-none mb-8"
          >
            <ReactMarkdown>{project.details}</ReactMarkdown>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-imperial-gold dark:text-imperial-blue">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-imperial-gold/10 text-imperial-gold dark:text-imperial-blue rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="elegant-button text-white text-center flex-1"
            >
              Visit Project
            </a>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 border-2 border-imperial-gold dark:border-imperial-blue text-imperial-gold dark:text-imperial-blue rounded-lg hover:bg-imperial-gold/5 dark:hover:bg-imperial-blue/5 transition-colors duration-300 text-center font-medium flex-1"
            >
              Back to Projects
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;