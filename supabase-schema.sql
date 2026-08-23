-- LifeOS Database Schema
-- Run this in Supabase → SQL Editor → New query → Paste & Run

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in-progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date timestamptz,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  all_day boolean default false,
  color text default '#6366f1',
  created_at timestamptz default now()
);

-- Notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Goals
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  status text default 'active' check (status in ('active', 'completed', 'paused')),
  target_date timestamptz,
  created_at timestamptz default now()
);

-- Habits
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  frequency text default 'daily' check (frequency in ('daily', 'weekly')),
  streak integer default 0,
  best_streak integer default 0,
  completed_dates text[] default '{}',
  color text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table tasks enable row level security;
alter table events enable row level security;
alter table notes enable row level security;
alter table goals enable row level security;
alter table habits enable row level security;

-- Policies: users can only see/edit their own data
create policy "Users can manage own tasks" on tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own events" on events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own notes" on notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own goals" on goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own habits" on habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
