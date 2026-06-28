# Local Ollama Nutrition Recognition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mock meal image estimate with a local Ollama vision workflow that needs no OpenAI API key.

**Architecture:** The React app converts the selected meal image to a data URL and posts JSON to `/api/nutrition/estimate`. Vite proxies `/api` to a small Node HTTP server, which calls Ollama on `127.0.0.1:11434`, parses the model JSON, and returns a form patch.

**Tech Stack:** React, Vite proxy, Node built-in `http`, Ollama vision model, Vitest.

## Global Constraints

- Do not add cloud API keys or OpenAI API requirements.
- Keep the uploaded image local to the user's machine.
- Keep manual correction in the form because nutrition recognition is an estimate.
- Avoid new npm dependencies for the MVP.

---

### Task 1: Ollama Nutrition Parser

**Files:**
- Create: `server/ollamaNutrition.js`
- Modify: `src/__tests__/dataImportAdapters.test.js`

**Interfaces:**
- Produces: `parseOllamaNutritionResponse(content)`, `normalizeNutritionEstimate(raw, fileName)`, and `buildOllamaNutritionRequest({ imageBase64, mimeType, model })`.

- [ ] **Step 1: Write failing tests** for fenced JSON parsing, normalized form patch, and request shape.
- [ ] **Step 2: Run tests** with `npm test` and verify the missing module failure.
- [ ] **Step 3: Implement the parser helpers** in `server/ollamaNutrition.js`.
- [ ] **Step 4: Run tests** and verify the new tests pass.

### Task 2: Local API Service And Frontend Upload

**Files:**
- Create: `server/index.js`
- Modify: `src/integrations/nutritionVisionClient.js`
- Modify: `src/components/RecordForm.jsx`
- Modify: `vite.config.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: parser helpers from Task 1.
- Produces: `POST /api/nutrition/estimate` and async `estimateNutritionFromMealImage(file)`.

- [ ] **Step 1: Add the Node server** with a single JSON route and Ollama error responses.
- [ ] **Step 2: Add the Vite proxy** for `/api`.
- [ ] **Step 3: Change the frontend client** to POST the base64 image.
- [ ] **Step 4: Change `RecordForm`** to show loading, success, or failure text.
- [ ] **Step 5: Add `npm run server`** for the local API.

### Task 3: Docs And Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document Ollama setup** with `ollama pull qwen2.5vl`, `ollama serve`, `npm run server`, and `npm run dev`.
- [ ] **Step 2: Run `npm test`** and verify all tests pass.
- [ ] **Step 3: Run `npm run build`** and verify the production build succeeds.
- [ ] **Step 4: Check the dev page** still responds at `http://127.0.0.1:5173`.
