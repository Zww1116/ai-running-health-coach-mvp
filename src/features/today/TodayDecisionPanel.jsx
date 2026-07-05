import { CheckCircle2, ClipboardCheck, ShieldAlert } from 'lucide-react';

export function TodayDecisionPanel({ analysis }) {
  const firstAction = analysis.headCoach.dailyPlan[0] ?? '今天维持计划，同时观察睡眠、疼痛和疲劳变化。';
  const keyRisks = analysis.specialists
    .filter((report) => report.riskLevel !== 'low')
    .map((report) => report.name)
    .slice(0, 3);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">今日闭环</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">先决策，再执行，晚上复盘</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
          <ShieldAlert size={16} />
          风险 {analysis.riskLevel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <DecisionItem
          icon={<ClipboardCheck size={18} />}
          label="总教练动作"
          value={firstAction}
        />
        <DecisionItem
          icon={<CheckCircle2 size={18} />}
          label="今日重点"
          value={analysis.headCoach.focus}
        />
        <DecisionItem
          icon={<ShieldAlert size={18} />}
          label="需要优先关注"
          value={keyRisks.length > 0 ? keyRisks.join(' / ') : '暂无明显风险，继续监控趋势。'}
        />
      </div>
    </section>
  );
}

function DecisionItem({ icon, label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <span className="text-coral">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}
