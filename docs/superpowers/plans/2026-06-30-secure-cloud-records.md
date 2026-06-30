# Secure Cloud Records Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional Supabase email login and per-user cloud health record sync with localStorage fallback and user privacy controls.

**Architecture:** Keep the current React app as a public static frontend. Add an async repository layer that uses localStorage when Supabase is unavailable or the user is signed out, and uses Supabase Auth plus a `health_records` table when a session exists. Database privacy is enforced by Supabase Row Level Security, not by hiding frontend code.

**Tech Stack:** React 19, Vite 6, Tailwind, Vitest, Supabase JS client, Supabase Auth, Postgres JSONB, Row Level Security.

## Global Constraints

- Current MVP must still work without Supabase configuration.
- No OpenAI API in this phase.
- No cloud meal image recognition in this phase.
- Supabase service role key must never be used in frontend code.
- Cloud records must be scoped by `user_id`.
- Signed-out users must remain localStorage-only.
- GitHub Pages build must accept `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as optional build-time variables.

---

## File Structure

- Create `supabase/schema.sql`: copy-paste Supabase table and RLS policy setup.
- Modify `package.json` and `package-lock.json`: add `@supabase/supabase-js`.
- Modify `src/integrations/supabaseClient.js`: create configured/unconfigured Supabase client helpers.
- Modify `src/storage/localStore.js`: add `clear()` while preserving sync local adapter behavior.
- Create `src/storage/supabaseRecordStore.js`: async cloud CRUD functions.
- Create `src/storage/recordRepository.js`: chooses cloud or local mode and mirrors cloud saves locally.
- Create `src/storage/exportRecords.js`: browser JSON export helpers.
- Create `src/auth/supabaseAuth.js`: auth session and email OTP helpers.
- Create `src/components/AuthPanel.jsx`: login/logout/sync status panel.
- Create `src/components/PrivacyPanel.jsx`: export, clear local, delete cloud controls.
- Modify `src/App.jsx`: use async repository and render auth/privacy panels.
- Modify `.github/workflows/deploy-github-pages.yml`: pass optional Supabase env vars into the build.
- Modify `README.md`: document Supabase setup and privacy model.
- Add tests in `src/__tests__/supabaseRecordStore.test.js`, `src/__tests__/recordRepository.test.js`, and update `src/__tests__/localStore.test.js`.

---

### Task 1: Supabase Schema And Dependency

**Files:**
- Create: `supabase/schema.sql`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces SQL table `public.health_records`.
- Produces available package import `@supabase/supabase-js`.

- [ ] **Step 1: Install Supabase JS**

Run:

```bash
npm install @supabase/supabase-js
```

Expected: `package.json` and `package-lock.json` include `@supabase/supabase-js`.

- [ ] **Step 2: Add schema SQL**

Create `supabase/schema.sql` with:

```sql
create table if not exists public.health_records (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  record_date date not null,
  record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.health_records enable row level security;

create policy "Users can read own health records"
on public.health_records
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can insert own health records"
on public.health_records
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can update own health records"
on public.health_records
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can delete own health records"
on public.health_records
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);
```

- [ ] **Step 3: Verify install**

Run:

```bash
npm test
```

Expected: existing tests pass before storage changes.

---

### Task 2: Local And Cloud Storage Core

**Files:**
- Modify: `src/storage/localStore.js`
- Create: `src/storage/supabaseRecordStore.js`
- Create: `src/storage/recordRepository.js`
- Test: `src/__tests__/localStore.test.js`
- Test: `src/__tests__/supabaseRecordStore.test.js`
- Test: `src/__tests__/recordRepository.test.js`

**Interfaces:**
- Produces `createSupabaseRecordStore({ client, getUser })`.
- Produces `createRecordRepository({ localStore, cloudStore, getSession })`.
- Produces repository methods: `load()`, `save(records)`, `deleteCloudRecords()`, `clearLocal()`, `mode()`.

- [ ] **Step 1: Write failing local clear test**

Add to `src/__tests__/localStore.test.js`:

```js
it('clears saved records for the configured key', () => {
  const memory = new Map();
  const adapter = createStorageAdapter({
    storage: {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => memory.set(key, value),
      removeItem: (key) => memory.delete(key),
    },
    key: 'test-records',
    fallback: [{ id: 'sample' }],
  });

  adapter.save([{ id: 'today' }]);
  adapter.clear();

  expect(adapter.load()).toEqual([{ id: 'sample' }]);
});
```

Run:

```bash
npm test -- src/__tests__/localStore.test.js
```

Expected: fail because `adapter.clear` is not defined.

- [ ] **Step 2: Implement `clear()`**

Update `createStorageAdapter`:

```js
clear() {
  storage.removeItem(key);
}
```

Run:

```bash
npm test -- src/__tests__/localStore.test.js
```

Expected: pass.

- [ ] **Step 3: Write failing Supabase store tests**

Create `src/__tests__/supabaseRecordStore.test.js` with tests for:

```js
import { describe, expect, it } from 'vitest';
import { createSupabaseRecordStore } from '../storage/supabaseRecordStore';

