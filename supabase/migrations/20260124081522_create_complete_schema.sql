-- Create skill_level enum
create type skill_level as enum ('beginner', 'intermediate', 'advanced');
-- Create difficulty enum
create type difficulty as enum ('beginner', 'intermediate', 'advanced');
-- Create message_role enum
create type message_role as enum ('user', 'assistant');
-- Users table (extends auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  skill_level skill_level default 'beginner',
  display_name text,
  created_at timestamptz default now()
);
-- Courses table
create table public.courses (
  id text primary key,
  title text not null,
  description text not null,
  difficulty difficulty not null,
  total_prompts int not null default 0,
  cover_image text,
  created_at timestamptz default now()
);
-- Course prompts table
create table public.course_prompts (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  module_name text not null,
  prompt_order int not null,
  prompt_text text not null,
  learning_goal text not null,
  estimated_time_minutes int not null,
  tips text[] default '{}',
  resources jsonb default '[]',
  created_at timestamptz default now(),
  unique(course_id, prompt_order)
);
-- User course progress table
create table public.user_course_progress (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  current_prompt_order int not null default 1,
  completed_prompts int[] default '{}',
  total_time_spent_minutes int default 0,
  started_at timestamptz default now(),
  last_active timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);
-- Prompt conversations table
create table public.prompt_conversations (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  prompt_order int not null,
  messages jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_id, prompt_order)
);
-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.course_prompts enable row level security;
alter table public.user_course_progress enable row level security;
alter table public.prompt_conversations enable row level security;
-- RLS Policies for users
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);
create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);
-- RLS Policies for courses (public read)
create policy "Courses are viewable by everyone"
  on public.courses for select
  using (true);
-- RLS Policies for course_prompts (public read)
create policy "Course prompts are viewable by everyone"
  on public.course_prompts for select
  using (true);
-- RLS Policies for user_course_progress
create policy "Users can view their own progress"
  on public.user_course_progress for select
  using (auth.uid() = user_id);
create policy "Users can insert their own progress"
  on public.user_course_progress for insert
  with check (auth.uid() = user_id);
create policy "Users can update their own progress"
  on public.user_course_progress for update
  using (auth.uid() = user_id);
-- RLS Policies for prompt_conversations
create policy "Users can view their own conversations"
  on public.prompt_conversations for select
  using (auth.uid() = user_id);
create policy "Users can insert their own conversations"
  on public.prompt_conversations for insert
  with check (auth.uid() = user_id);
create policy "Users can update their own conversations"
  on public.prompt_conversations for update
  using (auth.uid() = user_id);
-- Create indexes for better performance
create index idx_course_prompts_course_id on public.course_prompts(course_id);
create index idx_user_course_progress_user_id on public.user_course_progress(user_id);
create index idx_user_course_progress_course_id on public.user_course_progress(course_id);
create index idx_prompt_conversations_user_id on public.prompt_conversations(user_id);
create index idx_prompt_conversations_course_id on public.prompt_conversations(course_id);
-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;
-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
-- Trigger for prompt_conversations updated_at
create trigger update_prompt_conversations_updated_at
  before update on public.prompt_conversations
  for each row execute function public.update_updated_at_column();
