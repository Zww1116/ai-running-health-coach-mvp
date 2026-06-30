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
