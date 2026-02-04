create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Enable Row Level Security
alter table public.profiles enable row level security;
-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);
