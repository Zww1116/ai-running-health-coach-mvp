import { Brain, ChevronRight } from 'lucide-react';

export function ExpertReports({ specialists }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Brain className="text-coral" size={20} />
        <h2 className="text-lg font-semibold text-ink">多专家独立建议</h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        {specialists.map((report) => (
          <article key={report.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-coral">{report.role}</p>
            <h3 className="mt-2 text-base font-semibold text-ink">{report.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{report.insight}</p>
            <div className="mt-4 flex gap-2 text-sm leading-6 text-slate-700">
              <ChevronRight className="mt-1 shrink-0 text-moss" size={15} />
              <span>{report.advice}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
