import { Activity, Bot, Database, Sparkles } from 'lucide-react';
import { appPages, getPageById } from '../pages/pageConfig';

export function AppShell({ activePageId, onChangePage, profile, children }) {
  const activePage = getPageById(activePageId);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 md:grid-cols-[minmax(0,1fr)_300px] md:items-center lg:px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-skysoft px-3 py-1 text-sm font-medium text-ink">
              <Sparkles size={15} />
              AI 运动健康管理 Web MVP
            </div>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-normal text-ink md:text-4xl">
              专属多专家Agent健康运动管理平台
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              本地记录跑步、力量、饮食、体重、睡眠、经期和疼痛状态；多专家规则引擎输出独立建议，总教练生成每日与每周方案。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
              <Badge icon={<Activity size={15} />} text={profile.goal} />
              <Badge icon={<Bot size={15} />} text="规则版多专家 Agent" />
              <Badge icon={<Database size={15} />} text="localStorage / Supabase 可切换" />
            </div>
          </div>
          <img
            className="h-40 w-full rounded-lg object-cover md:h-48"
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80"
            alt="女性跑者训练"
          />
        </div>

        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-4 lg:px-6" aria-label="主导航">
          {appPages.map((page) => {
            const isActive = page.id === activePage.id;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => onChangePage(page.id)}
                className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-ink bg-ink text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page.title}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <section className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-slate-500">{activePage.purpose}</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">{activePage.title}</h2>
        </section>
        {children}
      </div>
    </main>
  );
}

function Badge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
      {icon}
      {text}
    </span>
  );
}
