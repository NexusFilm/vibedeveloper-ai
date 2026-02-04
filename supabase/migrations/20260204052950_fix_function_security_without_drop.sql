-- Fix security issues with functions by recreating with proper search_path

-- Function to get user's current tenant context
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  -- This would typically be set by your application context
  -- For now, return the first tenant the user belongs to
  RETURN (
    SELECT tenant_id 
    FROM tenant_members 
    WHERE user_id = auth.uid() 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Function to check if user has access to tenant
CREATE OR REPLACE FUNCTION user_has_tenant_access(tenant_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenant_members 
    WHERE tenant_id = tenant_uuid 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Function to get tenant by domain/subdomain
CREATE OR REPLACE FUNCTION get_tenant_by_domain(domain_name TEXT)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM tenants 
    WHERE domain = domain_name 
    OR subdomain = domain_name 
    OR slug = domain_name
    AND is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to create tenant with owner
CREATE OR REPLACE FUNCTION create_tenant_with_owner(
  tenant_name TEXT,
  tenant_slug TEXT,
  owner_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  -- Insert tenant
  INSERT INTO tenants (name, slug)
  VALUES (tenant_name, tenant_slug)
  RETURNING id INTO new_tenant_id;
  
  -- Add owner to tenant
  INSERT INTO tenant_members (tenant_id, user_id, role)
  VALUES (new_tenant_id, owner_user_id, 'owner');
  
  RETURN new_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;;
