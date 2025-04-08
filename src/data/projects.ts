export interface Project {
  id: number;
  name: string;
  desc: string;
  details: string;
  technologies: string[];
  link: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Quantum Edge',
    desc: 'Next-gen quantum computing interface',
    details: 'A revolutionary quantum computing interface that bridges the gap between classical and quantum systems. Features an intuitive visual programming environment and real-time quantum state visualization.',
    technologies: ['React', 'TypeScript', 'WebGL', 'Quantum API'],
    link: 'https://example.com/quantum'
  },
  {
    id: 2,
    name: 'Neo Vision',
    desc: 'AI-powered visual recognition system',
    details: 'Advanced computer vision platform leveraging state-of-the-art AI models for real-time object detection, facial recognition, and scene understanding.',
    technologies: ['TensorFlow.js', 'React', 'WebAssembly', 'Computer Vision'],
    link: 'https://example.com/vision'
  },
  {
    id: 3,
    name: 'Cyber Pulse',
    desc: 'Cybersecurity monitoring platform',
    details: 'Real-time cybersecurity monitoring system with advanced threat detection, network analysis, and automated response capabilities.',
    technologies: ['React', 'TypeScript', 'WebSockets', 'Security APIs'],
    link: 'https://example.com/pulse'
  }
];