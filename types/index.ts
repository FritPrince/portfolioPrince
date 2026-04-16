export interface Project {
  id: string;
  title: string;
  description: string;
  descriptionEn?: string;
  image: string;
  gallery?: string[];
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'design' | 'iot' | 'tools';
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  roleEn: string;
  period: string;
  location: string;
  description: string;
  descriptionEn?: string;
  technologies: string[];
  current: boolean;
  type: 'work' | 'education';
  logoUrl?: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn?: string;
  technologies: string[];
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'video' | 'pdf' | 'zip';
  image: string;
  fileUrl: string;
  createdAt?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  image: string;
  pdfUrl: string;
  category?: string;
  createdAt?: string;
}
