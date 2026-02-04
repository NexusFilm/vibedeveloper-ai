-- Templates policies (tenant-specific)
CREATE POLICY "Users can view templates in their tenant" ON templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = templates.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Example projects policies
CREATE POLICY "Users can view example projects in their tenant" ON example_projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = example_projects.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- User subscriptions policies
CREATE POLICY "Users can view own subscription in their tenant" ON user_subscriptions
  FOR SELECT USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = user_subscriptions.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own subscription in their tenant" ON user_subscriptions
  FOR UPDATE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = user_subscriptions.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Pricing plans policies
CREATE POLICY "Users can view pricing plans in their tenant" ON pricing_plans
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = pricing_plans.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Discount codes policies
CREATE POLICY "Users can view active discount codes in their tenant" ON discount_codes
  FOR SELECT USING (
    is_active = true AND 
    (expires_at IS NULL OR expires_at > NOW()) AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = discount_codes.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Announcements policies
CREATE POLICY "Users can view active announcements in their tenant" ON announcements
  FOR SELECT USING (
    is_active = true AND 
    (expires_at IS NULL OR expires_at > NOW()) AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = announcements.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );;