function createFakeClient({ selectRows = [], error = null } = {}) {
  const calls = [];
  const query = {
    select: (columns) => {
      calls.push(['select', columns]);
      return query;
    },
    eq: (column, value) => {
      calls.push(['eq', column, value]);
      return query;
    },
    order: (column, options) => {
      calls.push(['order', column, options]);
      return Promise.resolve({ data: selectRows, error });
    },
    upsert: (rows, options) => {
      calls.push(['upsert', rows, options]);
      return Promise.resolve({ error });
    },
    delete: () => {
      calls.push(['delete']);
      return query;
    },
  };

  return {
    calls,
    from: (table) => {
      calls.push(['from', table]);
      return query;
    },
  };
}

describe('supabase record store', () => {
  it('loads only records for the signed-in user', async () => {
    const client = createFakeClient({
      selectRows: [{ id: '2026-06-30', record: { id: '2026-06-30', date: '2026-06-30' } }],
    });
    const store = createSupabaseRecordStore({
      client,
      getUser: async () => ({ id: 'user-1' }),
    });

    await expect(store.load()).resolves.toEqual([{ id: '2026-06-30', date: '2026-06-30' }]);
    expect(client.calls).toContainEqual(['eq', 'user_id', 'user-1']);
  });

  it('upserts records with the signed-in user id', async () => {
    const client = createFakeClient();
    const store = createSupabaseRecordStore({
      client,
      getUser: async () => ({ id: 'user-1' }),
    });

    await store.save([{ id: 'today', date: '2026-06-30' }]);

    expect(client.calls).toContainEqual([
      'upsert',
      [{ id: 'today', user_id: 'user-1', record_date: '2026-06-30', record: { id: 'today', date: '2026-06-30' } }],
      { onConflict: 'user_id,id' },
    ]);
  });
});
```

Run:

```bash
npm test -- src/__tests__/supabaseRecordStore.test.js
```

Expected: fail because `supabaseRecordStore.js` does not exist.

- [ ] **Step 4: Implement Supabase store**

Create `src/storage/supabaseRecordStore.js`:

```js
const TABLE = 'health_records';

async function requireUser(getUser) {
  const user = await getUser();
  if (!user?.id) {
    throw new Error('需要登录后才能同步云端记录。');
  }
  return user;
}

