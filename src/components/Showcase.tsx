import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { projects } from '../data/projects';

const Showcase: React.FC = () => {
  const createScene = (mountElement: HTMLDivElement) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(100, 100);
    mountElement.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff69b4,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    
    scene.add(torusKnot);
    camera.position.z = 2;

    return { scene, camera, renderer, torusKnot };
  };

  const ProjectCard: React.FC<{ project: typeof projects[0]; index: number }> = ({ project, index }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();
    const sceneRef = useRef<{
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      renderer: THREE.WebGLRenderer;
      torusKnot: THREE.Mesh;
    }>();
    
    useEffect(() => {
      if (!mountRef.current) return;
      
      sceneRef.current = createScene(mountRef.current);
      const { scene, camera, renderer, torusKnot } = sceneRef.current;
      
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.02;
        renderer.render(scene, camera);
      };
      
      animate();

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
            } else {
              if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(mountRef.current);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (mountRef.current) {
          observer.unobserve(mountRef.current);
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
      <div 
        className="group relative p-6 rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] bg-gradient-elegant hover:shadow-2xl"
        style={{
          animation: `fadeIn 0.5s ease-out ${index * 0.2}s backwards`
        }}
      >
        <div className="absolute inset-0 bg-gradient-y2k opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div ref={mountRef} className="w-24 h-24 mx-auto mb-4 relative z-10" />
        <h2 className="text-2xl font-bold mb-3 text-gradient-y2k relative z-10">
          {project.name}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 relative z-10">
          {project.desc}
        </p>
        <div className="flex gap-3 relative z-10">
          <Link 
            to={`/project/${project.id}`}
            className="inline-block px-4 py-2 rounded-lg bg-deep-teal text-white hover:bg-opacity-90 transition-colors duration-200"
          >
            Learn More
          </Link>
          <a 
            href={project.link}
            className="inline-block px-4 py-2 rounded-lg border-2 border-deep-teal text-deep-teal dark:text-muted-gold hover:bg-deep-teal/10 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit
          </a>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-gradient-y2k">
        Our Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Showcase;