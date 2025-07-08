'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Sparkles, MessageCircle, Zap } from 'lucide-react';

export function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Message envoyé !',
          description: 'Votre message a été envoyé avec succès. Je vous répondrai bientôt.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi du message.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'aprinceaineel@gmail.com',
      href: 'mailto:aprinceaineel@gmail.com',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+229 0199128438',
      href: 'tel:+229 0142124499',
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50'
    },
    {
      icon: MapPin,
      label: 'Localisation',
      value: 'Bénin',
      href: '#',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background avec dégradé animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 animate-gradient" />
      
      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full animate-float blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full animate-float blur-2xl" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-pulse-glow">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gradient">Restons en Contact</span>
              <Zap className="h-4 w-4 text-purple-500" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-gradient animate-gradient">Contactez-moi</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vous avez un projet en tête ? N'hésitez pas à me contacter pour en discuter
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8 animate-slide-up">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  <span className="text-gradient">Informations de contact</span>
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div 
                      key={info.label} 
                      className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${info.bgGradient} hover-lift transition-all duration-300 animate-bounce-in`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className={`p-3 bg-gradient-to-r ${info.gradient} rounded-xl text-white animate-pulse-glow`}>
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{info.label}</p>
                        <a
                          href={info.href}
                          className="text-gray-600 hover:text-gradient transition-colors duration-300"
                        >
                          {info.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-fade-in-scale" style={{ animationDelay: '0.6s' }}>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  <span className="text-gradient">Disponibilité</span>
                </h3>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-teal-50 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-800">Disponible pour nouveaux projets</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Je suis actuellement disponible pour de nouveaux projets. 
                    N'hésitez pas à me contacter pour discuter de vos besoins et 
                    voir comment je peux vous aider à concrétiser vos idées.
                  </p>
                </div>
              </div>
            </div>

            <Card className="shadow-2xl hover-lift transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 animate-slide-up">
              <CardHeader className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg"></div>
                <CardTitle className="text-2xl text-gray-900 relative z-10">
                  <span className="text-gradient">Envoyez-moi un message</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="name" className="text-gray-700 font-medium">Nom</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        className="border-2 border-gray-200 focus:border-blue-400 transition-colors duration-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                        className="border-2 border-gray-200 focus:border-blue-400 transition-colors duration-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">Sujet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      required
                      className="border-2 border-gray-200 focus:border-blue-400 transition-colors duration-300 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
                    <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      rows={5}
                      required
                      className="border-2 border-gray-200 focus:border-blue-400 transition-colors duration-300 rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl border-0 hover-lift animate-pulse-glow animate-fade-in-scale"
                    style={{ animationDelay: '0.5s' }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Envoyer le message
                        <Sparkles className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}