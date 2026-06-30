import { Download, Trash2 } from 'lucide-react';

export function PrivacyPanel({ mode, onExport, onClearLocal, onDeleteCloud }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3">
        <p className="text-sm text-slate-500">隐私与数据控制</p>
        <h2 className="mt-1 text-lg font-semibold text-ink">
          {mode === 'cloud' ? '云端同步已启用' : '仅本机浏览器保存'}
        </h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Download size={16} />
          导出 JSON
        </button>
        <button
          type="button"
          onClick={onClearLocal}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Trash2 size={16} />
          清除本机数据
        </button>
        <button
          type="button"
          onClick={onDeleteCloud}
          disabled={mode !== 'cloud'}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white"
        >
          <Trash2 size={16} />
          删除云端记录
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        当前阶段不会把你的健康记录发送给 OpenAI 或云端图片识别服务。云端模式依赖 Supabase RLS 隔离每个账号的数据。
      </p>
    </section>
  );
}
