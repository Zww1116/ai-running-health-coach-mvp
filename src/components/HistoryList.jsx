import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { LocalImageGallery } from './LocalImageGallery';

export function HistoryList({ records }) {
  const [expandedId, setExpandedId] = useState('');
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
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === record.id ? '' : record.id)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-ink"
            >
              {expandedId === record.id ? '收起详情' : '查看详情'}
              <ChevronDown size={14} className={expandedId === record.id ? 'rotate-180' : ''} />
            </button>
            {expandedId === record.id && (
              <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3">
                <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                  <Detail label="深睡" value={`${record.sleep?.deepHours ?? 0} h`} />
                  <Detail label="浅睡" value={`${record.sleep?.lightHours ?? 0} h`} />
                  <Detail label="REM" value={`${record.sleep?.remHours ?? 0} h`} />
                  <Detail label="睡眠质量" value={`${record.sleep?.quality ?? 0}/5`} />
                  <Detail label="夜间静息心率" value={`${record.sleep?.restingHr ?? 0} bpm`} />
                  <Detail label="HRV" value={record.sleep?.hrv ?? 0} />
                  <Detail label="起床疲劳感" value={`${record.sleep?.wakeFatigue ?? 0}/10`} />
                </div>
                <LocalImageGallery attachments={record.attachments} />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
      <span>{label}</span>
      <strong className="text-ink">{value}</strong>
    </div>
  );
}
