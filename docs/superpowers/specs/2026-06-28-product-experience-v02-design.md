# Product Experience v0.2 Design

## Goal

Improve the MVP product experience for daily use without changing storage, AI integrations, or the core record data model.

## Scope

This version focuses on the homepage workflow used by a female marathon-oriented runner:

- Make the record area feel like a "today record center".
- Reduce visible form length on mobile and desktop.
- Keep COROS sync and meal image estimation easy to find.
- Make the head coach output scannable before the detailed daily and weekly plan.

This version does not add real COROS API integration, real image recognition, Supabase, PostgreSQL, or OpenAI calls.

## User Experience

The record area will be renamed from "添加今日数据" to "今日记录中心".

The top of the record area will contain:

- Date input.
- A COROS running sync action.
- A COROS strength sync action.
- A meal image upload action.
- The existing sample-data reset action.

The five record groups will become collapsible panels:

- 跑步记录
- 力量训练记录
- 饮食记录
- 睡眠记录
- 经期记录

Default open panels:

- 跑步记录
- 饮食记录

Default closed panels:

- 力量训练记录
- 睡眠记录
- 经期记录

Each panel keeps its existing fields. The running panel keeps marathon-focused fields and only one pain note field. The nutrition panel keeps the meal image preview and simulated nutrition estimate feedback.

## Head Coach Summary

The head coach card will add a compact "今日重点" row near the top. It will surface the first daily recommendation as a short summary before showing the full daily and weekly lists.

The existing daily and weekly plan arrays remain unchanged.

## Data Flow

The existing `RecordForm` still owns form state and calls `onAddRecord(buildRecordFromForm(form))` on submit.

The existing localStorage flow remains unchanged:

- `App.jsx` loads records through `createBrowserStorageAdapter`.
- `RecordForm` submits one complete daily record.
- `App.jsx` replaces same-date records and persists to localStorage.

The COROS and meal image features remain local adapters:

- `syncLatestCorosRunning()`
- `syncLatestCorosStrength()`
- `estimateNutritionFromMealImage(file)`

## Components

Modify `src/components/RecordForm.jsx`:

- Add a compact action bar.
- Add reusable collapsible section behavior.
- Keep existing `Input`, `Select`, and `ActionButton` style conventions.

Modify `src/components/HeadCoachPlan.jsx`:

- Add a "今日重点" summary block using `report.dailyPlan[0]`.

Modify or add tests:

- Confirm record form configuration defines the five sections and default open panels.
- Keep existing adapter and record conversion tests.

## Verification

Run:

- `npm test`
- `npm run build`
- HTTP check for `http://127.0.0.1:5173`

Success means tests pass, production build succeeds, and the local page remains reachable.
