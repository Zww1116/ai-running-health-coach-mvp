# Frontend Workbench Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the MVP feel like a daily AI health command center instead of a stacked prototype page.

**Architecture:** Keep existing React components and data flow. Refine layout hierarchy in `App.jsx`, make `HeadCoachPlan` the primary decision card, and make `RuleAgentAnalysis` a compact always-visible Agent console with manual regenerate.

**Tech Stack:** React, Vite, Tailwind, lucide-react.

## Global Constraints

- Do not change storage, Agent rules, COROS import, or local Ollama integration behavior.
- Keep the UI mobile-first and desktop-friendly.
- Use existing Tailwind tokens and lucide icons.
- Keep cards at 8px radius or less.

---

### Task 1: Workbench Layout

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/WeeklyOverview.jsx`
- Modify: `src/components/MetricTile.jsx`

**Steps:**
- [ ] Compress the hero header and make the product name, status badges, and image fit better on mobile and desktop.
- [ ] Keep the metric strip immediately under the hero.
- [ ] Make metric tiles more stable with minimum heights and consistent typography.
- [ ] Verify with `npm run build`.

### Task 2: Decision And Agent Cards

**Files:**
- Modify: `src/components/HeadCoachPlan.jsx`
- Modify: `src/components/RuleAgentAnalysis.jsx`

**Steps:**
- [ ] Rename the primary total coach surface into a daily decision card.
- [ ] Show the first daily action as the strongest visual item.
- [ ] Generate rule Agent analysis by default, with a regenerate button.
- [ ] Show total coach Agent output before specialist cards.
- [ ] Keep specialist cards readable on mobile and desktop.

### Task 3: Verification

**Files:**
- No production files.

**Steps:**
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Use the browser to inspect desktop and mobile views.
