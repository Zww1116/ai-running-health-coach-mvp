import { UploadCloud } from 'lucide-react';
import { DataCenter } from '../features/dataCenter/DataCenter';

export function ImportPage({ onAddRecord, onResetData, onSaveSleepRecord }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-skysoft p-2 text-ink">
            <UploadCloud size={20} />
          </span>
          <div>
            <p className="text-sm text-slate-500">V2 数据中心</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">所有采集入口集中在一个页面</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              从 COROS 文件、睡眠截图、饮食照片到手动记录，都先进入这里，再流向今日决策台和规则版多专家 Agent。
            </p>
          </div>
        </div>
      </section>
      <DataCenter
        onAddRecord={onAddRecord}
        onResetData={onResetData}
        onSaveSleepRecord={onSaveSleepRecord}
      />
    </div>
  );
}
