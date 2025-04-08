import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { supabase } from '../lib/supabase';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(60, 60);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff69b4,
      wireframe: true 
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    
    scene.add(icosahedron);
    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      icosahedron.rotation.x += 0.01;
      icosahedron.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('contacts')
        .insert([formData]);

      if (supabaseError) throw supabaseError;

      setFormData({ name: '', email: '', message: '' });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-pink-100 to-white dark:from-pink-900 dark:to-gray-900 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                Let's Connect
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Drop us a message and we'll get back to you
              </p>
            </div>
            <div ref={mountRef} className="w-16 h-16" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border-2 border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border-2 border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={4}
                className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border-2 border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:focus:border-pink-400 focus:outline-none transition-colors placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="py-3 px-6 border-2 border-pink-500 text-pink-500 font-bold rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;