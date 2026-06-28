import { Activity, Dumbbell, Moon, Scale } from 'lucide-react';
import { MetricTile } from './MetricTile';

export function WeeklyOverview({ analysis, monthlyRunningKm }) {
  const { week, riskLevel } = analysis;
  const riskText = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险',
  }[riskLevel];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <MetricTile
        label="月跑量"
        value={`${monthlyRunningKm} km`}
        hint={`当前目标 ${monthlyRunningKm}km/月`}
        tone="sky"
      />
      <MetricTile
        label="力量训练"
        value={`${week.strengthSessions} 次`}
        hint="目标 3 次/周"
        tone="moss"
      />
      <MetricTile
        label="平均睡眠"
        value={`${week.averageSleepHours} h`}
        hint="恢复基础指标"
      />
      <MetricTile
        label="最新体重"
        value={`${week.latestWeightKg ?? '-'} kg`}
        hint="仅看趋势，不单日判断"
      />
      <div className="min-h-32 rounded-lg border border-coral/30 bg-coral/10 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Activity size={16} />
          综合风险
        </div>
        <div className="mt-2 text-2xl font-semibold text-ink">{riskText}</div>
        <div className="mt-1 flex gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Dumbbell size={13} />
            疼痛 {week.painMax}/10
          </span>
          <span className="inline-flex items-center gap-1">
            <Moon size={13} />
            睡眠
          </span>
          <span className="inline-flex items-center gap-1">
            <Scale size={13} />
            趋势
          </span>
        </div>
      </div>
    </section>
  );
}
