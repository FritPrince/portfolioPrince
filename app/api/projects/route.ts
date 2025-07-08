import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/lib/data';
import { Project } from '@/types';

// Simuler une base de données en mémoire
let projectsData: Project[] = [...projects];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  let filteredProjects = projectsData;

  if (category && category !== 'all') {
    filteredProjects = filteredProjects.filter(
      (project) => project.category === category
    );
  }

  if (featured === 'true') {
    filteredProjects = filteredProjects.filter(
      (project) => project.featured
    );
  }

  return NextResponse.json(filteredProjects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, technologies, githubUrl, demoUrl, category, featured } = body;

    // Validation basique
    if (!title || !description || !technologies || !githubUrl || !category) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Créer le nouveau projet
    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      image: image || 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies,
      githubUrl,
      demoUrl: demoUrl || '#',
      category,
      featured: featured || false,
    };

    // Ajouter à la "base de données"
    projectsData.push(newProject);

    return NextResponse.json(
      { message: 'Projet créé avec succès', project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}