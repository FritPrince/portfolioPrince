'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icon from '@/components/ui/icons';

/* ─── CodeGate — la porte à code d'un projet protégé ──────────
   S'ouvre quand on veut voir un projet verrouillé. Vérifie le
   code côté serveur (/api/projects/[id]/unlock) et ouvre l'URL
   de démo uniquement en cas de succès. */
export function CodeGate({
  projectId,
  projectTitle,
  open,
  onClose,
}: {
  projectId: string;
  projectTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const [code, setCode] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCode('');
      setState('idle');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || state === 'checking') return;
    setState('checking');
    try {
      const res = await fetch(`/api/projects/${projectId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.ok && data.demoUrl) {
        window.open(data.demoUrl, '_blank', 'noopener,noreferrer');
        onClose();
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center px-6"
          style={{ background: 'rgba(15,13,10,0.6)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Accès protégé — ${projectTitle}`}
            className="w-full max-w-md rounded-3xl p-8 md:p-10"
            style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="label-sm flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                <Icon.Lock size={12} /> Accès protégé
              </span>
              <button onClick={onClose} aria-label="Fermer" className="transition-opacity hover:opacity-60" style={{ color: 'var(--txt-muted)' }}>
                <Icon.Close size={18} />
              </button>
            </div>

            <h3 className="font-display font-semibold text-2xl mb-2">{projectTitle}</h3>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
              Ce projet est privé. Entrez le code d&apos;accès qui vous a été communiqué pour ouvrir le site.
            </p>

            <form onSubmit={submit}>
              <motion.div
                animate={state === 'error' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <input
                  ref={inputRef}
                  type="password"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); if (state === 'error') setState('idle'); }}
                  placeholder="Code d'accès"
                  autoComplete="off"
                  className="w-full rounded-xl px-4 py-3.5 font-mono text-base tracking-widest outline-none transition-colors"
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${state === 'error' ? '#C0392B' : 'var(--line)'}`,
                    color: 'var(--txt)',
                  }}
                />
              </motion.div>

              {state === 'error' && (
                <p className="text-xs mt-2" style={{ color: '#C0392B' }}>
                  Code incorrect — vérifiez auprès de la personne qui vous l&apos;a transmis.
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'checking' || !code.trim()}
                className="btn-pill btn-pill-solid w-full justify-center mt-5"
                style={{ opacity: state === 'checking' || !code.trim() ? 0.6 : 1 }}
              >
                {state === 'checking' ? 'Vérification…' : 'Déverrouiller'}
                {state !== 'checking' && <Icon.ArrowRight size={14} />}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
