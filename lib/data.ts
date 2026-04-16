import { Project, Skill, Experience, Service } from '../types';

export const skills: Skill[] = [
  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Vue.js', category: 'frontend' },
  { name: 'HTML / CSS', category: 'frontend' },

  // Backend
  { name: 'Node.js', category: 'backend' },
  { name: 'Express.js', category: 'backend' },
  { name: 'Laravel', category: 'backend' },
  { name: 'PHP', category: 'backend' },
  { name: 'Python', category: 'backend' },
  { name: 'GraphQL', category: 'backend' },

  // Mobile
  { name: 'React Native', category: 'mobile' },
  { name: 'Flutter', category: 'mobile' },
  { name: 'Expo', category: 'mobile' },

  // Design
  { name: 'Figma', category: 'design' },
  { name: 'Photoshop', category: 'design' },
  { name: 'Adobe XD', category: 'design' },
  { name: 'UI/UX Design', category: 'design' },

  // IoT
  { name: 'Arduino', category: 'iot' },
  { name: 'C / C++', category: 'iot' },
  { name: 'ESP32', category: 'iot' },
  { name: 'MQTT', category: 'iot' },

  // Tools & DB
  { name: 'Git', category: 'tools' },
  { name: 'Docker', category: 'tools' },
  { name: 'MongoDB', category: 'tools' },
  { name: 'PostgreSQL', category: 'tools' },
  { name: 'Redis', category: 'tools' },
  { name: 'AWS', category: 'tools' },
];

export const experiences: Experience[] = [
  {
    id: '00000000-0000-0000-0000-000000000011',
    company: 'WAOUH MONDE',
    role: 'Designer UX/UI',
    roleEn: 'UX/UI Designer',
    period: 'Oct 2025 — Présent',
    location: 'Calavi, Bénin',
    description:
      "Conception d'interfaces utilisateur pour des projets digitaux variés. Création de maquettes et prototypes sur Figma, accompagnement des équipes de développement dans l'implémentation des designs.",
    descriptionEn:
      'UI design for various digital projects. Creating wireframes and prototypes in Figma, guiding development teams in design implementation.',
    technologies: ['Figma', 'Photoshop', 'Adobe XD', 'Design System'],
    current: true,
    type: 'work',
  },
  {
    id: '00000000-0000-0000-0000-000000000012',
    company: 'CITECH',
    role: 'Développeur Web & Mobile',
    roleEn: 'Web & Mobile Developer',
    period: 'Fév 2024 — Juil 2024',
    location: 'Porto-Novo, Bénin',
    description:
      "Développement d'applications web et mobiles pour des clients variés. Intégration de fonctionnalités, maintenance et amélioration des applications existantes.",
    descriptionEn:
      'Developing web and mobile applications for various clients. Feature integration, maintenance and improvement of existing apps.',
    technologies: ['React', 'Node.js', 'React Native', 'MongoDB'],
    current: false,
    type: 'work',
  },
  {
    id: '00000000-0000-0000-0000-000000000013',
    company: 'IU Les Cours Sonou',
    role: 'Licence Professionnelle — Génie Logiciel',
    roleEn: 'Professional Bachelor — Software Engineering',
    period: '2021 — 2024',
    location: 'Calavi, Bénin',
    description:
      'Formation complète en génie logiciel : algorithmique, bases de données, développement web & mobile, conception orientée objet, gestion de projets informatiques.',
    descriptionEn:
      'Comprehensive software engineering training: algorithms, databases, web & mobile development, OOP, IT project management.',
    technologies: ['Java', 'SQL', 'Web', 'Algorithmique', 'UML'],
    current: false,
    type: 'education',
  },
];

export const services: Service[] = [
  {
    id: '00000000-0000-0000-0000-000000000021',
    icon: '🌐',
    title: 'Développement Web',
    titleEn: 'Web Development',
    description:
      'Sites vitrines, applications web, e-commerce, dashboards — du design à la mise en ligne.',
    descriptionEn:
      'Landing pages, web apps, e-commerce, dashboards — from design to deployment.',
    technologies: ['Next.js', 'React', 'Laravel', 'Node.js', 'TypeScript'],
  },
  {
    id: '00000000-0000-0000-0000-000000000022',
    icon: '📱',
    title: 'Développement Mobile',
    titleEn: 'Mobile Development',
    description:
      'Applications iOS & Android performantes, intuitives et natives avec des expériences fluides.',
    descriptionEn:
      'Performant, intuitive iOS & Android apps with smooth native experiences.',
    technologies: ['React Native', 'Flutter', 'Expo'],
  },
  {
    id: '00000000-0000-0000-0000-000000000023',
    icon: '🎨',
    title: 'Design UX/UI',
    titleEn: 'UX/UI Design',
    description:
      "Interfaces belles, accessibles et centrées sur l'utilisateur. Du wireframe au prototype interactif.",
    descriptionEn:
      'Beautiful, accessible, user-centered interfaces. From wireframes to interactive prototypes.',
    technologies: ['Figma', 'Photoshop', 'Adobe XD'],
  },
  {
    id: '00000000-0000-0000-0000-000000000024',
    icon: '🔌',
    title: 'IoT & Systèmes embarqués',
    titleEn: 'IoT & Embedded Systems',
    description:
      'Objets connectés, maisons intelligentes, automatisation et systèmes embarqués sécurisés.',
    descriptionEn:
      'Connected objects, smart homes, automation and secure embedded systems.',
    technologies: ['Arduino', 'ESP32', 'C++', 'MQTT'],
  },
  {
    id: '00000000-0000-0000-0000-000000000025',
    icon: '🛡️',
    title: 'Cybersécurité',
    titleEn: 'Cybersecurity',
    description:
      'Protection de sites web, systèmes de reverse proxy, audit de sécurité et prévention des vulnérabilités.',
    descriptionEn:
      'Website protection, reverse proxy systems, security audits and vulnerability prevention.',
    technologies: ['Nginx', 'Reverse Proxy', 'Firewall', 'OWASP'],
  },
  {
    id: '00000000-0000-0000-0000-000000000026',
    icon: '⚡',
    title: 'Solutions sur mesure',
    titleEn: 'Custom Solutions',
    description:
      'Vous avez une idée, un problème à résoudre ? Je construis la solution qui correspond exactement à vos besoins.',
    descriptionEn:
      'Got an idea or a problem to solve? I build the solution that fits your exact needs.',
    technologies: ['Full Stack', 'Architecture', 'API', 'Cloud'],
  },
];

