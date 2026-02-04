-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by TEXT,
  
  -- Project details
  title TEXT,
  description TEXT,
  prompt TEXT,
  refined_prompt TEXT,
  
  -- Wizard step data
  person_data JSONB,
  problem_data JSONB,
  plan_data JSONB,
  pivot_data JSONB,
  payoff_data JSONB,
  
  -- Wireframe and technical data
  wireframe_data JSONB,
  components JSONB,
  pages JSONB,
  
  -- Status and metadata
  status TEXT DEFAULT 'draft',
  tags TEXT[],
  
  -- Timestamps
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_date ON projects(created_date DESC);
CREATE INDEX idx_projects_status ON projects(status);;
