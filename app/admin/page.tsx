'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Project } from '@/types';
import * as Icon from '@/components/ui/icons';
import { InlineLoader } from '@/components/ui/lottie-loader';
import { createBrowserSupabase } from '@/lib/supabase-browser';

/* ─── Types ─────────────────────────────────────────────────── */
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

type Tab = 'dashboard' | 'projects' | 'experiences' | 'services' | 'skills' | 'messages' | 'formations' | 'ideas' | 'settings';

interface Formation {
  id: string; title: string; description: string; price: number;
  type: 'video' | 'pdf' | 'zip'; image: string; fileUrl: string; createdAt?: string;
}
interface Idea {
  id: string; title: string; description: string; image: string;
  pdfUrl: string; category?: string; createdAt?: string;
}

interface Experience {
  id: string; company: string; role: string; roleEn?: string;
  period: string; location?: string; description: string;
  descriptionEn?: string; technologies: string[];
  current: boolean; type: string; sortOrder?: number; logoUrl?: string;
}
interface Service {
  id: string; icon?: string; title: string; titleEn?: string;
  description: string; descriptionEn?: string;
  technologies: string[]; sortOrder?: number;
}
interface Skill { id?: string; name: string; category: string; sortOrder?: number; }

/* ─── Media upload zone ──────────────────────────────────────── */
function UploadZone({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [errMsg,    setErrMsg]    = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setProgress(10);
    setErrMsg('');

    const fd = new FormData();
    fd.append('file', file);

    try {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 15, 85));
      }, 200);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload échoué');
      }
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Upload échoué');
      setProgress(0);
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0); }, 600);
    }
  }, [onChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const isVideo = value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.ogg'));
  const isPDF   = value && value.endsWith('.pdf');

  return (
    <div>
      {/* Preview */}
      {value && (
        <div className="relative mb-3 rounded-xl overflow-hidden" style={{ height: isPDF ? 'auto' : 180 }}>
          {isPDF ? (
            <div className="flex items-center gap-3 px-4 py-4" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--oc-40)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="label-sm text-white/50 truncate flex-1">{value.split('/').pop()}</span>
            </div>
          ) : isVideo ? (
            <video src={value} className="w-full h-full object-cover" muted loop autoPlay />
          ) : (
            <Image src={value} alt="preview" fill className="object-cover" sizes="400px" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-end p-3">
            <p className="label-sm text-white/60 truncate flex-1">{value}</p>
            <button
              type="button"
              onClick={() => onChange('')}
              className="ml-2 text-white/50 hover:text-white transition-colors"
            >
              <Icon.Close size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300"
        style={{
          borderColor: dragging ? 'rgba(99,102,241,0.6)' : 'var(--line)',
          background: dragging ? 'rgba(99,102,241,0.05)' : 'var(--oc-02)',
          minHeight: 120,
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3 w-full px-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Icon.Spinner size={20} style={{ color: '#6366F1' }} />
            </motion.div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 2, background: '#1e1e1e' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#6366F1' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="label-sm text-white/30">{progress}%</p>
          </div>
        ) : (
          <>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-inter text-sm text-white/50">
                Glisser un fichier ici
              </p>
              <p className="label-sm text-white/20 mt-1">image · vidéo · pdf · Max 50 MB</p>
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {errMsg && (
        <p className="mt-2 label-sm flex items-center gap-1.5" style={{ color: '#EF4444' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errMsg}
        </p>
      )}

      {/* URL fallback */}
      <div className="mt-2">
        <input
          type="text"
          placeholder="ou coller une URL externe..."
          value={value}
          onChange={e => { onChange(e.target.value); setErrMsg(''); }}
          className="w-full bg-transparent font-inter text-xs text-foreground/40 placeholder:text-white/15 outline-none border-b py-2"
          style={{ borderColor: 'var(--line)' }}
        />
      </div>
    </div>
  );
}

/* ─── Gallery upload (multi-images) ─────────────────────────── */
function GalleryUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) return null;
      const data = await res.json();
      return data.url as string;
    } catch { return null; }
  }, []);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const results = await Promise.all(Array.from(files).map(uploadFile));
    const urls = results.filter(Boolean) as string[];
    onChange([...value, ...urls]);
    setUploading(false);
  };

  const remove = (i: number) => {
    const next = [...value];
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group aspect-video rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <Image src={url} alt={`Screenshot ${i + 1}`} fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.7)' }}
              >
                <Icon.Close size={9} style={{ color: '#fff' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      <div
        className="relative rounded-xl border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 py-5"
        style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }}
        />
        {uploading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Icon.Spinner size={16} style={{ color: '#6366F1' }} />
          </motion.div>
        ) : (
          <>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <span className="font-inter text-sm text-white/35">Ajouter des captures d'écran</span>
            <span className="label-sm text-white/15">multiple · jpg, png, webp</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Form field ─────────────────────────────────────────────── */
function Field({
  label, required, children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block label-sm text-white/30 mb-2">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border font-inter text-sm text-white/70 placeholder:text-white/15 outline-none transition-colors focus:border-indigo-500/50";
const inputStyle = { borderColor: 'var(--line)' };

/* ─── Project form ───────────────────────────────────────────── */
function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<Project> | null;
  onSave: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    image: initial?.image ?? '',
    gallery: initial?.gallery ?? [] as string[],
    technologies: initial?.technologies?.join(', ') ?? '',
    githubUrl: initial?.githubUrl ?? '',
    demoUrl: initial?.demoUrl ?? '',
    category: initial?.category ?? 'frontend',
    featured: initial?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      gallery: form.gallery,
    });
    setSaving(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 space-y-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-space text-sm font-semibold text-white/70">
          {initial?.id ? 'Modifier le projet' : 'Nouveau projet'}
        </h3>
        <button type="button" onClick={onCancel} className="text-white/30 hover:text-white transition-colors">
          <Icon.Close size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Titre" required>
          <input
            required
            value={form.title}
            onChange={e => set('title')(e.target.value)}
            placeholder="Nom du projet"
            className={inputCls}
            style={inputStyle}
          />
        </Field>

        <Field label="Catégorie" required>
          <select
            value={form.category}
            onChange={e => set('category')(e.target.value)}
            className={inputCls}
            style={{ ...inputStyle, appearance: 'none' }}
          >
            <option value="frontend">Frontend</option>
            <option value="fullstack">Full Stack</option>
            <option value="mobile">Mobile</option>
          </select>
        </Field>
      </div>

      <Field label="Description" required>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={e => set('description')(e.target.value)}
          placeholder="Description courte du projet..."
          className={inputCls + ' resize-none'}
          style={inputStyle}
        />
      </Field>

      <Field label="Image de couverture">
        <UploadZone value={form.image} onChange={v => set('image')(v)} />
      </Field>

      <Field label="Galerie de captures d'écran">
        <GalleryUpload
          value={form.gallery}
          onChange={(urls) => setForm(p => ({ ...p, gallery: urls }))}
        />
      </Field>

      <Field label="Technologies (séparées par des virgules)" required>
        <input
          required
          value={form.technologies}
          onChange={e => set('technologies')(e.target.value)}
          placeholder="React, Node.js, MongoDB..."
          className={inputCls}
          style={inputStyle}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Lien GitHub">
          <input
            value={form.githubUrl}
            onChange={e => set('githubUrl')(e.target.value)}
            placeholder="https://github.com/..."
            className={inputCls}
            style={inputStyle}
          />
        </Field>

        <Field label="Lien démo">
          <input
            value={form.demoUrl}
            onChange={e => set('demoUrl')(e.target.value)}
            placeholder="https://..."
            className={inputCls}
            style={inputStyle}
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          className="w-10 h-5 rounded-full relative transition-colors duration-300"
          style={{ background: form.featured ? '#6366F1' : '#1e1e1e' }}
          onClick={() => set('featured')(!form.featured)}
        >
          <motion.div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
            animate={{ left: form.featured ? 22 : 2 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <span className="font-inter text-sm text-white/50">Marquer comme featured</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
          style={{ background: '#6366F1', color: '#fff', opacity: saving ? 0.7 : 1 }}
          whileHover={saving ? {} : { scale: 1.03 }}
          whileTap={saving ? {} : { scale: 0.97 }}
        >
          {saving ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex">
              <Icon.Spinner size={14} />
            </motion.span>
          ) : (
            <Icon.Check size={14} />
          )}
          {initial?.id ? 'Enregistrer' : 'Créer le projet'}
        </motion.button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full text-sm text-white/30 hover:text-white/60 transition-colors"
        >
          Annuler
        </button>
      </div>
    </motion.form>
  );
}

/* ─── Project row ────────────────────────────────────────────── */
function ProjectRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isVideo = project.image && (
    project.image.endsWith('.mp4') ||
    project.image.endsWith('.webm')
  );

  return (
    <motion.div
      layout
      className="flex items-center gap-4 p-4 rounded-xl group"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      whileHover={{ borderColor: 'var(--txt-muted)' }}
    >
      {/* Thumbnail */}
      <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 relative" style={{ background: 'var(--surface)' }}>
        {project.image ? (
          isVideo ? (
            <video src={project.image} className="w-full h-full object-cover" muted />
          ) : (
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="56px" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <Icon.Globe size={16} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-space text-sm font-semibold text-white/70 truncate">{project.title}</p>
          {project.featured && (
            <span className="label-sm px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)' }}>
              featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="label-sm text-white/20 capitalize">{project.category}</span>
          <span className="label-sm text-white/15">{project.technologies.slice(0, 3).join(' · ')}</span>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
            style={{ background: 'var(--oc-04)' }}
          >
            <Icon.ExternalLink size={12} />
          </a>
        )}
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-indigo-400 transition-colors"
          style={{ background: 'var(--oc-04)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
          style={{ background: 'var(--oc-04)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Message card ───────────────────────────────────────────── */
function MessageCard({ msg }: { msg: ContactMessage }) {
  const [expanded, setExpanded] = useState(false);
  const date = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

  return (
    <motion.div
      layout
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
      whileHover={{ borderColor: 'var(--txt-muted)' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-space text-xs font-bold"
          style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}
        >
          {msg.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-space text-sm font-semibold text-white/70 truncate">{msg.name}</p>
            <span className="label-sm text-white/20 flex-shrink-0">{date}</span>
          </div>
          <p className="label-sm text-white/30 truncate">{msg.subject}</p>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/20 flex-shrink-0"
        >
          <Icon.ArrowRight size={14} />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <p className="font-inter text-sm text-white/50 leading-relaxed">{msg.message}</p>
              <a
                href={`mailto:${msg.email}`}
                className="inline-flex items-center gap-2 label-sm px-3 py-1.5 rounded-full transition-colors"
                style={{ color: '#3B82F6', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                onClick={e => e.stopPropagation()}
              >
                <Icon.Mail size={12} />
                Répondre à {msg.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Experience form (with logo upload) ────────────────────── */
function ExperienceForm({ onSave }: { onSave: (d: Record<string, unknown>) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState('');
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...form,
      logoUrl: logo,
      technologies: form.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean) ?? [],
      current: false,
    });
    setForm({});
    setLogo('');
    setOpen(false);
    setSaving(false);
  };

  const FIELDS = [
    { key: 'company',     label: 'Entreprise',          required: true },
    { key: 'role',        label: 'Poste (FR)',            required: true },
    { key: 'period',      label: 'Période',               required: true, placeholder: 'Jan 2024 — Présent' },
    { key: 'location',    label: 'Lieu' },
    { key: 'description', label: 'Description (FR)',      multiline: true, required: true },
    { key: 'technologies',label: 'Technologies (virgules)' },
    { key: 'type',        label: 'Type', select: ['work', 'education'] },
  ] as const;

  return (
    <div>
      {!open ? (
        <motion.button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium" style={{ background: '#6366F1', color: '#fff' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </motion.button>
      ) : (
        <motion.div className="rounded-2xl p-5 mb-6 space-y-4 w-full max-w-lg" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {/* Logo upload */}
          <div>
            <label className="block label-sm text-white/25 mb-2">Logo entreprise</label>
            <div className="flex items-center gap-3">
              {logo && (
                <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 border" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
                  <Image src={logo} alt="logo" fill className="object-contain p-1.5" sizes="48px" />
                </div>
              )}
              <UploadZone value={logo} onChange={setLogo} />
            </div>
          </div>

          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="block label-sm text-white/25 mb-1.5">{f.label}{'required' in f && f.required && <span className="text-red-400 ml-1">*</span>}</label>
              {'select' in f && f.select ? (
                <select value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border font-inter text-sm text-white/70 outline-none" style={{ borderColor: 'var(--line)', appearance: 'none' }}>
                  <option value="">Choisir...</option>
                  {f.select.map((o: string) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : 'multiline' in f && f.multiline ? (
                <textarea rows={3} value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={('placeholder' in f ? f.placeholder : undefined) as string | undefined} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border font-inter text-sm text-white/70 placeholder:text-white/15 outline-none resize-none" style={{ borderColor: 'var(--line)' }} />
              ) : (
                <input value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={('placeholder' in f ? f.placeholder : undefined) as string | undefined} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border font-inter text-sm text-white/70 placeholder:text-white/15 outline-none" style={{ borderColor: 'var(--line)' }} />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: '#6366F1', color: '#fff' }}>
              {saving ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex"><Icon.Spinner size={12} /></motion.span> : <Icon.Check size={12} />}
              Enregistrer
            </button>
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-full text-sm text-white/30 hover:text-white/60 transition-colors">Annuler</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────── */
const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: <Icon.Grid size={16} /> },
  { id: 'projects',    label: 'Projets',      icon: <Icon.Layers size={16} /> },
  { id: 'experiences', label: 'Expériences',  icon: <Icon.BookOpen size={16} /> },
  { id: 'services',    label: 'Services',     icon: <Icon.Tool size={16} /> },
  { id: 'skills',      label: 'Skills',       icon: <Icon.Cpu size={16} /> },
  { id: 'formations',  label: 'Formations',   icon: <Icon.BookOpen size={16} /> },
  { id: 'ideas',       label: 'Idées',        icon: <Icon.Layers size={16} /> },
  { id: 'messages',    label: 'Messages',     icon: <Icon.Mail size={16} /> },
  { id: 'settings',    label: 'Paramètres',   icon: <Icon.Monitor size={16} /> },
];

/* ─── Page ───────────────────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [projects,    setProjects]    = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [services,    setServices]    = useState<Service[]>([]);
  const [skills,      setSkills]      = useState<Skill[]>([]);
  const [messages,    setMessages]    = useState<ContactMessage[]>([]);
  const [formations,  setFormations]  = useState<Formation[]>([]);
  const [ideas,       setIdeas]       = useState<Idea[]>([]);
  const [settings,    setSettings]    = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<Project | null>(null);
  const { toast } = useToast();

  /* Load data */
  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()).catch(() => []),
      fetch('/api/experiences').then(r => r.json()).catch(() => []),
      fetch('/api/services').then(r => r.json()).catch(() => []),
      fetch('/api/skills').then(r => r.json()).catch(() => []),
      fetch('/api/contact').then(r => r.json()).catch(() => []),
      fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      fetch('/api/formations').then(r => r.json()).catch(() => []),
      fetch('/api/ideas').then(r => r.json()).catch(() => []),
    ]).then(([p, e, sv, sk, m, s, f, id]) => {
      setProjects(Array.isArray(p) ? p : []);
      setExperiences(Array.isArray(e) ? e : []);
      setServices(Array.isArray(sv) ? sv : []);
      setSkills(Array.isArray(sk) ? sk : []);
      setMessages(Array.isArray(m) ? m : []);
      setSettings(s && typeof s === 'object' ? s : {});
      setFormations(Array.isArray(f) ? f : []);
      setIdeas(Array.isArray(id) ? id : []);
    }).finally(() => setLoading(false));
  }, []);

  const saveProject = async (data: Partial<Project>) => {
    const url = editing ? `/api/projects/${editing.id}` : '/api/projects';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await fetch('/api/projects').then(r => r.json());
      setProjects(updated);
      setShowForm(false);
      setEditing(null);
      toast({ title: editing ? 'Projet modifié' : 'Projet créé', description: 'Sauvegardé avec succès.' });
    } else {
      toast({ title: 'Erreur', variant: 'destructive', description: 'Impossible de sauvegarder.' });
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Projet supprimé' });
    }
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  /* Stats */
  const stats = [
    { label: 'Projets',   value: projects.length,                        color: '#6366F1' },
    { label: 'Featured',  value: projects.filter(p => p.featured).length, color: '#F59E0B' },
    { label: 'En ligne',  value: projects.filter(p => p.demoUrl).length,  color: '#10B981' },
    { label: 'Messages',  value: messages.length,                         color: '#3B82F6' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col border-r sticky top-0 h-screen"
        style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
      >
        {/* Logo */}
        <div className="px-6 py-7 border-b" style={{ borderColor: 'var(--line)' }}>
          <span className="font-space text-sm font-semibold text-foreground/40">
            prince<span style={{ color: '#6366F1' }}>.</span>admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
              style={{
                color: tab === item.id ? '#6366F1' : 'var(--oc-30)',
                background: tab === item.id ? 'rgba(99,102,241,0.10)' : 'transparent',
              }}
            >
              <span style={{ color: tab === item.id ? '#6366F1' : 'var(--oc-25)' }}>
                {item.icon}
              </span>
              <span className="font-inter text-sm">{item.label}</span>
              {item.id === 'messages' && messages.length > 0 && (
                <span
                  className="ml-auto font-space text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#3B82F6', color: '#fff' }}
                >
                  {messages.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t space-y-3" style={{ borderColor: 'var(--line)' }}>
          <a href="/" className="flex items-center gap-2 label-sm text-white/25 hover:text-white/50 transition-colors">
            <Icon.ArrowLeft size={12} />
            Voir le site
          </a>
          <button
            onClick={async () => {
              const supabase = createBrowserSupabase();
              await supabase.auth.signOut();
              router.replace('/admin/login');
            }}
            className="flex items-center gap-2 label-sm text-white/20 hover:text-red-400 transition-colors w-full"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto px-8 py-10 max-w-5xl">

        {loading ? (
          <InlineLoader size="lg" className="h-64" />
        ) : (
          <AnimatePresence mode="wait">

            {/* ── Dashboard ─────────────────────────────────────── */}
            {tab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <p className="label-sm text-white/20 mb-2">Vue d'ensemble</p>
                  <h1 className="display-md text-white">Dashboard</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="p-5 rounded-2xl"
                      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
                    >
                      <p className="font-space text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                      <p className="label-sm text-white/25">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent projects */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="label-sm text-white/25">Derniers projets</p>
                    <button
                      onClick={() => setTab('projects')}
                      className="label-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                    >
                      Voir tout <Icon.ArrowRight size={11} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projects.slice(0, 4).map(p => (
                      <ProjectRow
                        key={p.id}
                        project={p}
                        onEdit={() => { openEdit(p); setTab('projects'); }}
                        onDelete={() => deleteProject(p.id)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Projects ──────────────────────────────────────── */}
            {tab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="label-sm text-white/20 mb-2">Gestion</p>
                    <h1 className="display-md text-white">Projets</h1>
                  </div>
                  {!showForm && (
                    <motion.button
                      onClick={() => { setEditing(null); setShowForm(true); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
                      style={{ background: '#6366F1', color: '#fff' }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Nouveau projet
                    </motion.button>
                  )}
                </div>

                {/* Form */}
                <AnimatePresence>
                  {showForm && (
                    <div className="mb-6">
                      <ProjectForm
                        initial={editing}
                        onSave={saveProject}
                        onCancel={cancelForm}
                      />
                    </div>
                  )}
                </AnimatePresence>

                {/* List */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {projects.map(p => (
                      <ProjectRow
                        key={p.id}
                        project={p}
                        onEdit={() => openEdit(p)}
                        onDelete={() => deleteProject(p.id)}
                      />
                    ))}
                  </AnimatePresence>
                  {projects.length === 0 && (
                    <div className="text-center py-20 text-white/15">
                      <Icon.Layers size={32} className="mx-auto mb-3" />
                      <p className="font-inter text-sm">Aucun projet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Messages ──────────────────────────────────────── */}
            {tab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <p className="label-sm text-white/20 mb-2">Boîte de réception</p>
                  <h1 className="display-md text-white">Messages</h1>
                </div>

                <div className="space-y-2">
                  {messages.map(msg => (
                    <MessageCard key={msg.id} msg={msg} />
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-20 text-white/15">
                      <Icon.Mail size={32} className="mx-auto mb-3" />
                      <p className="font-inter text-sm">Aucun message</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Experiences ───────────────────────────────────── */}
            {tab === 'experiences' && (
              <motion.div key="experiences" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="label-sm text-white/20 mb-2">Parcours</p>
                    <h1 className="display-md text-white">Expériences</h1>
                  </div>
                  <ExperienceForm
                    onSave={async (d) => {
                      const res = await fetch('/api/experiences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
                      if (res.ok) { const updated = await fetch('/api/experiences').then(r => r.json()); setExperiences(updated); toast({ title: 'Expérience ajoutée' }); }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {experiences.map(e => (
                    <SimpleRow key={e.id} title={e.role} subtitle={e.company} meta={e.period} badge={e.current ? 'actuel' : e.type}
                      onDelete={async () => { await fetch(`/api/experiences/${e.id}`, { method: 'DELETE' }); setExperiences(prev => prev.filter(x => x.id !== e.id)); toast({ title: 'Supprimé' }); }}
                    />
                  ))}
                  {!experiences.length && <EmptyState icon={<Icon.BookOpen size={28} />} text="Aucune expérience" />}
                </div>
              </motion.div>
            )}

            {/* ── Services ──────────────────────────────────────── */}
            {tab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="label-sm text-white/20 mb-2">Offres</p>
                    <h1 className="display-md text-white">Services</h1>
                  </div>
                  <SimpleEntityForm
                    fields={[
                      { key: 'title',        label: 'Titre (FR)',      required: true },
                      { key: 'description',  label: 'Description (FR)', multiline: true, required: true },
                      { key: 'technologies', label: 'Technologies (virgules)' },
                    ]}
                    onSave={async (d) => {
                      const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, technologies: d.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean) ?? [] }) });
                      if (res.ok) { const updated = await fetch('/api/services').then(r => r.json()); setServices(updated); toast({ title: 'Service ajouté' }); }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {services.map(s => (
                    <SimpleRow key={s.id} title={s.title} subtitle={s.description} meta={s.technologies.slice(0,3).join(' · ')}
                      onDelete={async () => { await fetch(`/api/services/${s.id}`, { method: 'DELETE' }); setServices(prev => prev.filter(x => x.id !== s.id)); toast({ title: 'Supprimé' }); }}
                    />
                  ))}
                  {!services.length && <EmptyState icon={<Icon.Tool size={28} />} text="Aucun service" />}
                </div>
              </motion.div>
            )}

            {/* ── Skills ────────────────────────────────────────── */}
            {tab === 'skills' && (
              <motion.div key="skills" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="label-sm text-white/20 mb-2">Stack</p>
                    <h1 className="display-md text-white">Skills</h1>
                  </div>
                  <SimpleEntityForm
                    fields={[
                      { key: 'name',     label: 'Nom',       required: true },
                      { key: 'category', label: 'Catégorie', required: true, select: ['frontend','backend','mobile','design','iot','tools'] },
                    ]}
                    onSave={async (d) => {
                      const res = await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
                      if (res.ok) { const updated = await fetch('/api/skills').then(r => r.json()); setSkills(updated); toast({ title: 'Skill ajouté' }); }
                    }}
                  />
                </div>
                {['frontend','backend','mobile','design','iot','tools'].map(cat => {
                  const catSkills = skills.filter(s => s.category === cat);
                  if (!catSkills.length) return null;
                  return (
                    <div key={cat} className="mb-6">
                      <p className="label-sm text-white/20 mb-3 capitalize">{cat}</p>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map(sk => (
                          <div key={sk.id ?? sk.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--oc-50)' }}>
                            {sk.name}
                            <button onClick={async () => { await fetch('/api/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: sk.id }) }); setSkills(prev => prev.filter(x => x.id !== sk.id)); }} className="text-white/20 hover:text-red-400 transition-colors ml-1">
                              <Icon.Close size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {!skills.length && <EmptyState icon={<Icon.Cpu size={28} />} text="Aucun skill" />}
              </motion.div>
            )}

            {/* ── Settings ──────────────────────────────────────── */}
            {tab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <p className="label-sm text-white/20 mb-2">Profil</p>
                  <h1 className="display-md text-white">Paramètres</h1>
                </div>

                <div className="space-y-8 max-w-lg">

                  {/* Profile photo */}
                  <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                    <div>
                      <p className="font-space text-sm font-semibold text-white/60 mb-1">Photo de profil</p>
                      <p className="label-sm text-white/25">Affichée dans la page About</p>
                    </div>
                    <UploadZone
                      value={settings.profile_photo ?? ''}
                      onChange={async (url) => {
                        await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'profile_photo', value: url }) });
                        setSettings(p => ({ ...p, profile_photo: url }));
                        toast({ title: 'Photo mise à jour' });
                      }}
                    />
                  </div>

                  {/* CV PDF */}
                  <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                    <div>
                      <p className="font-space text-sm font-semibold text-white/60 mb-1">CV (PDF)</p>
                      <p className="label-sm text-white/25">Lien de téléchargement dans la page About</p>
                    </div>
                    <div className="space-y-3">
                      {settings.cv_url && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--oc-40)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <a href={settings.cv_url} target="_blank" rel="noopener noreferrer" className="label-sm text-white/50 hover:text-white/80 transition-colors truncate flex-1">
                            {settings.cv_url.split('/').pop()}
                          </a>
                          <button onClick={async () => {
                            await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'cv_url', value: '' }) });
                            setSettings(p => ({ ...p, cv_url: '' }));
                            toast({ title: 'CV supprimé' });
                          }} className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0">
                            <Icon.Close size={12} />
                          </button>
                        </div>
                      )}
                      <UploadZone
                        value=""
                        onChange={async (url) => {
                          await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'cv_url', value: url }) });
                          setSettings(p => ({ ...p, cv_url: url }));
                          toast({ title: 'CV mis à jour' });
                        }}
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ── Formations ────────────────────────────────────── */}
            {tab === 'formations' && (
              <motion.div key="formations" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <p className="label-sm mb-2" style={{ color: 'var(--oc-20)' }}>Contenu payant</p>
                    <h1 className="display-md" style={{ color: 'var(--txt)' }}>Formations</h1>
                  </div>
                  <FormationForm onSave={async (data) => {
                    const res = await fetch('/api/formations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) {
                      const updated = await fetch('/api/formations').then(r => r.json());
                      setFormations(updated);
                      toast({ title: 'Formation créée' });
                    }
                  }} />
                </div>
                <div className="space-y-3">
                  {formations.length === 0 ? (
                    <EmptyState icon={<Icon.BookOpen size={28} style={{ color: 'var(--oc-10)' }} />} text="Aucune formation" />
                  ) : formations.map(f => (
                    <FormationRow key={f.id} formation={f}
                      onDelete={async () => {
                        if (!confirm('Supprimer cette formation ?')) return;
                        await fetch(`/api/formations/${f.id}`, { method: 'DELETE' });
                        setFormations(p => p.filter(x => x.id !== f.id));
                        toast({ title: 'Formation supprimée' });
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Ideas ─────────────────────────────────────────── */}
            {tab === 'ideas' && (
              <motion.div key="ideas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <p className="label-sm mb-2" style={{ color: 'var(--oc-20)' }}>Bibliothèque</p>
                    <h1 className="display-md" style={{ color: 'var(--txt)' }}>Idées de projets</h1>
                  </div>
                  <IdeaForm onSave={async (data) => {
                    const res = await fetch('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) {
                      const updated = await fetch('/api/ideas').then(r => r.json());
                      setIdeas(updated);
                      toast({ title: 'Idée créée' });
                    }
                  }} />
                </div>
                <div className="space-y-3">
                  {ideas.length === 0 ? (
                    <EmptyState icon={<Icon.Layers size={28} style={{ color: 'var(--oc-10)' }} />} text="Aucune idée" />
                  ) : ideas.map(idea => (
                    <IdeaRow key={idea.id} idea={idea}
                      onDelete={async () => {
                        if (!confirm('Supprimer cette idée ?')) return;
                        await fetch(`/api/ideas/${idea.id}`, { method: 'DELETE' });
                        setIdeas(p => p.filter(x => x.id !== idea.id));
                        toast({ title: 'Idée supprimée' });
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </main>

      <Toaster />
    </div>
  );
}

/* ─── Formation row ──────────────────────────────────────────── */
const TYPE_COLOR: Record<string, string> = { video: '#F59E0B', pdf: '#EF4444', zip: '#6366F1' };

function FormationRow({ formation, onDelete }: { formation: Formation; onDelete: () => void }) {
  const color = TYPE_COLOR[formation.type] ?? '#6366F1';
  return (
    <motion.div layout className="flex items-center gap-4 p-4 rounded-xl group" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }} whileHover={{ borderColor: 'var(--txt-muted)' }}>
      {formation.image && (
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
          <Image src={formation.image} alt={formation.title} fill className="object-cover" sizes="48px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-space text-sm font-semibold truncate" style={{ color: 'var(--txt)' }}>{formation.title}</p>
          <span className="label-sm px-1.5 py-0.5 rounded-full flex-shrink-0 uppercase" style={{ color, background: `${color}18` }}>{formation.type}</span>
        </div>
        <p className="label-sm truncate" style={{ color: 'var(--oc-25)' }}>{formation.description}</p>
        <p className="label-sm mt-0.5" style={{ color }}>{formation.price === 0 ? 'Gratuit' : `${formation.price.toLocaleString('fr-FR')} FCFA`}</p>
      </div>
      <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" style={{ background: 'var(--oc-04)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      </button>
    </motion.div>
  );
}

function FormationForm({ onSave }: { onSave: (data: Record<string, unknown>) => Promise<void> }) {
  const [open,   setOpen]   = useState(false);
  const [form,   setForm]   = useState({ title: '', description: '', price: '0', type: 'pdf', image: '', fileUrl: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form) => (v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (v) setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.title)       newErrors.title       = 'Titre requis';
    if (!form.description) newErrors.description = 'Description requise';
    if (!form.image)       newErrors.image       = 'Image requise';
    if (!form.fileUrl)     newErrors.fileUrl     = 'Fichier requis';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    await onSave({ ...form, price: Number(form.price) });
    setForm({ title: '', description: '', price: '0', type: 'pdf', image: '', fileUrl: '' });
    setErrors({});
    setOpen(false);
    setSaving(false);
  };

  const FileLabel = ({ k, label, required }: { k: string; label: string; required?: boolean }) => {
    const filled = !!(form as Record<string, string>)[k];
    return (
      <div className="flex items-center justify-between mb-1.5">
        <label className="label-sm" style={{ color: errors[k] ? '#EF4444' : 'var(--oc-25)' }}>
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {filled ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#10B981' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Chargé
          </span>
        ) : errors[k] ? (
          <span className="text-[10px] font-semibold text-red-400">{errors[k]}</span>
        ) : (
          <span className="text-[10px]" style={{ color: 'var(--oc-15)' }}>En attente</span>
        )}
      </div>
    );
  };

  const canSave = form.title && form.description && form.image && form.fileUrl;

  return (
    <div>
      {!open ? (
        <motion.button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium" style={{ background: '#F59E0B', color: '#000' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle formation
        </motion.button>
      ) : (
        <motion.div className="rounded-2xl p-5 mb-6 space-y-4 w-full max-w-lg" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block label-sm mb-1.5" style={{ color: errors.title ? '#EF4444' : 'var(--oc-25)' }}>Titre *</label>
              <input value={form.title} onChange={e => set('title')(e.target.value)} placeholder="Titre de la formation" className={inputCls} style={{ ...inputStyle, borderColor: errors.title ? '#EF4444' : undefined }} />
            </div>
            <div>
              <label className="block label-sm mb-1.5" style={{ color: 'var(--oc-25)' }}>Type *</label>
              <select value={form.type} onChange={e => set('type')(e.target.value)} className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="pdf">PDF</option>
                <option value="video">Vidéo</option>
                <option value="zip">ZIP</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block label-sm mb-1.5" style={{ color: errors.description ? '#EF4444' : 'var(--oc-25)' }}>Description *</label>
            <textarea rows={3} value={form.description} onChange={e => set('description')(e.target.value)} placeholder="Description..." className={inputCls + ' resize-none'} style={{ ...inputStyle, borderColor: errors.description ? '#EF4444' : undefined }} />
          </div>
          <div>
            <label className="block label-sm mb-1.5" style={{ color: 'var(--oc-25)' }}>Prix (FCFA)</label>
            <input type="number" min="0" value={form.price} onChange={e => set('price')(e.target.value)} placeholder="0 = Gratuit" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <FileLabel k="image" label="Image de couverture" required />
            <div style={{ border: errors.image ? '1px solid rgba(239,68,68,0.4)' : undefined, borderRadius: 12 }}>
              <UploadZone value={form.image} onChange={set('image')} />
            </div>
          </div>
          <div>
            <FileLabel k="fileUrl" label="Fichier de la formation (PDF / vidéo / ZIP)" required />
            <div style={{ border: errors.fileUrl ? '1px solid rgba(239,68,68,0.4)' : undefined, borderRadius: 12 }}>
              <UploadZone value={form.fileUrl} onChange={set('fileUrl')} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity"
              style={{ background: '#F59E0B', color: '#000', opacity: canSave ? 1 : 0.45, cursor: canSave ? 'pointer' : 'not-allowed' }}
            >
              {saving ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex"><Icon.Spinner size={12} /></motion.span> : <Icon.Check size={12} />}
              Enregistrer
            </button>
            <button onClick={() => { setOpen(false); setErrors({}); }} className="px-4 py-2 rounded-full text-sm hover:text-white/60 transition-colors" style={{ color: 'var(--oc-30)' }}>Annuler</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Idea row + form ────────────────────────────────────────── */
function IdeaRow({ idea, onDelete }: { idea: Idea; onDelete: () => void }) {
  return (
    <motion.div layout className="flex items-center gap-4 p-4 rounded-xl group" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }} whileHover={{ borderColor: 'var(--txt-muted)' }}>
      {idea.image && (
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
          <Image src={idea.image} alt={idea.title} fill className="object-cover" sizes="48px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-space text-sm font-semibold truncate" style={{ color: 'var(--txt)' }}>{idea.title}</p>
          {idea.category && <span className="label-sm px-1.5 py-0.5 rounded-full flex-shrink-0 capitalize" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}>{idea.category}</span>}
        </div>
        <p className="label-sm truncate" style={{ color: 'var(--oc-25)' }}>{idea.description}</p>
        {idea.pdfUrl && <p className="label-sm mt-0.5" style={{ color: 'var(--oc-20)' }}>PDF joint</p>}
      </div>
      <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" style={{ background: 'var(--oc-04)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      </button>
    </motion.div>
  );
}

function IdeaForm({ onSave }: { onSave: (data: Record<string, unknown>) => Promise<void> }) {
  const [open,   setOpen]   = useState(false);
  const [form,   setForm]   = useState({ title: '', description: '', image: '', pdfUrl: '', category: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form) => (v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (v) setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.title)       newErrors.title       = 'Titre requis';
    if (!form.description) newErrors.description = 'Description requise';
    if (!form.image)       newErrors.image       = 'Image requise';
    if (!form.pdfUrl)      newErrors.pdfUrl      = 'PDF requis';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    await onSave(form);
    setForm({ title: '', description: '', image: '', pdfUrl: '', category: '' });
    setErrors({});
    setOpen(false);
    setSaving(false);
  };

  /* label helper with status icon */
  const FieldLabel = ({ k, label, required }: { k: string; label: string; required?: boolean }) => {
    const filled = !!(form as Record<string, string>)[k];
    return (
      <div className="flex items-center justify-between mb-1.5">
        <label className="label-sm" style={{ color: errors[k] ? '#EF4444' : 'var(--oc-25)' }}>
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {filled ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#10B981' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Chargé
          </span>
        ) : errors[k] ? (
          <span className="text-[10px] font-semibold text-red-400">{errors[k]}</span>
        ) : (
          <span className="text-[10px]" style={{ color: 'var(--oc-15)' }}>En attente</span>
        )}
      </div>
    );
  };

  const canSave = form.title && form.description && form.image && form.pdfUrl;

  return (
    <div>
      {!open ? (
        <motion.button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium" style={{ background: '#10B981', color: '#000' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle idée
        </motion.button>
      ) : (
        <motion.div className="rounded-2xl p-5 mb-6 space-y-4 w-full max-w-lg" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block label-sm mb-1.5" style={{ color: errors.title ? '#EF4444' : 'var(--oc-25)' }}>Titre *</label>
              <input value={form.title} onChange={e => set('title')(e.target.value)} placeholder="Titre de l'idée" className={inputCls} style={{ ...inputStyle, borderColor: errors.title ? '#EF4444' : undefined }} />
            </div>
            <div>
              <label className="block label-sm mb-1.5" style={{ color: 'var(--oc-25)' }}>Catégorie</label>
              <input value={form.category} onChange={e => set('category')(e.target.value)} placeholder="web, mobile, ia..." className={inputCls} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block label-sm mb-1.5" style={{ color: errors.description ? '#EF4444' : 'var(--oc-25)' }}>Description *</label>
            <textarea rows={4} value={form.description} onChange={e => set('description')(e.target.value)} placeholder="Décris l'idée, le problème qu'elle résout, le marché cible..." className={inputCls + ' resize-none'} style={{ ...inputStyle, borderColor: errors.description ? '#EF4444' : undefined }} />
          </div>
          <div>
            <FieldLabel k="image" label="Image illustrative" required />
            <div style={{ border: errors.image ? '1px solid rgba(239,68,68,0.4)' : undefined, borderRadius: 12 }}>
              <UploadZone value={form.image} onChange={set('image')} />
            </div>
          </div>
          <div>
            <FieldLabel k="pdfUrl" label="Cahier des charges (PDF)" required />
            <div style={{ border: errors.pdfUrl ? '1px solid rgba(239,68,68,0.4)' : undefined, borderRadius: 12 }}>
              <UploadZone value={form.pdfUrl} onChange={set('pdfUrl')} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity"
              style={{ background: '#10B981', color: '#000', opacity: canSave ? 1 : 0.45, cursor: canSave ? 'pointer' : 'not-allowed' }}
            >
              {saving ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex"><Icon.Spinner size={12} /></motion.span> : <Icon.Check size={12} />}
              Enregistrer
            </button>
            <button onClick={() => { setOpen(false); setErrors({}); }} className="px-4 py-2 rounded-full text-sm hover:text-white/60 transition-colors" style={{ color: 'var(--oc-30)' }}>Annuler</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────── */
function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center py-16 text-white/15 flex flex-col items-center gap-3">
      {icon}<p className="font-inter text-sm">{text}</p>
    </div>
  );
}

function SimpleRow({ title, subtitle, meta, badge, onDelete }: {
  title: string; subtitle?: string; meta?: string; badge?: string; onDelete: () => void;
}) {
  return (
    <motion.div layout className="flex items-center gap-4 p-4 rounded-xl group" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }} whileHover={{ borderColor: 'var(--txt-muted)' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-space text-sm font-semibold text-white/70 truncate">{title}</p>
          {badge && <span className="label-sm px-1.5 py-0.5 rounded-full flex-shrink-0 capitalize" style={{ color: '#6366F1', background: 'rgba(99,102,241,0.1)' }}>{badge}</span>}
        </div>
        {subtitle && <p className="label-sm text-white/25 truncate">{subtitle}</p>}
        {meta && <p className="label-sm text-white/15">{meta}</p>}
      </div>
      <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" style={{ background: 'var(--oc-04)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      </button>
    </motion.div>
  );
}

type FieldDef = { key: string; label: string; required?: boolean; multiline?: boolean; placeholder?: string; select?: string[]; };

function SimpleEntityForm({ fields, onSave }: { fields: FieldDef[]; onSave: (data: Record<string, string>) => Promise<void>; }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setForm({});
    setOpen(false);
    setSaving(false);
  };

  return (
    <div>
      {!open ? (
        <motion.button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium" style={{ background: '#6366F1', color: '#fff' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </motion.button>
      ) : (
        <motion.div className="rounded-2xl p-5 mb-6 space-y-4 w-full max-w-lg" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label className="block label-sm text-white/25 mb-1.5">{f.label}{f.required && <span className="text-red-400 ml-1">*</span>}</label>
              {f.select ? (
                <select value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border font-inter text-sm text-white/70 outline-none" style={{ borderColor: 'var(--line)', appearance: 'none' }}>
                  <option value="">Choisir...</option>
                  {f.select.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.multiline ? (
                <textarea rows={3} value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border font-inter text-sm text-white/70 placeholder:text-white/15 outline-none resize-none" style={{ borderColor: 'var(--line)' }} />
              ) : (
                <input value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border font-inter text-sm text-white/70 placeholder:text-white/15 outline-none" style={{ borderColor: 'var(--line)' }} />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: '#6366F1', color: '#fff' }}>
              {saving ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex"><Icon.Spinner size={12} /></motion.span> : <Icon.Check size={12} />}
              Enregistrer
            </button>
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-full text-sm text-white/30 hover:text-white/60 transition-colors">Annuler</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
