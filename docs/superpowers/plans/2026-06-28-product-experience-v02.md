# Product Experience v0.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the homepage daily workflow by turning the record area into a compact today record center and making the head coach plan easier to scan.

**Architecture:** Keep the existing React/Vite/Tailwind single-page app and localStorage data flow. Add small UI state to `RecordForm.jsx`, keep form-to-record conversion in `recordFormModel.js`, and add a presentational summary block in `HeadCoachPlan.jsx`.

**Tech Stack:** React 19, Vite 6, Tailwind CSS 3, Vitest, lucide-react.

## Global Constraints

- Do not add real COROS API integration, real image recognition, Supabase, PostgreSQL, or OpenAI calls.
- Keep the existing record data model and `buildRecordFromForm(form)` output compatible with the analysis engine.
- Keep COROS and meal image features as local adapters returning form patches.
- The record center must have five sections: 跑步记录, 力量训练记录, 饮食记录, 睡眠记录, 经期记录.
- Default open sections must be 跑步记录 and 饮食记录.
- Preserve mobile and desktop responsiveness.

---

### Task 1: Record Form Configuration

**Files:**
- Modify: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\src\components\recordFormModel.js`
- Modify: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\src\__tests__\recordFormModel.test.js`

**Interfaces:**
- Produces: `defaultOpenRecordSections: string[]`
- Keeps: `recordSections: Array<{ title: string, fields: string[] }>`
- Keeps: `buildRecordFromForm(form): DailyRecord`

- [ ] **Step 1: Write the failing test**

Add this test to `src/__tests__/recordFormModel.test.js`:

```js
it('defines the default open sections for a compact today record center', () => {
  expect(defaultOpenRecordSections).toEqual(['跑步记录', '饮食记录']);
});
```

Update the import:

```js
import { buildRecordFromForm, defaultOpenRecordSections, recordSections } from '../components/recordFormModel';
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/__tests__/recordFormModel.test.js
```

Expected: FAIL because `defaultOpenRecordSections` is not exported.

- [ ] **Step 3: Write minimal implementation**

Add to `src/components/recordFormModel.js`:

```js
export const defaultOpenRecordSections = ['跑步记录', '饮食记录'];
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/__tests__/recordFormModel.test.js
```

Expected: PASS.

### Task 2: Collapsible Today Record Center

**Files:**
- Modify: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\src\components\RecordForm.jsx`

**Interfaces:**
- Consumes: `defaultOpenRecordSections`
- Keeps: `RecordForm({ onAddRecord, onResetData })`

- [ ] **Step 1: Import section defaults and icons**

Update imports in `RecordForm.jsx`:

```js
import {
  Activity,
  CalendarDays,
  ChevronDown,
  Dumbbell,
  ImageUp,
  Moon,
  Plus,
  RotateCcw,
  Watch,
  Utensils,
} from 'lucide-react';
import { buildRecordFromForm, defaultOpenRecordSections, initialForm } from './recordFormModel';
```

- [ ] **Step 2: Add open section state**

Inside `RecordForm`, after form state:

```js
const [openSections, setOpenSections] = useState(() => new Set(defaultOpenRecordSections));
```

Add helper:

```js
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
```

- [ ] **Step 3: Rename the record area**

Change the header copy:

```jsx
<p className="text-sm text-slate-500">今日记录中心</p>
<h2 className="text-lg font-semibold text-ink">同步、上传或手动补充今天的数据</h2>
```

- [ ] **Step 4: Move quick actions to the top**

After the date input row, add an action row:

```jsx
<div className="grid gap-2 md:grid-cols-4">
  <ActionButton onClick={syncRunning} label="同步 COROS 跑步" />
  <ActionButton onClick={syncStrength} label="同步 COROS 力量" />
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
```

Remove the existing reset button from the header and remove duplicate COROS/action controls inside individual sections.

- [ ] **Step 5: Make sections collapsible**

Replace `FormSection` with:

```jsx
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
```

Update each `FormSection` call:

```jsx
<FormSection
  title="跑步记录"
  icon={<Activity size={18} />}
  isOpen={openSections.has('跑步记录')}
  onToggle={() => toggleSection('跑步记录')}
>
```

Repeat for the other four sections.

- [ ] **Step 6: Add meal image input helper**

Add:

```jsx
function MealImageInput({ onChange }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
      <ImageUp size={16} />
      上传饮食图片
      <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
    </label>
  );
}
```

Keep the image preview and estimate message in the 饮食记录 section, but remove the duplicate file input there.

- [ ] **Step 7: Run build to verify JSX compiles**

Run:

```bash
npm run build
```

Expected: PASS.

### Task 3: Head Coach Today's Focus

**Files:**
- Modify: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\src\components\HeadCoachPlan.jsx`

**Interfaces:**
- Consumes: `report.dailyPlan[0]`
- Keeps: `HeadCoachPlan({ report })`

- [ ] **Step 1: Add compact summary block**

After the header row and before the two-column plan grid, add:

```jsx
{report.dailyPlan[0] && (
  <div className="mt-4 rounded-lg border border-skysoft bg-skysoft/40 p-3">
    <p className="text-xs font-semibold text-slate-500">今日重点</p>
    <p className="mt-1 text-sm leading-6 text-ink">{report.dailyPlan[0]}</p>
  </div>
)}
```

- [ ] **Step 2: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: PASS.

### Task 4: Final Verification

**Files:**
- No code files modified in this task.

**Interfaces:**
- Confirms app remains reachable at `http://127.0.0.1:5173`.

- [ ] **Step 1: Run all tests**

Run:

```bash
npm test
```

Expected: 4 test files and 11 tests pass after Task 1.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: Vite build exits 0.

- [ ] **Step 3: Check local page**

Run:

```powershell
(Invoke-WebRequest -Uri 'http://127.0.0.1:5173' -UseBasicParsing).StatusCode
```

Expected: `200`.

- [ ] **Step 4: Scan for old duplicate controls**

Run:

```bash
rg -n "同步 COROS 跑步|同步 COROS 力量|上传饮食图片|今日记录中心|添加今日数据" src
```

Expected:

- `今日记录中心` appears in `RecordForm.jsx`.
- `同步 COROS 跑步`, `同步 COROS 力量`, and `上传饮食图片` appear once each in `RecordForm.jsx`.
- `添加今日数据` does not appear.

