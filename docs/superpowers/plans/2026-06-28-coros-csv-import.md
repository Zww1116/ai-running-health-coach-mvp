# COROS CSV Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users upload COROS Training Hub CSV exports and auto-fill running or strength record fields without using the COROS API.

**Architecture:** Add a browser-side parser in `src/integrations/corosFileParser.js`, keep it independent from React, and wire it into `RecordForm.jsx` through a hidden file input button. The parser returns the same form patch shape used by existing COROS mock sync functions.

**Tech Stack:** React 19, Vite 6, Vitest, browser FileReader, local JavaScript CSV parsing.

## Global Constraints

- Do not add COROS API integration.
- Do not add GPX or FIT parsing in this version.
- Do not add backend code or new npm dependencies.
- Keep all parsed values editable in the existing form.
- Keep existing mock COROS sync buttons.

---

### Task 1: CSV Parser

**Files:**
- Create: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\src\integrations\corosFileParser.js`
- Modify: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\src\__tests__\dataImportAdapters.test.js`

**Interfaces:**
- Produces: `parseCorosTrainingHubCsv(csvText): { source: string, activityType: 'running' | 'strength', patch: object }`

Steps:

- [ ] Add failing tests for a running CSV and a strength CSV.
- [ ] Run `npm test -- src/__tests__/dataImportAdapters.test.js` and confirm parser import fails.
- [ ] Implement CSV parsing, header aliases, latest-row selection, and form patch mapping.
- [ ] Run the target test and confirm it passes.

### Task 2: Record Form Integration

**Files:**
- Modify: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\src\components\RecordForm.jsx`

**Interfaces:**
- Consumes: `parseCorosTrainingHubCsv(csvText)`

Steps:

- [ ] Import the parser and `Upload` icon.
- [ ] Add `importCorosFile(event)` using `FileReader.readAsText`.
- [ ] Add `CorosFileInput` helper with label `导入 COROS 文件`.
- [ ] Add the upload action to the top action grid.
- [ ] Run `npm run build`.

### Task 3: Documentation And Verification

**Files:**
- Modify: `D:\ChatGPT-AI资料文件夹\智能运动+健康教练管理系统2\README.md`

Steps:

- [ ] Document CSV import as the no-API COROS path.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Check `http://127.0.0.1:5173` returns 200.
