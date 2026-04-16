'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        toast({ title: t('contact.success_title'), description: t('contact.success_desc') });
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: t('contact.error_title'), description: t('contact.error_desc'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const infos = [
    { icon: Mail, label: t('contact.email_label'), value: 'aprinceaineel@gmail.com', href: 'mailto:aprinceaineel@gmail.com' },
    { icon: Phone, label: t('contact.phone_label'), value: '+229 01 99 12 84 38', href: 'tel:+22901991284' },
    { icon: MapPin, label: t('contact.location_label'), value: 'Bénin, Afrique de l\'Ouest', href: '#' },
  ];

  return (
    <section id="contact" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30 dark:bg-secondary/10" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] orb-blue opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 text-center section-hidden ${visible ? 'section-visible' : ''}`}>
          <p className="font-inter text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
            {t('contact.label')}
          </p>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('contact.title')}
          </h2>
          <p className="font-inter text-muted-foreground max-w-md mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Left — info */}
          <div
            className={`lg:col-span-2 space-y-6 section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.15s' }}
          >
            {/* Availability badge */}
            <div className="p-4 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
              <p className="font-inter text-sm font-medium text-green-600 dark:text-green-400">
                {t('contact.available')}
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {infos.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-500/30 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors duration-200">
                    <info.icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-inter text-xs text-muted-foreground">{info.label}</p>
                    <p className="font-inter text-sm font-medium text-foreground group-hover:text-blue-500 transition-colors duration-200">
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div
            className={`lg:col-span-3 section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="p-8 rounded-2xl border border-border bg-card">
              <h3 className="font-space font-semibold text-foreground mb-6">
                {t('contact.form_title')}
              </h3>

              {success ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="font-space font-semibold text-foreground">
                    {t('contact.success_title')}
                  </p>
                  <p className="font-inter text-sm text-muted-foreground">
                    {t('contact.success_desc')}
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-inter text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                        {t('contact.name')}
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder={t('contact.name_ph')}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-inter text-sm placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="font-inter text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                        {t('contact.email')}
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder={t('contact.email_ph')}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-inter text-sm placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-inter text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      {t('contact.subject')}
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={onChange}
                      placeholder={t('contact.subject_ph')}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-inter text-sm placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="font-inter text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      {t('contact.message')}
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      placeholder={t('contact.message_ph')}
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-inter text-sm placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-glow w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold font-inter text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t('contact.send')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
