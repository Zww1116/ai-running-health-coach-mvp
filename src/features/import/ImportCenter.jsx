import { useState } from 'react';
import { CheckCircle2, ImageUp, Upload, Utensils } from 'lucide-react';
import { RecordImageUploader } from '../../components/RecordImageUploader';
import { parseCorosActivityFile } from '../../integrations/corosFileParser';
import { estimateNutritionFromMealImage } from '../../integrations/nutritionVisionClient';
import { buildImportDraft, buildRecordFromImportDraft } from './importCenterModel';

export function ImportCenter({ onAddRecord, enabledSources = ['coros', 'nutrition'] }) {
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState('');
  const [mealPreview, setMealPreview] = useState('');

  async function importCorosFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const content = extension === 'fit' ? await file.arrayBuffer() : await file.text();
      const result = parseCorosActivityFile({ fileName: file.name, content });
      setDraft(buildImportDraft(result));
      setMessage(`${result.source} 已解析，请复核后保存。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'COROS 文件解析失败，请检查文件格式。');
    } finally {
      event.target.value = '';
    }
  }

  async function estimateMeal(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setMealPreview(String(reader.result));
    reader.readAsDataURL(file);

    setMessage('正在评估饮食图片...');
    try {
      const result = await estimateNutritionFromMealImage(file);
      setDraft(buildImportDraft({ ...result, activityType: 'nutrition' }));
      setMessage(`${result.source} 已生成营养估算，请复核后保存。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '饮食图片评估失败，可先手动记录。');
    } finally {
      event.target.value = '';
    }
  }

  function updateForm(patch) {
    setDraft((current) => (current ? { ...current, form: { ...current.form, ...patch } } : current));
  }

  function saveDraft() {
    if (!draft) return;
    onAddRecord(buildRecordFromImportDraft(draft));
    setMessage('已保存为正式健康记录，可在记录中心和今日决策台查看。');
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">导入中心</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">从手表文件、截图和饮食照片生成可复核记录</h2>
        </div>
        {draft && (
          <span className="inline-flex items-center gap-2 rounded-md border border-moss/30 bg-moss/10 px-3 py-2 text-sm text-moss">
            <CheckCircle2 size={16} />
            已生成草稿
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ImportFileButton onChange={importCorosFile} />
        {enabledSources.includes('nutrition') && <MealImageButton onChange={estimateMeal} />}
        <button
          type="button"
          disabled={!draft}
          onClick={saveDraft}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white hover:bg-moss disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <CheckCircle2 size={16} />
          保存导入记录
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-md border border-skysoft bg-skysoft/40 px-3 py-2 text-sm text-slate-700">
          {message}
        </div>
      )}

      {draft && (
        <div className="mt-5 grid gap-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 md:grid-cols-4">
              <Input label="日期" type="date" value={draft.form.date} onChange={(date) => updateForm({ date })} />
              <Input label="跑步 km" type="number" value={draft.form.runningKm} onChange={(runningKm) => updateForm({ runningKm })} />
              <Input label="时长 min" type="number" value={draft.form.runningDurationMin} onChange={(runningDurationMin) => updateForm({ runningDurationMin })} />
              <Input label="平均配速" value={draft.form.runningPace} onChange={(runningPace) => updateForm({ runningPace })} />
              <Input label="平均心率" type="number" value={draft.form.runningAvgHr} onChange={(runningAvgHr) => updateForm({ runningAvgHr })} />
              <Input label="步频" type="number" value={draft.form.runningCadence} onChange={(runningCadence) => updateForm({ runningCadence })} />
              <Input label="RPE" type="number" value={draft.form.runningRpe} onChange={(runningRpe) => updateForm({ runningRpe })} />
              <Input label="备注" value={draft.form.runningNote} onChange={(runningNote) => updateForm({ runningNote })} />
            </div>
          </div>

          {(draft.activityType === 'nutrition' || mealPreview) && (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <Utensils size={17} className="text-coral" />
                饮食估算复核
              </div>
              <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                {mealPreview && <img src={mealPreview} alt="饮食照片预览" className="h-36 w-full rounded-md object-cover" />}
                <div className="grid gap-3 md:grid-cols-4">
                  <Input label="热量 kcal" type="number" value={draft.form.calories} onChange={(calories) => updateForm({ calories })} />
                  <Input label="蛋白 g" type="number" value={draft.form.protein} onChange={(protein) => updateForm({ protein })} />
                  <Input label="碳水 g" type="number" value={draft.form.carbs} onChange={(carbs) => updateForm({ carbs })} />
                  <Input label="饮水 L" type="number" value={draft.form.hydration} onChange={(hydration) => updateForm({ hydration })} />
                </div>
              </div>
            </div>
          )}

          <RecordImageUploader
            value={draft.form.attachments}
            onChange={(attachments) => updateForm({ attachments })}
            title="导入记录附件"
          />
        </div>
      )}
    </section>
  );
}

function ImportFileButton({ onChange }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
      <Upload size={16} />
      上传 COROS 文件
      <input type="file" accept=".fit,.tcx,.gpx,.csv,text/csv,application/gpx+xml,application/vnd.garmin.tcx+xml" onChange={onChange} className="sr-only" />
    </label>
  );
}

function MealImageButton({ onChange }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
      <ImageUp size={16} />
      上传饮食照片
      <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
    </label>
  );
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label className="grid gap-1 text-sm text-slate-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
      />
    </label>
  );
}
