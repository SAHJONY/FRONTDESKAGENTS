// Client-side data export helpers.
// Safe to import into client components ("use client" pages).

export function downloadBlob(
  content: BlobPart,
  filename: string,
  type = 'text/plain'
): void {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: unknown, filename = 'export.json'): void {
  downloadBlob(JSON.stringify(data, null, 2), filename, 'application/json');
}

export function toCSV(
  rows: Record<string, unknown>[],
  columns?: string[]
): string {
  if (!rows || rows.length === 0) return '';
  const cols =
    columns ?? Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const escape = (v: unknown): string => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.join(',');
  const body = rows
    .map((r) => cols.map((c) => escape(r[c])).join(','))
    .join('\n');
  return `${header}\n${body}`;
}

export function exportToCSV(
  rows: Record<string, unknown>[],
  filename = 'export.csv',
  columns?: string[]
): void {
  downloadBlob(toCSV(rows, columns), filename, 'text/csv;charset=utf-8;');
}
