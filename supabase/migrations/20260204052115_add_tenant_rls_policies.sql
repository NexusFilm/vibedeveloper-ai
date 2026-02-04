-- Enable RLS for tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Enable RLS for tenant members
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships" ON tenant_members
  FOR SELECT USING (auth.uid() = user_id);

-- Tenant admins can view all memberships for their tenant
CREATE POLICY "Tenant admins can view tenant memberships" ON tenant_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members tm 
      WHERE tm.tenant_id = tenant_members.tenant_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Users can view accessible tenants
CREATE POLICY "Users can view accessible tenants" ON tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = tenants.id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Tenant owners can update their tenant
CREATE POLICY "Tenant owners can update tenant" ON tenants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = tenants.id 
      AND tenant_members.user_id = auth.uid() 
      AND tenant_members.role = 'owner'
    )
  );;
