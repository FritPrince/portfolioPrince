'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useSpring as useReactSpring, animated, config } from '@react-spring/web';
import { useTheme } from 'next-themes';
import * as Icon from '@/components/ui/icons';
import { gsap } from 'gsap';

/* ─── Contact info ──────────────────────────────────────────── */
const CONTACT_CHANNELS = [
  {
    label: 'Email',
    value: 'princeonilou@gmail.com',
    href: 'mailto:princeonilou@gmail.com',
    icon: <Icon.Mail size={18} />,
    accent: '#3B82F6',
  },
  {
    label: 'GitHub',
    value: '@FritPrince',
    href: 'https://github.com/FritPrince',
    icon: <Icon.GitHub size={18} />,
    accent: '#6366F1',
  },
  {
    label: 'LinkedIn',
    value: 'Prince Aïneel ONILOU',
    href: '#',
    icon: <Icon.LinkedIn size={18} />,
    accent: '#0EA5E9',
  },
  {
    label: 'WhatsApp',
    value: 'Disponible',
    href: 'https://wa.me/22900000000',
    icon: <Icon.WhatsApp size={18} />,
    accent: '#10B981',
  },
];

/* ─── Form field ────────────────────────────────────────────── */
function Field({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  multiline = false,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const borderSpring = useSpring(focused || hasValue ? 1 : 0);
  const borderColor = useTransform(
    borderSpring,
    [0, 1],
    [isLight ? 'rgba(24,23,27,0.10)' : 'rgba(255,255,255,0.06)', 'rgba(59,130,246,0.5)']
  );

  const commonProps = {
    name,
    value,
    placeholder,
    required,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: 'w-full bg-transparent font-inter text-sm outline-none resize-none',
    style: { color: 'var(--oc-80)', ...(multiline ? { minHeight: 120 } : {}) } as React.CSSProperties,
  };

  return (
    <div className="group">
      <label className="block label-sm mb-2" style={{ color: 'var(--oc-25)' }}>{label}</label>
      <motion.div
        className="px-4 py-3 rounded-xl relative"
        style={{
          background: 'var(--oc-02)',
          border: '1px solid',
          borderColor,
        }}
      >
        {multiline ? (
          <textarea
            {...commonProps}
            rows={5}
            onChange={e => onChange(e.target.value)}
            style={{ ...commonProps.style, minHeight: 120 }}
          />
        ) : (
          <input
            {...commonProps}
            type={type}
            onChange={e => onChange(e.target.value)}
            style={{ ...commonProps.style, minHeight: undefined }}
          />
        )}

        {/* Focus glow */}
        <AnimatePresence>
          {focused && (
            <motion.div
              className="absolute -inset-px rounded-xl pointer-events-none"
              style={{ boxShadow: '0 0 20px rgba(59,130,246,0.12)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Success animation ─────────────────────────────────────── */
function SuccessState({ onReset }: { onReset: () => void }) {
  const [checkSpring] = useReactSpring(() => ({
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { ...config.wobbly, tension: 200, friction: 12 },
    delay: 100,
  }));

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <animated.div
        style={{ ...checkSpring, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
      >
        <Icon.Check size={32} strokeWidth={1.5} />
      </animated.div>

      <h3 className="display-md mb-3" style={{ color: 'var(--txt)' }}>Bien reçu.</h3>
      <p className="font-inter text-sm mb-3 max-w-sm" style={{ color: 'var(--oc-40)' }}>
        Je vous réponds sous 24h. En attendant, jetez un œil à mes projets.
      </p>
      <p className="hand-note mb-8" style={{ fontSize: '1.25rem' }}>
        c&apos;est moi qui lis, pas un robot
      </p>

      <div className="flex gap-3">
        <motion.a
          href="/projects"
          className="px-5 py-2.5 rounded-full text-sm"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
          whileHover={{ scale: 1.04 }}
        >
          Voir mes projets
        </motion.a>
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-full text-sm transition-colors" style={{ color: 'var(--oc-30)' }}
        >
          Nouveau message
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const set = (key: keyof typeof form) => (v: string) =>
    setForm(prev => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        alert(data.error ?? 'Erreur lors de l\'envoi.');
      }
    } catch {
      alert('Erreur réseau. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', subject: '', message: '' });
    setSent(false);
  };

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Header éditorial ────────────────────────────────────── */}
      <section className="px-6 md:px-14 pt-36 pb-14" style={{ borderBottom: '1px solid var(--line)' }}>
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="label-sm" style={{ color: 'var(--txt-muted)' }}>Contact</span>
        </motion.div>

        <motion.h1
          className="font-display font-semibold mb-8"
          style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Transformons <span className="marker">votre idée</span>.
        </motion.h1>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#3BA55D', boxShadow: '0 0 8px rgba(59,165,93,0.5)' }}
          />
          <span className="label-sm" style={{ color: 'var(--txt-muted)' }}>Disponible pour nouveaux projets — réponse sous 24h</span>
        </motion.div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[60vh]">

        {/* Left — channels */}
        <div
          className="lg:col-span-2 px-8 md:px-16 py-16 border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: 'var(--line)' }}
        >
          <motion.p
            className="label-sm mb-8" style={{ color: 'var(--oc-25)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Canaux de contact
          </motion.p>

          <div className="space-y-5">
            {CONTACT_CHANNELS.map((ch, i) => (
              <motion.a
                key={ch.label}
                href={ch.href}
                target={ch.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-4 border-b"
                style={{ borderColor: 'var(--line)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                whileHover={{ x: 4 }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-colors duration-300"
                  style={{
                    background: `${ch.accent}12`,
                    border: `1px solid ${ch.accent}20`,
                    color: ch.accent,
                  }}
                >
                  {ch.icon}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="label-sm mb-0.5" style={{ color: 'var(--oc-25)' }}>{ch.label}</p>
                  <p className="font-inter text-sm transition-colors" style={{ color: 'var(--oc-60)' }}>
                    {ch.value}
                  </p>
                </div>

                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: ch.accent }}
                >
                  <Icon.ArrowRight size={14} />
                </span>
              </motion.a>
            ))}
          </div>

          {/* Location */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="label-sm mb-3" style={{ color: 'var(--oc-20)' }}>Localisation</p>
            <p className="font-inter text-sm flex items-center gap-1.5" style={{ color: 'var(--oc-50)' }}><Icon.MapPin size={13} />Cotonou, Bénin</p>
            <p className="label-sm mt-1" style={{ color: 'var(--oc-20)' }}>GMT+1 · Réponse sous 24h</p>
          </motion.div>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-3 px-8 md:px-16 py-16">
          <AnimatePresence mode="wait">
            {sent ? (
              <SuccessState key="success" onReset={resetForm} />
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.p
                  className="label-sm mb-8" style={{ color: 'var(--oc-25)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Envoyez un message
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Field
                      label="Votre nom"
                      name="name"
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={set('name')}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="jean@exemple.com"
                      value={form.email}
                      onChange={set('email')}
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Field
                    label="Sujet"
                    name="subject"
                    placeholder="Développement d'une application mobile"
                    value={form.subject}
                    onChange={set('subject')}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Field
                    label="Message"
                    name="message"
                    placeholder="Décrivez votre projet, vos besoins, votre budget estimé..."
                    value={form.message}
                    onChange={set('message')}
                    multiline
                    required
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.button
                    ref={btnRef}
                    type="submit"
                    disabled={sending}
                    className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-medium"
                    style={{
                      background: sending ? 'rgba(179,54,43,0.55)' : 'var(--felt)',
                      color: '#FDF9EF',
                      cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                    whileHover={sending ? {} : { scale: 1.04, boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}
                    whileTap={sending ? {} : { scale: 0.97 }}
                  >
                    <AnimatePresence mode="wait">
                      {sending ? (
                        <motion.div
                          key="spinner"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="inline-flex"
                          >
                            <Icon.Spinner size={16} />
                          </motion.span>
                          Envoi en cours…
                        </motion.div>
                      ) : (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <span className="flex items-center gap-2">Envoyer le message <Icon.ArrowRight size={14} /></span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

    </main>
  );
}
