import { Project, Skill } from '../types';

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 90, category: 'frontend' },
  { name: 'Next.js', level: 85, category: 'frontend' },
  { name: 'TypeScript', level: 88, category: 'frontend' },
  { name: 'Tailwind CSS', level: 92, category: 'frontend' },
  { name: 'Vue.js', level: 75, category: 'frontend' },
  
  // Backend
  { name: 'Node.js', level: 85, category: 'backend' },
  { name: 'Express.js', level: 80, category: 'backend' },
  { name: 'Python', level: 75, category: 'backend' },
  { name: 'GraphQL', level: 70, category: 'backend' },
  
  // Database
  { name: 'MongoDB', level: 82, category: 'database' },
  { name: 'PostgreSQL', level: 78, category: 'database' },
  { name: 'Redis', level: 65, category: 'database' },
  
  // Tools
  { name: 'Git', level: 90, category: 'tools' },
  { name: 'Docker', level: 70, category: 'tools' },
  { name: 'AWS', level: 65, category: 'tools' },
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Plateforme e-commerce complète avec paiement, gestion des stocks et analytics en temps réel.',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/FritPrince/fullecommerce.git',
    demoUrl: 'https://fullecommerce-nine.vercel.app/',
    featured: true,
    category: 'fullstack'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Application de gestion de tâches collaborative avec temps réel et notifications.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redux'],
    githubUrl: 'https://github.com/example/taskmanager',
    demoUrl: 'https://taskflow-gmsu.vercel.app/',
    featured: true,
    category: 'fullstack'
  },
  {
    id: '3',
    title: 'EduPal',
    description: 'Application mobile de gestion des cours offline avec réalité augmentée, Cahier d\'exercices interactif, Suivi psychologique via dessins animés thérapeutiques',
    image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Expo', 'React Native', 'AR'],
    githubUrl: 'https://github.com/FritPrince/EduPalMobile.git',
    demoUrl: '',
    featured: false,
    category: 'frontend'
  },
  {
    id: '4',
    title: 'MamansLink',
    description: 'Cette application mobile aide les femmes enceintes et jeunes mamans en proposant un suivi de grossesse, des dons de matériel, un chat avec des sages-femmes et une communauté de soutien.',
    image: 'https://images.pexels.com/photos/1556665/pexels-photo-1556665.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Expo', 'React Native', 'Chat'],
    githubUrl: 'https://github.com/FritPrince/MamansLinkMobile.git',
    demoUrl: 'https://demo-analytics.com',
    featured: false,
    category: 'backend'
  },
  {
    id: '5',
    title: 'TicketApp',
    description: 'Réservez votre place en ligne, recevez un QR Code unique et soyez alerté lorsque c\'est votre tour. Plus besoin de faire la queue physiquement',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Laravel', 'React.js', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/FritPrince/ticketApp.git',
    demoUrl: 'https://demo-analytics.com',
    featured: false,
    category: 'fullstack'
  },
  {
    id: '6',
    title: 'Job',
    description: 'Révolutionnez le recrutement avec nos CV vidéo anonymisés, formations micro-learning et réseau d\'entreprises inclusives.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['React.js', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/FritPrince/Job.git',
    demoUrl: 'https://job-psi-six.vercel.app',
    featured: false,
    category: 'frontend'
  },
  {
    id: '7',
    title: 'Donation',
    description: 'L\'objectif principal de l\'application est de visualiser géographiquement les dons reçus sur un globe interactif 3D pour suivre leur répartition mondiale par projet et montant',
    image: 'https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['React.js', 'Tailwind CSS', 'TypeScript', 'Three.js'],
    githubUrl: 'https://github.com/FritPrince/Donation.git',
    demoUrl: 'https://donation-omega-drab.vercel.app/',
    featured: false,
    category: 'frontend'
  }
];