export const projects: Project[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    title: 'E-Commerce Platform',
    description:
      'Plateforme e-commerce complète avec paiement, gestion des stocks et analytics en temps réel.',
    descriptionEn:
      'Full e-commerce platform with payments, inventory management and real-time analytics.',
    image:
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/FritPrince/fullecommerce.git',
    demoUrl: 'https://fullecommerce-nine.vercel.app/',
    featured: true,
    category: 'fullstack',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    title: 'Task Management App',
    description:
      'Application de gestion de tâches collaborative avec temps réel et notifications.',
    descriptionEn:
      'Collaborative task management app with real-time updates and notifications.',
    image:
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redux'],
    githubUrl: 'https://github.com/example/taskmanager',
    demoUrl: 'https://taskflow-gmsu.vercel.app/',
    featured: true,
    category: 'fullstack',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    title: 'EduPal',
    description:
      'Application mobile de gestion des cours offline avec réalité augmentée, cahier d\'exercices interactif et suivi psychologique.',
    descriptionEn:
      'Mobile app for offline course management with AR, interactive exercises and psychological tracking.',
    image:
      'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Expo', 'React Native', 'AR'],
    githubUrl: 'https://github.com/FritPrince/EduPalMobile.git',
    demoUrl: '',
    featured: false,
    category: 'frontend',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    title: 'MamansLink',
    description:
      'Application mobile aidant les femmes enceintes avec suivi de grossesse, dons de matériel, chat avec sages-femmes et communauté.',
    descriptionEn:
      'Mobile app helping pregnant women with pregnancy tracking, equipment donations, midwife chat and community.',
    image:
      'https://images.pexels.com/photos/1556665/pexels-photo-1556665.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Expo', 'React Native', 'Chat'],
    githubUrl: 'https://github.com/FritPrince/MamansLinkMobile.git',
    demoUrl: '',
    featured: false,
    category: 'frontend',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    title: 'TicketApp',
    description:
      'Réservez votre place en ligne, recevez un QR Code unique et soyez alerté lorsque c\'est votre tour.',
    descriptionEn:
      'Book your spot online, receive a unique QR code and get notified when it\'s your turn.',
    image:
      'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Laravel', 'React.js', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/FritPrince/ticketApp.git',
    demoUrl: '',
    featured: false,
    category: 'fullstack',
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    title: 'Job',
    description:
      'Révolutionnez le recrutement avec des CV vidéo anonymisés, formations micro-learning et réseau d\'entreprises inclusives.',
    descriptionEn:
      'Revolutionize recruitment with anonymous video CVs, micro-learning training and inclusive company network.',
    image:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['React.js', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/FritPrince/Job.git',
    demoUrl: 'https://job-psi-six.vercel.app',
    featured: false,
    category: 'frontend',
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    title: 'Donation Globe',
    description:
      'Visualisez géographiquement les dons reçus sur un globe interactif 3D pour suivre leur répartition mondiale.',
    descriptionEn:
      'Geographically visualize donations on an interactive 3D globe to track worldwide distribution.',
    image:
      'https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['React.js', 'Tailwind CSS', 'TypeScript', 'Three.js'],
    githubUrl: 'https://github.com/FritPrince/Donation.git',
    demoUrl: 'https://donation-omega-drab.vercel.app/',
    featured: true,
    category: 'frontend',
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    title: 'CT ConstruTech',
    description:
      'Site officiel d\'un cabinet d\'architecture et construction. Plus de 260 projets, services de conception, visualisation 3D et rénovation.',
    descriptionEn:
      'Official website for an architecture & construction firm. Over 260 projects, design services, 3D visualization and renovation.',
    image:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Architecture', 'Design 3D', 'Gestion de projet', 'Rénovation'],
    githubUrl: '',
    demoUrl: 'http://ct-construtech.com/',
    featured: true,
    category: 'fullstack',
  },
  {
    id: '00000000-0000-0000-0000-000000000009',
    title: 'Souw Travel',
    description:
      'Agence de voyage spécialisée dans l\'accompagnement administratif pour les visas, l\'immigration et la mobilité internationale.',
    descriptionEn:
      'Travel agency specializing in administrative support for visas, immigration and international mobility.',
    image:
      'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Voyage', 'Visa & Immigration', 'Tourisme', 'Conseil'],
    githubUrl: '',
    demoUrl: 'https://souwtravel.com/',
    featured: true,
    category: 'fullstack',
  },
];
