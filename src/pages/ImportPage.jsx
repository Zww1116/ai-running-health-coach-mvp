import { UploadCloud } from 'lucide-react';
import { RecordForm } from '../components/RecordForm';

export function ImportPage({ onAddRecord, onResetData }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-skysoft p-2 text-ink">
            <UploadCloud size={20} />
          </span>
          <div>
            <p className="text-sm text-slate-500">第一轮导入中心</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">先复用记录表单中的 COROS / 图片导入能力</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              当前支持 COROS FIT / TCX / GPX / CSV 文件解析、训练截图和饮食图片本地保存。下一轮可以把导入控件从记录表单中继续拆成独立模块。
            </p>
          </div>
        </div>
      </section>
      <RecordForm onAddRecord={onAddRecord} onResetData={onResetData} />
    </div>
  );
}
