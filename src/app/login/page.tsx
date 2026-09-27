'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authEnabled, setAuthEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/auth/status')
      .then((r) => r.json())
      .then((data) => {
        if (!data.enabled) {
          router.replace('/');
        }
        setAuthEnabled(data.enabled);
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        toast.error('Login failed', { description: 'Check username and password.' });
        return;
      }
      const from = searchParams.get('from') || '/';
      router.replace(from === '/login' ? '/' : from);
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!authEnabled) return null;

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <div>
            <h1 className="text-lg font-bold text-white font-mono">Tracker</h1>
            <p className="text-xs text-zinc-500">Executive OS sign-in</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium">Username</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-medium">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
