import { useState } from 'react';
import {
  Activity,
  CalendarDays,
  ChevronDown,
  Dumbbell,
  ImageUp,
  Moon,
  Plus,
  RotateCcw,
  Upload,
  Watch,
  Utensils,
} from 'lucide-react';
import { syncLatestCorosRunning, syncLatestCorosStrength } from '../integrations/corosClient';
import { parseCorosTrainingHubCsv } from '../integrations/corosFileParser';
import { estimateNutritionFromMealImage } from '../integrations/nutritionVisionClient';
import { buildRecordFromForm, defaultOpenRecordSections, initialForm } from './recordFormModel';

export function RecordForm({ onAddRecord, onResetData }) {
  const [form, setForm] = useSimpleForm(initialForm);
  const [openSections, setOpenSections] = useState(() => new Set(defaultOpenRecordSections));
  const [syncMessage, setSyncMessage] = useState('');
  const [mealPreview, setMealPreview] = useState('');
  const [mealEstimate, setMealEstimate] = useState('');

  function submit(event) {
    event.preventDefault();
    onAddRecord(buildRecordFromForm(form));
  }

  async function syncRunning() {
    const result = await syncLatestCorosRunning();
    setForm(result.patch);
    setSyncMessage('已从 COROS 模拟同步上次跑步数据。');
  }

  async function syncStrength() {
    const result = await syncLatestCorosStrength();
    setForm(result.patch);
    setSyncMessage('已从 COROS 模拟同步上次力量训练数据。');
  }

  async function estimateMeal(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setMealPreview(String(reader.result));
    reader.readAsDataURL(file);

    setMealEstimate('正在使用本地 Ollama 识别饮食图片...');
    try {
      const result = await estimateNutritionFromMealImage(file);
      setForm(result.patch);
      setMealEstimate(`${result.source}：${result.summary}`);
    } catch (error) {
      setMealEstimate(error instanceof Error ? error.message : '本地饮食图片识别失败。');
    } finally {
      input.value = '';
    }
  }

  function importCorosFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = parseCorosTrainingHubCsv(String(reader.result));
        setForm(result.patch);
        setSyncMessage(
          result.activityType === 'strength'
            ? '已从 COROS CSV 导入力量训练记录。'
            : '已从 COROS CSV 导入跑步记录。',
        );
      } catch (error) {
        setSyncMessage(error instanceof Error ? error.message : 'COROS CSV 解析失败。');
      }
    };
    reader.readAsText(file, 'utf-8');
    event.target.value = '';
  }

  function toggleSection(title) {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">今日记录中心</p>
          <h2 className="text-lg font-semibold text-ink">同步、上传或手动补充今天的数据</h2>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        {syncMessage && (
          <div className="rounded-md border border-skysoft bg-skysoft/40 px-3 py-2 text-sm text-slate-700">
            {syncMessage}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <Input label="日期" type="date" value={form.date} onChange={(date) => setForm({ date })} />
        </div>

        <div className="grid gap-2 md:grid-cols-5">
          <ActionButton onClick={syncRunning} label="同步 COROS 跑步" />
          <ActionButton onClick={syncStrength} label="同步 COROS 力量" />
          <CorosFileInput onChange={importCorosFile} />
          <MealImageInput onChange={estimateMeal} />
          <button
            type="button"
            onClick={onResetData}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            title="恢复示例数据"
          >
            <RotateCcw size={16} />
            示例数据
          </button>
        </div>

        <FormSection
          title="跑步记录"
          icon={<Activity size={18} />}
          isOpen={openSections.has('跑步记录')}
          onToggle={() => toggleSection('跑步记录')}
        >
          <Input label="跑步 km" type="number" value={form.runningKm} onChange={(runningKm) => setForm({ runningKm })} />
          <Select label="跑步类型" value={form.runningType} onChange={(runningType) => setForm({ runningType })}>
            <option value="easy">轻松跑</option>
            <option value="tempo">节奏跑</option>
            <option value="long">长距离</option>
            <option value="interval">间歇</option>
            <option value="marathon-pace">马拉松配速跑</option>
            <option value="rest">休息</option>
          </Select>
          <Input label="跑步时长 min" type="number" value={form.runningDurationMin} onChange={(runningDurationMin) => setForm({ runningDurationMin })} />
          <Input label="平均配速 min/km" value={form.runningPace} onChange={(runningPace) => setForm({ runningPace })} />
          <Input label="平均心率 bpm" type="number" value={form.runningAvgHr} onChange={(runningAvgHr) => setForm({ runningAvgHr })} />
          <Input label="步频 spm" type="number" value={form.runningCadence} onChange={(runningCadence) => setForm({ runningCadence })} />
          <Input label="跑步 RPE" type="number" min="1" max="10" value={form.runningRpe} onChange={(runningRpe) => setForm({ runningRpe })} />
          <Input label="跑步备注" value={form.runningNote} onChange={(runningNote) => setForm({ runningNote })} />
          <Input label="疼痛备注" value={form.painNote} onChange={(painNote) => setForm({ painNote })} />
        </FormSection>

        <FormSection
          title="力量训练记录"
          icon={<Dumbbell size={18} />}
          isOpen={openSections.has('力量训练记录')}
          onToggle={() => toggleSection('力量训练记录')}
        >
          <label className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 px-3">
            <input
              type="checkbox"
              checked={form.strengthTrained}
              onChange={(event) => setForm({ strengthTrained: event.target.checked })}
              className="size-4 accent-coral"
            />
            <span className="text-sm text-slate-700">今日力量训练</span>
          </label>
          <Input label="力量主题" value={form.strengthFocus} onChange={(strengthFocus) => setForm({ strengthFocus })} />
          <Input label="力量分钟" type="number" value={form.strengthMinutes} onChange={(strengthMinutes) => setForm({ strengthMinutes })} />
        </FormSection>

        <FormSection
          title="饮食记录"
          icon={<Utensils size={18} />}
          isOpen={openSections.has('饮食记录')}
          onToggle={() => toggleSection('饮食记录')}
        >
          {(mealPreview || mealEstimate) && (
            <div className="grid gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 md:col-span-3">
            {mealPreview && (
              <img src={mealPreview} alt="饮食图片预览" className="h-32 w-full rounded-md object-cover md:w-56" />
            )}
            {mealEstimate && <span className="text-xs leading-5 text-slate-500">{mealEstimate}</span>}
            </div>
          )}
          <Input label="热量 kcal" type="number" value={form.calories} onChange={(calories) => setForm({ calories })} />
          <Input label="蛋白 g" type="number" value={form.protein} onChange={(protein) => setForm({ protein })} />
          <Input label="碳水 g" type="number" value={form.carbs} onChange={(carbs) => setForm({ carbs })} />
          <Input label="饮水 L" type="number" value={form.hydration} onChange={(hydration) => setForm({ hydration })} />
          <Input label="体重 kg" type="number" value={form.weightKg} onChange={(weightKg) => setForm({ weightKg })} />
        </FormSection>

        <FormSection
          title="睡眠记录"
          icon={<Moon size={18} />}
          isOpen={openSections.has('睡眠记录')}
          onToggle={() => toggleSection('睡眠记录')}
        >
          <Input label="睡眠 h" type="number" value={form.sleepHours} onChange={(sleepHours) => setForm({ sleepHours })} />
          <Input label="睡眠质量 1-5" type="number" min="1" max="5" value={form.sleepQuality} onChange={(sleepQuality) => setForm({ sleepQuality })} />
        </FormSection>

        <FormSection
          title="经期记录"
          icon={<CalendarDays size={18} />}
          isOpen={openSections.has('经期记录')}
          onToggle={() => toggleSection('经期记录')}
        >
          <Select label="周期阶段" value={form.cyclePhase} onChange={(cyclePhase) => setForm({ cyclePhase })}>
            <option value="menstruation">经期</option>
            <option value="follicular">卵泡期</option>
            <option value="ovulation">排卵期</option>
            <option value="luteal">黄体期</option>
            <option value="unknown">不确定</option>
          </Select>
          <Input label="周期第几天" type="number" value={form.cycleDay} onChange={(cycleDay) => setForm({ cycleDay })} />
          <Input label="经期症状" value={form.cycleSymptoms} onChange={(cycleSymptoms) => setForm({ cycleSymptoms })} />
        </FormSection>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-moss md:w-fit"
        >
          <Plus size={17} />
          保存记录并生成建议
        </button>
      </form>
    </section>
  );
}

function CorosFileInput({ onChange }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
      <Upload size={16} />
      导入 COROS 文件
      <input type="file" accept=".csv,text/csv" onChange={onChange} className="sr-only" />
    </label>
  );
}

function MealImageInput({ onChange }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
      <ImageUp size={16} />
      上传饮食图片
      <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
    </label>
  );
}

function ActionButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      <Watch size={16} />
      {label}
    </button>
  );
}

function FormSection({ title, icon, isOpen, onToggle, children }) {
  return (
    <fieldset className="border-t border-slate-200 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-base font-semibold text-ink">
          <span className="text-coral">{icon}</span>
          {title}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="mt-3 grid gap-3 md:grid-cols-3">{children}</div>}
    </fieldset>
  );
}

function Input({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="grid gap-1 text-sm text-slate-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-md border border-slate-200 px-3 text-sm text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
        {...props}
      />
    </label>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="grid gap-1 text-sm text-slate-600">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-md border border-slate-200 px-3 text-sm text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
      >
        {children}
      </select>
    </label>
  );
}

function useSimpleForm(defaults) {
  const [form, setState] = useState(defaults);
  const setForm = (patch) => setState((current) => ({ ...current, ...patch }));
  return [form, setForm];
}
