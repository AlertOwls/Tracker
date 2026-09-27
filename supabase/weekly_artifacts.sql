create table if not exists weekly_artifacts (
  id text primary key,
  week_start date not null,
  title text not null,
  artifact_type text check (artifact_type in ('note', 'link', 'document', 'other')) default 'note',
  url text,
  body text,
  related_schedule_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists weekly_artifacts_week_start_idx on weekly_artifacts (week_start desc);
