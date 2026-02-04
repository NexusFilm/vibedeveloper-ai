-- Add admin role to users table
alter table public.users add column if not exists is_admin boolean default false;
-- Make derric.chambers@gmail.com an admin
update public.users set is_admin = true where email = 'derric.chambers@gmail.com';
-- Add full_name field
alter table public.users add column if not exists full_name text;
-- Update courses table to remove emoji, add icon
alter table public.courses drop column if exists cover_image;
alter table public.courses add column if not exists icon_name text;
alter table public.courses add column if not exists color text;
-- Add created_by to track who created the course
alter table public.courses add column if not exists created_by uuid references public.users(id);
-- RLS policy for admin
create policy "Admins can manage courses"
  on public.courses for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.is_admin = true
    )
  );
