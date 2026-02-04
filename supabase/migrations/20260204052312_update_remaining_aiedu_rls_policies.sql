-- Course prompts policies
DROP POLICY IF EXISTS "Users can view course prompts" ON course_prompts;
DROP POLICY IF EXISTS "Admins can manage course prompts" ON course_prompts;

CREATE POLICY "Users can view course prompts in their tenant" ON course_prompts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = course_prompts.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- User course progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_course_progress;

CREATE POLICY "Users can view own progress in tenant" ON user_course_progress
  FOR SELECT USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = user_course_progress.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own progress in tenant" ON user_course_progress
  FOR ALL USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = user_course_progress.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

-- Prompt conversations policies
DROP POLICY IF EXISTS "Users can view own conversations" ON prompt_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON prompt_conversations;

CREATE POLICY "Users can view own conversations in tenant" ON prompt_conversations
  FOR SELECT USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = prompt_conversations.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own conversations in tenant" ON prompt_conversations
  FOR ALL USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = prompt_conversations.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );;
