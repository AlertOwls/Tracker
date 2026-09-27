'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { WeeklyArtifact, ArtifactType } from '@/lib/types';
import {
  deleteWeeklyArtifact,
  fetchWeeklyArtifacts,
  saveWeeklyArtifact,
} from '@/lib/artifact-storage';
import { getWeekStart, formatWeekLabel } from '@/lib/week';
import { SCHEDULE_ARCHETYPES, getArchetypeForDate } from '@/lib/schedules';
import { Archive, ExternalLink, FileText, Link2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const TYPES: { value: ArtifactType; label: string }[] = [
  { value: 'note', label: 'Note' },
  { value: 'link', label: 'Link' },
  { value: 'document', label: 'Document' },
  { value: 'other', label: 'Other' },
];

export function WeeklyArtifactsPanel() {
  const today = new Date().toISOString().split('T')[0];
  const currentWeek = getWeekStart(today);
  const [weekStart, setWeekStart] = useState(currentWeek);
  const [artifacts, setArtifacts] = useState<WeeklyArtifact[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [artifactType, setArtifactType] = useState<ArtifactType>('link');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [relatedId, setRelatedId] = useState<string>('');

  const scheduleOptions = useMemo(() => {
    const archetype = getArchetypeForDate(new Date(today + 'T12:00:00'));
    return SCHEDULE_ARCHETYPES[archetype].items;
  }, [today]);

  const load = async () => {
    setLoading(true);
    const all = await fetchWeeklyArtifacts();
    setArtifacts(all);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const weekItems = artifacts.filter((a) => a.week_start === weekStart);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    await saveWeeklyArtifact({
      week_start: weekStart,
      title: title.trim(),
      artifact_type: artifactType,
      url: url.trim() || null,
      body: body.trim() || null,
      related_schedule_id: relatedId || null,
    });
    setTitle('');
    setUrl('');
    setBody('');
    setRelatedId('');
    toast.success('Artifact saved');
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteWeeklyArtifact(id);
    toast.success('Removed');
    await load();
  };

  const typeIcon = (t: ArtifactType) => {
    switch (t) {
      case 'link':
        return <Link2 className="h-3.5 w-3.5" />;
      case 'document':
        return <FileText className="h-3.5 w-3.5" />;
      default:
        return <Archive className="h-3.5 w-3.5" />;
    }
  };

  return (
    <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Archive className="h-4 w-4 text-purple-400" />
            Weekly artifacts
          </h2>
          <p className="text-xs text-zinc-500">Notes, doc links, and outputs tied to tasks for this week.</p>
        </div>
        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-semibold">Week</label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(getWeekStart(e.target.value))}
            className="mt-1 block rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs font-mono text-white"
          />
          <p className="text-[10px] text-zinc-500 mt-0.5">{formatWeekLabel(weekStart)}</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
        <input
          placeholder="Title (e.g. Polity FR notes)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white md:col-span-2"
        />
        <select
          value={artifactType}
          onChange={(e) => setArtifactType(e.target.value as ArtifactType)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={relatedId}
          onChange={(e) => setRelatedId(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
        >
          <option value="">Related task (optional)</option>
          {scheduleOptions.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <input
          placeholder="URL (Google Doc, Notion, Drive…)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white md:col-span-2"
        />
        <textarea
          placeholder="Short note or description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white md:col-span-2 resize-none"
        />
        <button
          type="submit"
          className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add artifact
        </button>
      </form>

      {loading ? (
        <p className="text-xs text-zinc-500 font-mono">Loading…</p>
      ) : weekItems.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-xl">
          No artifacts for this week yet. Add links to study notes, PRDs, or recordings.
        </p>
      ) : (
        <ul className="space-y-2">
          {weekItems.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <span className="text-purple-400">{typeIcon(a.artifact_type)}</span>
                  {a.title}
                  <span className="text-[10px] uppercase text-zinc-500">{a.artifact_type}</span>
                </div>
                {a.body && <p className="text-xs text-zinc-400 mt-1">{a.body}</p>}
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(a.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