export function createSupabaseRecordStore({ client, getUser }) {
  return {
    async load() {
      const user = await requireUser(getUser);
      const { data, error } = await client
        .from(TABLE)
        .select('id, record, record_date, updated_at')
        .eq('user_id', user.id)
        .order('record_date', { ascending: true });

      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => row.record);
    },

    async save(records) {
      const user = await requireUser(getUser);
      const rows = records.map((record) => ({
        id: record.id,
        user_id: user.id,
        record_date: record.date,
        record,
      }));
      const { error } = await client.from(TABLE).upsert(rows, { onConflict: 'user_id,id' });
      if (error) throw new Error(error.message);
    },

    async deleteAll() {
      const user = await requireUser(getUser);
      const { error } = await client.from(TABLE).delete().eq('user_id', user.id);
      if (error) throw new Error(error.message);
    },
  };
}
```

Run:

```bash
npm test -- src/__tests__/supabaseRecordStore.test.js
```

Expected: pass.

- [ ] **Step 5: Write failing repository tests**

Create `src/__tests__/recordRepository.test.js` with tests for local fallback and cloud mirroring.

Run:

```bash
npm test -- src/__tests__/recordRepository.test.js
```

Expected: fail because `recordRepository.js` does not exist.

- [ ] **Step 6: Implement repository**

Create `src/storage/recordRepository.js` with `load`, `save`, `deleteCloudRecords`, `clearLocal`, and `mode` methods.

Run:

```bash
npm test -- src/__tests__/recordRepository.test.js src/__tests__/localStore.test.js src/__tests__/supabaseRecordStore.test.js
```

Expected: pass.

---

### Task 3: Supabase Client And Auth Helpers

**Files:**
- Modify: `src/integrations/supabaseClient.js`
- Create: `src/auth/supabaseAuth.js`
- Test: `src/__tests__/supabaseClient.test.js`

**Interfaces:**
- Produces `getSupabaseConfig(env)`.
- Produces `createOptionalSupabaseClient(env)`.
- Produces auth helpers `getCurrentSession(client)`, `sendLoginOtp(client, email)`, `signOut(client)`, `subscribeToAuth(client, callback)`.

- [ ] **Step 1: Write failing config tests**

Create `src/__tests__/supabaseClient.test.js` to verify missing env returns unconfigured and complete env returns configured metadata.

- [ ] **Step 2: Implement Supabase client helper**

Use `createClient` from `@supabase/supabase-js`; return `{ client: null, status: 'not_configured' }` when env is incomplete.

- [ ] **Step 3: Verify**

Run:

```bash
npm test -- src/__tests__/supabaseClient.test.js
```

Expected: pass.

---

### Task 4: App Integration And Privacy UI

**Files:**
- Create: `src/components/AuthPanel.jsx`
- Create: `src/components/PrivacyPanel.jsx`
- Create: `src/storage/exportRecords.js`
- Modify: `src/App.jsx`

**Interfaces:**
- `AuthPanel` props: `authState`, `syncState`, `onSendOtp(email)`, `onSignOut()`.
- `PrivacyPanel` props: `records`, `mode`, `onExport()`, `onClearLocal()`, `onDeleteCloud()`.

- [ ] **Step 1: Write export helper test**

Create `src/__tests__/exportRecords.test.js` for serializing records to a timestamped JSON blob payload.

- [ ] **Step 2: Implement export helper**

Create `createRecordsExport({ records, now })` returning `{ filename, json }`.

- [ ] **Step 3: Build UI components**

Add compact account and privacy panels above the main dashboard content.

- [ ] **Step 4: Convert App to async repository**

Load session and records in effects. Save through repository on record changes. Keep `sampleRecords` fallback.

- [ ] **Step 5: Verify app integration**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and Vite build succeeds.

---

### Task 5: Deployment And Documentation

**Files:**
- Modify: `.github/workflows/deploy-github-pages.yml`
- Modify: `README.md`

**Interfaces:**
- GitHub Actions build receives optional Supabase env variables.
- README includes setup steps, SQL copy-paste path, and privacy boundaries.

- [ ] **Step 1: Update GitHub Pages workflow**

Add to the build step env:

```yaml
VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

- [ ] **Step 2: Update README**

Document:

- Supabase project creation.
- SQL in `supabase/schema.sql`.
- GitHub repository secrets.
- localStorage fallback.
- RLS privacy boundary.
- What is not protected by this phase.

- [ ] **Step 3: Final verification**

Run:

```bash
npm test
npm run build
git status --short
```

Expected: tests pass, build succeeds, only planned files changed.
