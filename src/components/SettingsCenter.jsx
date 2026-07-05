import {
  DatabaseZap,
  Download,
  Factory,
  FileUp,
  HardDrive,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  UploadCloud,
} from 'lucide-react';

export function SettingsCenter({
  mode,
  records,
  storageEstimate,
  message,
  onExport,
  onImport,
  onCreateBackup,
  onRestoreBackup,
  onClearAll,
  onFactoryReset,
  onRefreshStorage,
  onUpgradeDatabase,
}) {
  function importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    onImport(file);
    event.target.value = '';
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">设置中心</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">数据、备份与升级入口</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-500">
          <Settings size={15} />
          {mode === 'cloud' ? '云端同步已启用' : '仅本机浏览器保存'}
        </span>
      </div>

      {message && (
        <div className="mb-4 rounded-md border border-skysoft bg-skysoft/40 px-3 py-2 text-sm text-slate-700">
          {message}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <HardDrive size={17} className="text-coral" />
            存储状态
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <StatusRow label="当前记录" value={`${records.length} 条`} />
            <StatusRow label="已用空间" value={storageEstimate?.usageLabel ?? '读取中'} />
            <StatusRow label="可用配额" value={storageEstimate?.quotaLabel ?? '读取中'} />
            <StatusRow label="占用比例" value={`${storageEstimate?.percent ?? 0}%`} />
          </div>
          <button
            type="button"
            onClick={onRefreshStorage}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            刷新存储空间
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <ActionButton icon={<Download size={16} />} label="导出数据 JSON" onClick={onExport} />
          <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <FileUp size={16} />
            导入数据 JSON
            <input type="file" accept="application/json,.json" onChange={importFile} className="sr-only" />
          </label>
          <ActionButton icon={<Save size={16} />} label="创建本地备份" onClick={onCreateBackup} />
          <ActionButton icon={<UploadCloud size={16} />} label="恢复本地备份" onClick={onRestoreBackup} />
          <ActionButton icon={<DatabaseZap size={16} />} label="一键升级数据库（预留）" onClick={onUpgradeDatabase} />
          <ActionButton icon={<Factory size={16} />} label="恢复出厂设置" onClick={onFactoryReset} />
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 md:col-span-2"
          >
            <Trash2 size={16} />
            清空所有数据
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        清空所有数据会清除当前浏览器记录、本地备份、本地图片缓存；登录云端账号时也会删除当前账号的云端记录。图片当前不会上传服务器。
      </p>
    </section>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
      <span>{label}</span>
      <strong className="text-ink">{value}</strong>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      {icon}
      {label}
    </button>
  );
}
