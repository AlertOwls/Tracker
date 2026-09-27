/** ISO date (YYYY-MM-DD) for Monday of the week containing `dateStr`. */
export function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

export function formatWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T12:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (x: Date) =>
    x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${fmt(start)} – ${fmt(end)}`;
}
