'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Project, ContactMessage } from '@/types';
import { Plus, Edit, Trash2, Eye, Mail } from 'lucide-react';

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
    category: 'frontend',
    featured: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()),
      };

      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        toast({
          title: editingProject ? 'Projet modifié' : 'Projet créé',
          description: `Le projet a été ${editingProject ? 'modifié' : 'créé'} avec succès.`,
        });
        
        setFormData({
          title: '',
          description: '',
          image: '',
          technologies: '',
          githubUrl: '',
          demoUrl: '',
          category: 'frontend',
          featured: false,
        });
        setShowAddForm(false);
        setEditingProject(null);
        fetchProjects();
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'opération.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      category: project.category,
      featured: project.featured,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast({
            title: 'Projet supprimé',
            description: 'Le projet a été supprimé avec succès.',
          });
          fetchProjects();
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression.',
          variant: 'destructive',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interface Admin</h1>
          <p className="text-gray-600">Gérez vos projets et messages de contact</p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-600">Total Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-600">Messages Reçus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{messages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-600">Projets Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {projects.filter(p => p.featured).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projets */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des Projets</CardTitle>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un projet
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  {editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="fullstack">Fullstack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="image">URL de l'image</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
                    <Input
                      id="technologies"
                      value={formData.technologies}
                      onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                      placeholder="React, Node.js, MongoDB"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="githubUrl">URL GitHub</Label>
                    <Input
                      id="githubUrl"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="demoUrl">URL Demo</Label>
                    <Input
                      id="demoUrl"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked as boolean})}
                  />
                  <Label htmlFor="featured">Projet mis en avant</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingProject ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProject(null);
                      setFormData({
                        title: '',
                        description: '',
                        image: '',
                        technologies: '',
                        githubUrl: '',
                        demoUrl: '',
                        category: 'frontend',
                        featured: false,
                      });
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <Badge variant="secondary">{project.category}</Badge>
                        {project.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Messages de Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun message reçu pour le moment.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{message.subject}</h3>
                        <p className="text-sm text-gray-600">
                          De: {message.name} ({message.email})
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}