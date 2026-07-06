import { UploadCloud } from 'lucide-react';
import { ImportCenter } from '../features/import/ImportCenter';

export function ImportPage({ onAddRecord }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-skysoft p-2 text-ink">
            <UploadCloud size={20} />
          </span>
          <div>
            <p className="text-sm text-slate-500">第一轮导入中心</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">独立导入、复核，再保存为正式健康记录</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              当前支持 COROS FIT / TCX / GPX / CSV 文件解析、训练截图和饮食图片本地保存。导入结果会先生成草稿，你可以手动修改关键字段后再保存。
            </p>
          </div>
        </div>
      </section>
      <ImportCenter onAddRecord={onAddRecord} />
    </div>
  );
}
