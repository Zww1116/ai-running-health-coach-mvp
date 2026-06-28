import { CheckCircle2, ClipboardList, ShieldCheck } from 'lucide-react';

export function HeadCoachPlan({ report, riskLevel }) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck size={16} className="text-moss" />
            <span>{report.name} · 今日决策</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-ink">{report.focus}</h2>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={riskLevel} />
          <ClipboardList className="text-coral" size={26} />
        </div>
      </div>

      {report.dailyPlan[0] && (
        <div className="mt-4 rounded-lg border border-skysoft bg-skysoft/50 p-4">
          <p className="text-xs font-semibold text-slate-500">今日重点</p>
          <p className="mt-2 text-base leading-7 text-ink">{report.dailyPlan[0]}</p>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PlanList title="今日方案" items={report.dailyPlan} />
        <PlanList title="本周方案" items={report.weeklyPlan} />
      </div>
    </section>
  );
}

function RiskBadge({ level }) {
  const labels = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险',
  };
  const className =
    level === 'high'
      ? 'border-coral/40 bg-coral/10 text-coral'
      : level === 'medium'
        ? 'border-amber-300 bg-amber-50 text-amber-700'
        : 'border-moss/30 bg-moss/10 text-moss';

  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${className}`}>{labels[level]}</span>;
}

function PlanList({ title, items }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
            <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={17} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
