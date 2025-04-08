import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { projects } from '../data/projects';

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
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff69b4,
      wireframe: true 
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    
    scene.add(torusKnot);
    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div ref={mountRef} className="w-48 h-48 mx-auto mb-8" />
          
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            {project.name}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {project.desc}
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.details}
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Visit Project
            </a>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;