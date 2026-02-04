# Supabase Database Schema

## SQL Setup Script

Run this in your Supabase SQL Editor to set up all required tables.

\`\`\`sql
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
CREATE INDEX idx_projects_status ON projects(status);

-- ============================================
-- TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  prompt_template TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for templates (public read)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read templates
CREATE POLICY "Templates are viewable by everyone" ON templates
  FOR SELECT USING (true);

-- Only admins can modify (you'll need to add admin role logic)
-- For now, using service role key to insert/update templates

-- ============================================
-- EXAMPLE PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS example_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  tags TEXT[],
  demo_url TEXT,
  source_code_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for example projects
ALTER TABLE example_projects ENABLE ROW LEVEL SECURITY;

-- Anyone can read examples
CREATE POLICY "Examples are viewable by everyone" ON example_projects
  FOR SELECT USING (true);

-- ============================================
-- USER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  
  -- Stripe data
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  
  -- Plan details
  plan_name TEXT,
  plan_tier TEXT, -- 'free', 'pro', 'enterprise'
  status TEXT, -- 'active', 'canceled', 'past_due'
  
  -- Limits and usage
  projects_limit INTEGER DEFAULT 3,
  projects_used INTEGER DEFAULT 0,
  
  -- Billing dates
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own subscription
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Index for subscriptions
CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);

-- ============================================
-- PRICING PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  
  -- Features
  features JSONB,
  projects_limit INTEGER,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Display order
  sort_order INTEGER DEFAULT 0,
  
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for pricing plans
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Anyone can read pricing plans
CREATE POLICY "Pricing plans are viewable by everyone" ON pricing_plans
  FOR SELECT USING (is_active = true);

-- ============================================
-- DISCOUNT CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER,
  discount_amount DECIMAL(10,2),
  max_uses INTEGER,
  times_used INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for discount codes
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read active discount codes
CREATE POLICY "Active discount codes are viewable" ON discount_codes
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT, -- 'info', 'warning', 'success', 'error'
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Anyone can read active announcements
CREATE POLICY "Active announcements are viewable" ON announcements
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_date automatically
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for projects
CREATE TRIGGER update_projects_updated_date BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

-- Trigger for user_subscriptions
CREATE TRIGGER update_subscriptions_updated_date BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Insert sample pricing plans
INSERT INTO pricing_plans (name, description, price_monthly, price_yearly, projects_limit, features, sort_order, is_popular) VALUES
('Free', 'Perfect for trying out VibeDeveloper AI', 0, 0, 3, 
 '["3 projects", "Basic AI assistance", "Community support"]', 1, false),
('Pro', 'For serious developers', 29, 290, 50, 
 '["50 projects", "Advanced AI models", "Priority support", "Export to code", "Team collaboration"]', 2, true),
('Enterprise', 'For teams and organizations', 99, 990, 999, 
 '["Unlimited projects", "Custom AI training", "24/7 support", "White label", "API access", "Advanced analytics"]', 3, false);

-- Insert sample templates
INSERT INTO templates (name, description, category, prompt_template, tags, is_featured) VALUES
('E-commerce Store', 'Complete online store with shopping cart', 'Business', 
 'Create a modern e-commerce platform with product listings, shopping cart, and checkout', 
 ARRAY['ecommerce', 'shopping', 'business'], true),
('SaaS Dashboard', 'Analytics dashboard for SaaS applications', 'Business',
 'Build a comprehensive SaaS dashboard with analytics, user management, and billing',
 ARRAY['saas', 'dashboard', 'analytics'], true),
('Landing Page', 'Marketing landing page with lead capture', 'Marketing',
 'Design a high-converting landing page with hero section, features, and CTA',
 ARRAY['marketing', 'landing', 'leads'], false);

\`\`\`

## After Running SQL

1. Go to Supabase Dashboard > Database > Tables
2. Verify all tables are created
3. Check that RLS policies are active
4. Test by inserting sample data

## Next Steps

1. Deploy Edge Functions (see MIGRATION_GUIDE.md)
2. Configure authentication providers
3. Update application code to use these tables
