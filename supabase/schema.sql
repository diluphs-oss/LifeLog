-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Daily log: one row per day
create table daily_log (
  id uuid primary key default gen_random_uuid(),
  log_date date not null unique,
  punch_in timestamptz,
  punch_out timestamptz,
  woke_up_at time,
  tasks text,          -- newline separated, or switch to jsonb later
  ideas text,
  meals text,
  notes text,
  created_at timestamptz default now()
);

-- Lunch receipts (linked to a day, tracks the €12 allowance)
create table receipts (
  id uuid primary key default gen_random_uuid(),
  log_date date not null references daily_log(log_date) on delete cascade,
  amount numeric(6,2) not null,
  photo_url text,       -- Supabase Storage public/signed URL
  note text,
  created_at timestamptz default now()
);

-- To-dos and reminders
create table todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  done boolean default false,
  due_date date,
  reminder_at timestamptz,
  category text default 'work',  -- work / personal
  created_at timestamptz default now()
);

-- Expenses & salary
create table expenses (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  type text not null,       -- 'expense' or 'income'
  category text,
  amount numeric(10,2) not null,
  note text,
  created_at timestamptz default now()
);

-- Wishlist (love to buy)
create table wishlist (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  price numeric(10,2),
  bought boolean default false,
  created_at timestamptz default now()
);

-- Movies watched
create table movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  watched_date date,
  rating int,
  note text,
  created_at timestamptz default now()
);

-- Useful links (YouTube playlists, cinematography/editing resources)
create table links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  category text default 'youtube', -- youtube / article / tool
  created_at timestamptz default now()
);

-- Documents vault (metadata only; actual files live in Supabase Storage or Google Drive)
create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text,
  category text,          -- id, insurance, contract, etc.
  created_at timestamptz default now()
);

-- Possible allergy tracking (tag meals that caused reactions)
create table symptoms (
  id uuid primary key default gen_random_uuid(),
  log_date date not null,
  food text,
  symptom text,
  severity int,
  created_at timestamptz default now()
);

-- Row Level Security: since this is single-user, simplest is to disable RLS
-- and rely on Supabase's anon key never being exposed publicly beyond your app.
-- For better security later, enable RLS + Supabase Auth and scope rows by user_id.
alter table daily_log enable row level security;
alter table receipts enable row level security;
alter table todos enable row level security;
alter table expenses enable row level security;
alter table wishlist enable row level security;
alter table movies enable row level security;
alter table links enable row level security;
alter table documents enable row level security;
alter table symptoms enable row level security;

-- Single-user policy: allow all operations for authenticated users
create policy "Allow all for authenticated" on daily_log for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on receipts for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on todos for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on expenses for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on wishlist for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on movies for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on links for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on documents for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on symptoms for all using (auth.role() = 'authenticated');
