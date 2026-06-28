import { CalendarDays } from 'lucide-react';

export function HistoryList({ records }) {
  const latest = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="text-coral" size={19} />
        <h2 className="text-lg font-semibold text-ink">最近记录</h2>
      </div>
      <div className="space-y-3">
        {latest.map((record) => (
          <article key={record.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-ink">{record.date}</h3>
              <span className="text-sm text-slate-500">{record.cycle.phase}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              跑步 {record.running.km}km · 力量 {record.strength.trained ? `${record.strength.minutes} 分钟` : '无'} · 睡眠{' '}
              {record.sleep.hours}h · 疼痛 {record.pain.level}/10
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
