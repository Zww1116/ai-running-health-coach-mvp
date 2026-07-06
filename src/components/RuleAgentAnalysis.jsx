import { useMemo, useState } from 'react';
import { Bot, ChevronRight, ClipboardList, ShieldCheck } from 'lucide-react';
import { buildLiveAgentAnalysis } from '../features/analysis/liveAgentAnalysis';

export function RuleAgentAnalysis({ records = [], profile = {} }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const liveAnalysis = useMemo(
    () => buildLiveAgentAnalysis(records, profile),
    [records, profile, refreshKey],
  );
  const { dailyHealthData: data, analysis, source } = liveAnalysis;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-coral">
            <Bot size={20} />
            <p className="text-sm font-medium">规则版多专家 Agent</p>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-ink">基于最新记录生成多专家分析</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            不连接 OpenAI API，优先读取你保存的最新健康记录；没有记录时使用示例数据兜底。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white hover:bg-moss"
        >
          <ClipboardList size={17} />
          重新生成分析
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <DataPill label="数据来源" value={source === 'latest-record' ? '最新记录' : '示例数据'} />
        <DataPill label="日期" value={data.date} />
        <DataPill label="月跑量" value={`${data.monthlyRunningKm ?? 0}km`} />
        <DataPill label="睡眠/疲劳" value={`${data.sleepHours}h / ${data.fatigueLevel}/10`} />
        <DataPill label="周期阶段" value={formatPhase(data.menstrualPhase)} />
      </div>

      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        <span className="font-medium text-ink">当前目标：</span>
        {data.goal || '暂无目标记录'}
      </div>

      {analysis && (
        <div className="mt-5 grid gap-4">
          <HeadCoachSummary plan={analysis.headCoach} />
          <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
            {analysis.specialists.map((report) => (
              <AgentCard key={report.agentName} report={report} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function HeadCoachSummary({ plan }) {
  return (
    <article className="rounded-lg border border-skysoft bg-skysoft/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-moss" size={18} />
          <h3 className="text-base font-semibold text-ink">总教练综合方案</h3>
        </div>
        <RiskBadge level={plan.overallRiskLevel} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <AdviceBlock title="今日训练" text={plan.todayTrainingAdvice} />
        <AdviceBlock title="营养优先级" text={plan.nutritionAdvice} />
        <AdviceBlock title="恢复安排" text={plan.recoveryAdvice} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <ListBlock title="明日调整" items={[plan.tomorrowAdjustment]} />
        <ListBlock title="本周重点" items={plan.weeklyFocus} />
      </div>
    </article>
  );
}

function AgentCard({ report }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{report.agentName}</h3>
        <RiskBadge level={report.riskLevel} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{report.summary}</p>
      <ListBlock title="发现" items={report.findings} />
      <ListBlock title="建议" items={report.recommendations} />
      {report.warningFlags.length > 0 && <ListBlock title="警示" items={report.warningFlags} tone="warning" />}
    </article>
  );
}

function AdviceBlock({ title, text }) {
  return (
    <div className="rounded-md border border-white/70 bg-white/70 p-3">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink">{text}</p>
    </div>
  );
}

function ListBlock({ title, items, tone = 'default' }) {
  return (
    <div className="mt-3">
      <p className={`text-xs font-medium ${tone === 'warning' ? 'text-coral' : 'text-slate-500'}`}>{title}</p>
      <ul className="mt-2 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
            <ChevronRight className="mt-1 shrink-0 text-moss" size={14} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DataPill({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function RiskBadge({ level }) {
  const className =
    level === 'high'
      ? 'border-coral/40 bg-coral/10 text-coral'
      : level === 'medium'
        ? 'border-amber-300 bg-amber-50 text-amber-700'
        : 'border-moss/30 bg-moss/10 text-moss';

  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${className}`}>
      {level}
    </span>
  );
}

function formatPhase(phase) {
  const labels = {
    menstruation: '经期',
    follicular: '卵泡期',
    ovulation: '排卵期',
    luteal: '黄体期',
  };
  return labels[phase] ?? '未记录';
}
