import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { Link, useLocation } from 'react-router-dom';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(120, 120);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xD4AF37,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 2.5;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      mesh.rotation.z += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleProjectClick = (e: React.MouseEvent) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      window.location.href = `/project/${project.id}`;
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      style={{ scale }}
      className="elegant-card group hover:transform hover:scale-105 transition-all duration-300"
    >
      <motion.div 
        ref={mountRef}
        style={{ rotateY: rotationY }}
        className="w-30 h-30 mx-auto mb-6 floating"
      />
      
      <motion.h2 
        className="text-2xl font-bold mb-3 text-imperial-gold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {project.name}
      </motion.h2>
      
      <motion.p 
        className="text-imperial-ivory/80 dark:text-imperial-charcoal/80 mb-6 font-light line-clamp-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {project.desc}
      </motion.p>
      
      <motion.div 
        className="flex flex-wrap gap-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {project.technologies.slice(0, 3).map((tech, i) => (
          <span
            key={i}
            className="px-3 py-1 text-sm bg-imperial-gold/10 text-imperial-gold rounded-full font-medium"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span className="px-3 py-1 text-sm bg-imperial-gold/10 text-imperial-gold rounded-full font-medium">
            +{project.technologies.length - 3} more
          </span>
        )}
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link 
          to={`/project/${project.id}`}
          onClick={handleProjectClick}
          className="elegant-button text-white text-center"
        >
          View Details
        </Link>
        <a 
          href={project.link}
          className="px-6 py-2.5 border-2 border-imperial-gold text-imperial-gold rounded-lg hover:bg-imperial-gold/5 transition-colors duration-300 text-center font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Project
        </a>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;