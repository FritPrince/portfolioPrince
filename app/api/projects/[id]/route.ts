import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/lib/data';
import { Project } from '@/types';

// Simuler une base de données en mémoire
let projectsData: Project[] = [...projects];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = projectsData.find((p) => p.id === params.id);
  
  if (!project) {
    return NextResponse.json(
      { error: 'Projet non trouvé' },
      { status: 404 }
    );
  }

  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const projectIndex = projectsData.findIndex((p) => p.id === params.id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le projet
    projectsData[projectIndex] = {
      ...projectsData[projectIndex],
      ...body,
    };

    return NextResponse.json(
      { message: 'Projet mis à jour avec succès', project: projectsData[projectIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectIndex = projectsData.findIndex((p) => p.id === params.id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le projet
    projectsData.splice(projectIndex, 1);

    return NextResponse.json(
      { message: 'Projet supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}