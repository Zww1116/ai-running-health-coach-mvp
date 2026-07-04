import { Moon, Save, Satellite } from 'lucide-react';
import { useState } from 'react';
import { RecordImageUploader } from './RecordImageUploader';
import { initialForm } from './recordFormModel';

const initialSleepForm = {
  date: initialForm.date,
  sleepHours: initialForm.sleepHours,
  deepSleepHours: initialForm.deepSleepHours,
  lightSleepHours: initialForm.lightSleepHours,
  remSleepHours: initialForm.remSleepHours,
  sleepQuality: initialForm.sleepQuality,
  restingHr: initialForm.restingHr,
  hrv: initialForm.hrv,
  wakeFatigue: initialForm.wakeFatigue,
  attachments: [],
};

export function SleepRecoveryPage({ onSaveSleepRecord }) {
  const [form, setForm] = useState(initialSleepForm);
  const [message, setMessage] = useState('');

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function submit(event) {
    event.preventDefault();
    onSaveSleepRecord({
      date: form.date,
      sleep: {
        hours: Number(form.sleepHours),
        deepHours: Number(form.deepSleepHours),
        lightHours: Number(form.lightSleepHours),
        remHours: Number(form.remSleepHours),
        quality: Number(form.sleepQuality),
        restingHr: Number(form.restingHr),
        hrv: Number(form.hrv),
        wakeFatigue: Number(form.wakeFatigue),
      },
      attachments: form.attachments,
    });
    setMessage('睡眠与恢复数据已保存。');
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">睡眠与恢复记录</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">用恢复质量决定今天训练强度</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-500">
          <Satellite size={15} />
          COROS / Terra API 自动同步预留
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        {message && (
          <div className="rounded-md border border-skysoft bg-skysoft/40 px-3 py-2 text-sm text-slate-700">
            {message}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-4">
          <Input label="日期" type="date" value={form.date} onChange={(date) => update({ date })} />
          <Input label="睡眠时长 h" type="number" value={form.sleepHours} onChange={(sleepHours) => update({ sleepHours })} />
          <Input label="深睡时长 h" type="number" value={form.deepSleepHours} onChange={(deepSleepHours) => update({ deepSleepHours })} />
          <Input label="浅睡时长 h" type="number" value={form.lightSleepHours} onChange={(lightSleepHours) => update({ lightSleepHours })} />
          <Input label="REM 时长 h" type="number" value={form.remSleepHours} onChange={(remSleepHours) => update({ remSleepHours })} />
          <Input label="睡眠质量 1-5" type="number" min="1" max="5" value={form.sleepQuality} onChange={(sleepQuality) => update({ sleepQuality })} />
          <Input label="夜间静息心率" type="number" value={form.restingHr} onChange={(restingHr) => update({ restingHr })} />
          <Input label="HRV" type="number" value={form.hrv} onChange={(hrv) => update({ hrv })} />
          <Input label="起床疲劳感 1-10" type="number" min="1" max="10" value={form.wakeFatigue} onChange={(wakeFatigue) => update({ wakeFatigue })} />
        </div>

        <RecordImageUploader
          title="上传 COROS 睡眠截图"
          value={form.attachments}
          defaultType="sleep"
          onChange={(attachments) => update({ attachments })}
        />

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-moss md:w-fit"
        >
          <Save size={17} />
          保存睡眠与恢复记录
        </button>
      </form>
    </section>
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
