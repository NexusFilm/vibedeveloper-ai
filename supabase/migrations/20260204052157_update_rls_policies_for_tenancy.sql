-- Drop existing policies that don't consider tenancy
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON templates;

-- Create tenant-aware policies for projects
CREATE POLICY "Users can view own projects in their tenant" ON projects
  FOR SELECT USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = projects.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert projects in their tenant" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = projects.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own projects in their tenant" ON projects
  FOR UPDATE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = projects.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own projects in their tenant" ON projects
  FOR DELETE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = projects.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Enable RLS for new tables
ALTER TABLE example_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;;
