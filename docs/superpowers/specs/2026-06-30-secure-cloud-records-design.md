# Secure Cloud Records Design

## Goal

Build the next stage of the AI health management MVP for serious long-term personal tracking: authenticated cloud records with clear privacy boundaries, while keeping the current local-only mode usable when Supabase is not configured.

## User Outcome

- The user can keep using the public site as the main app URL.
- After signing in with email OTP, records sync to the user's own Supabase account data.
- Each tester/friend/coach who signs in gets their own isolated records.
- If Supabase is not configured, the app remains a localStorage MVP and does not break.
- Sensitive health records are not sent to OpenAI or any third-party AI service in this phase.

## Options Considered

### Option A: Keep localStorage only

Lowest effort and lowest server exposure. It avoids cloud leakage but is not suitable for long-term records because data is tied to one browser and can be lost when cache is cleared.

### Option B: Supabase Auth + Postgres + Row Level Security

Recommended. Supabase provides email OTP login and Postgres Row Level Security. The browser can use a public anon key, but record access is enforced by RLS policies using the authenticated user's id. This gives practical account-based sync without building a custom backend yet.

### Option C: Custom backend API + database

Most control, but too much infrastructure for this stage. It is better later if the platform needs advanced audit logs, encryption envelopes, paid plans, or coach/team permissions.

## Recommended Approach

Use Supabase for authentication and cloud record storage. Keep localStorage as fallback and as a temporary cache. Do not add OpenAI API, cloud image recognition, or coach sharing in this phase.

## Security And Privacy Model

### Data Isolation

All cloud health records must include `user_id`. Database policies must require:

- `select`: authenticated user can read only rows where `user_id = auth.uid()`.
- `insert`: authenticated user can insert only rows where `user_id = auth.uid()`.
- `update`: authenticated user can update only rows where `user_id = auth.uid()`.
- `delete`: authenticated user can delete only rows where `user_id = auth.uid()`.

Supabase documentation says RLS should be enabled on exposed tables and can combine with Supabase Auth for browser-to-database security. It also recommends explicit authentication checks because `auth.uid()` returns `null` when unauthenticated.

### What Is Public

- Frontend code is public on GitHub Pages.
- Supabase URL and anon key are public by design.
- The anon key must not grant data access unless RLS policies allow it.

### What Must Stay Private

- Supabase service role key must never be placed in frontend code, GitHub Pages, or `.env` files committed to git.
- Raw health records must not be logged to analytics, console telemetry, or third-party AI APIs.
- Meal images remain local-only unless the user explicitly approves a future cloud vision provider.

### User Controls

The app should expose:

- Sign in with email OTP.
- Sign out.
- Cloud sync status.
- Export records as JSON.
- Clear local browser data.
- Delete cloud records for the signed-in user.

Full account deletion can be documented as a Supabase dashboard/manual operation for this phase.

## Data Model

Create one Supabase table:

```sql
create table public.health_records (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  record_date date not null,
  record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
```

Why JSONB for `record`:

- The current MVP record shape already exists and changes often.
- It avoids premature schema design across running, strength, nutrition, sleep, cycle, and pain.
- Later stages can promote stable fields into typed columns for reporting.

The `record_date` field is duplicated outside JSON for sorting and filtering.

## Supabase SQL Setup

The project should include a copy-paste SQL file, for example `supabase/schema.sql`:

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

## Frontend Architecture

### New Files

- `src/auth/supabaseAuth.js`: session loading, email OTP sign-in, sign-out, auth state subscription.
- `src/storage/recordRepository.js`: repository factory that chooses local or Supabase storage.
- `src/storage/supabaseRecordStore.js`: async cloud record CRUD against `health_records`.
- `src/storage/exportRecords.js`: JSON export helper.
- `src/components/AuthPanel.jsx`: sign-in/out and sync status UI.
- `src/components/PrivacyPanel.jsx`: export, clear local data, delete cloud records.
- `src/__tests__/supabaseRecordStore.test.js`: tests query shape and user isolation parameters with a fake client.
- `src/__tests__/recordRepository.test.js`: tests local fallback and cloud selection behavior.

### Modified Files

- `package.json`: add `@supabase/supabase-js`.
- `src/integrations/supabaseClient.js`: replace placeholder with safe configured/unconfigured client factory.
- `src/storage/localStore.js`: add `clear()` and optionally async wrappers while preserving current tests.
- `src/App.jsx`: load records asynchronously, show auth/privacy panels, route save/delete through repository.
- `README.md`: document Supabase setup, RLS policies, environment variables, and privacy boundaries.

## Environment Variables

Use Vite variables:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

If either is missing, Supabase mode is disabled and the app uses localStorage only.

No service role key is needed in this frontend app.

## Data Flow

### Unauthenticated Or Unconfigured

1. App starts.
2. Supabase config check fails or no session exists.
3. Records load from localStorage.
4. Saves write only to localStorage.
5. UI labels the mode as local-only.

### Authenticated

1. App starts and detects Supabase session.
2. Records load from `health_records` where RLS limits rows to the signed-in user.
3. Saving a record upserts `{ user_id, id, record_date, record }`.
4. The saved record is also mirrored into localStorage as a convenience cache.
5. Sign out returns the app to local-only mode. It does not automatically delete local cache; the user can clear it.

## Error Handling

- If cloud load fails, keep local records visible and show a non-blocking sync error.
- If cloud save fails, keep the record in localStorage and show that cloud sync failed.
- If email OTP request fails, show the Supabase error message in plain language.
- If Supabase is not configured, hide cloud-only destructive actions and show "local-only mode".

## UI Design

Add a compact account/privacy area near the top of the app:

- Local-only badge when not configured or not signed in.
- Email field and "发送登录验证码" button.
- Signed-in email, "退出登录", and sync status.
- Privacy actions: "导出 JSON", "清除本机数据", "删除云端记录".

Do not turn the product into an admin dashboard. Keep the current training decision cockpit as the main screen.

## Testing Strategy

- Unit-test local fallback without Supabase config.
- Unit-test Supabase store calls with a fake client to verify:
  - reads filter by `user_id`;
  - upsert sends `user_id`;
  - delete only targets current user;
  - missing session fails safely.
- Keep existing agent, parser, and form tests passing.
- Build with Vite after implementation.

## Deployment Notes

GitHub Pages can host the frontend, but environment variables must be available at build time. For GitHub Pages, the GitHub Actions workflow will need repository secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The workflow should pass those values into `npm run build`.

## Non-Goals For This Phase

- No OpenAI API.
- No cloud meal image recognition.
- No coach/team sharing.
- No role-based coach access.
- No payment system.
- No full account deletion automation.
- No medical-grade compliance claim.

## Success Criteria

- A user can sign in with email OTP.
- Signed-in records persist across devices through Supabase.
- Another signed-in user cannot read or mutate those records because of RLS.
- The app still works as localStorage-only when Supabase is not configured.
- The user can export records and clear local browser data.
- Tests and production build pass.
