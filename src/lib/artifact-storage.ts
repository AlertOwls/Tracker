import { supabase, isSupabaseConfigured } from './supabaseClient';
import { WeeklyArtifact, ArtifactType } from './types';

const LOCAL_KEY = 'tracker_weekly_artifacts_v1';

function normalize(row: Record<string, unknown>): WeeklyArtifact {
  const now = new Date().toISOString();
  return {
    id: String(row.id ?? `art-${Date.now()}`),
    week_start: String(row.week_start),
    title: String(row.title),
    artifact_type: (row.artifact_type as ArtifactType) || 'note',
    url: row.url != null ? String(row.url) : null,
    body: row.body != null ? String(row.body) : null,
    related_schedule_id: row.related_schedule_id != null ? String(row.related_schedule_id) : null,
    created_at: String(row.created_at ?? now),
    updated_at: String(row.updated_at ?? now),
  };
}

function toRow(a: WeeklyArtifact) {
  return {
    id: a.id,
    week_start: a.week_start,
    title: a.title,
    artifact_type: a.artifact_type,
    url: a.url,
    body: a.body,
    related_schedule_id: a.related_schedule_id,
    created_at: a.created_at,
    updated_at: a.updated_at,
  };
}

export async function fetchWeeklyArtifacts(): Promise<WeeklyArtifact[]> {
  if (typeof window === 'undefined') return [];

  let items: WeeklyArtifact[] = [];
  const local = localStorage.getItem(LOCAL_KEY);
  if (local) {
    items = JSON.parse(local).map((r: Record<string, unknown>) => normalize(r));
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('weekly_artifacts')
        .select('*')
        .order('week_start', { ascending: false });

      if (!error && data) {
        items = data.map((r) => normalize(r as Record<string, unknown>));
        localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
      }
    } catch (e) {
      console.warn('Supabase weekly_artifacts fetch failed:', e);
    }
  }

  return items;
}

export async function saveWeeklyArtifact(
  input: Omit<WeeklyArtifact, 'id' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<WeeklyArtifact> {
  const now = new Date().toISOString();
  const existing = await fetchWeeklyArtifacts();
  const idx = input.id ? existing.findIndex((a) => a.id === input.id) : -1;

  let artifact: WeeklyArtifact;
  if (idx >= 0) {
    artifact = {
      ...existing[idx],
      ...input,
      id: existing[idx].id,
      updated_at: now,
    };
    existing[idx] = artifact;
  } else {
    artifact = normalize({
      ...input,
      id: input.id ?? `art-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      created_at: now,
      updated_at: now,
    });
    existing.unshift(artifact);
  }

  localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('weekly_artifacts').upsert(toRow(artifact));
    } catch (e) {
      console.warn('Supabase weekly_artifacts upsert failed:', e);
    }
  }

  return artifact;
}

export async function deleteWeeklyArtifact(id: string): Promise<void> {
  const existing = await fetchWeeklyArtifacts();
  const next = existing.filter((a) => a.id !== id);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(next));

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('weekly_artifacts').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase weekly_artifacts delete failed:', e);
    }
  }
}
