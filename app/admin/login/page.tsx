'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createBrowserSupabase } from '@/lib/supabase-browser';

export default function AdminLoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirectTo') ?? '/admin';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  /* If already logged in, skip login */
  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(redirectTo);
    });
  }, [redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createBrowserSupabase();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
      return;
    }

    router.replace(redirectTo);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg)' }}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="mb-10">
          <p className="label-sm mb-3" style={{ color: 'var(--oc-25)' }}>
            Administration
          </p>
          <h1 className="display-md" style={{ color: 'var(--txt)' }}>
            Connexion<span style={{ color: '#3B82F6' }}>.</span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="label-sm" style={{ color: 'var(--oc-30)' }}>
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="field"
              placeholder="vous@exemple.com"
            />
          </div>

          <div className="space-y-1">
            <label className="label-sm" style={{ color: 'var(--oc-30)' }}>
              Mot de passe
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="field"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              className="text-sm font-inter"
              style={{ color: '#F43F5E' }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-inter text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ background: '#3B82F6', color: '#fff' }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center label-sm" style={{ color: 'var(--oc-15)' }}>
          Accès réservé — Prince Aïneel ONILOU
        </p>
      </motion.div>
    </main>
  );
}
