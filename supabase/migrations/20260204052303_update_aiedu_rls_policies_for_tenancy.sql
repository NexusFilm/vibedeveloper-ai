-- Drop existing policies and create tenant-aware ones for AI Edu tables

-- Users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can view own profile in tenant" ON users
  FOR SELECT USING (
    auth.uid() = id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = users.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile in tenant" ON users
  FOR UPDATE USING (
    auth.uid() = id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = users.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Courses table policies
DROP POLICY IF EXISTS "Users can view courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;

CREATE POLICY "Users can view courses in their tenant" ON courses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = courses.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage courses in their tenant" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = courses.tenant_id 
      AND tenant_members.user_id = auth.uid() 
      AND tenant_members.role IN ('owner', 'admin')
    )
  );;
