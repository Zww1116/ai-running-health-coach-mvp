export function createRecordsExport({ records, now = () => new Date() }) {
  const exportedAt = now().toISOString();
  return {
    filename: `ai-health-records-${exportedAt.slice(0, 10)}.json`,
    json: JSON.stringify({ exportedAt, records }, null, 2),
  };
}

export function downloadRecordsExport(records) {
  const { filename, json } = createRecordsExport({ records });
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
