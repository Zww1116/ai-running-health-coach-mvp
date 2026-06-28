export function MetricTile({ label, value, hint, tone = 'default' }) {
  const tones = {
    default: 'border-slate-200 bg-white',
    coral: 'border-coral/20 bg-coral/10',
    sky: 'border-skysoft bg-skysoft/60',
    moss: 'border-moss/20 bg-moss/10',
  };

  return (
    <div className={`min-h-32 rounded-lg border p-4 ${tones[tone]}`}>
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-ink">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  );
}
