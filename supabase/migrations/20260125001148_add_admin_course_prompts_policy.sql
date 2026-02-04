-- Add RLS policy for admins to manage course prompts
create policy "Admins can manage course prompts"
  on public.course_prompts for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.is_admin = true
    )
  );
