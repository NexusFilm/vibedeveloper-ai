-- ============================================
-- EXAMPLE PROJECTS TABLE (with tenant_id)
-- ============================================
CREATE TABLE IF NOT EXISTS example_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  tags TEXT[],
  demo_url TEXT,
  source_code_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER SUBSCRIPTIONS TABLE (with tenant_id)
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  
  -- Stripe data
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
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
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tenant_id, user_id)
);

-- ============================================
-- PRICING PLANS TABLE (with tenant_id)
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
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

-- ============================================
-- DISCOUNT CODES TABLE (with tenant_id)
-- ============================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  discount_percent INTEGER,
  discount_amount DECIMAL(10,2),
  max_uses INTEGER,
  times_used INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tenant_id, code)
);

-- ============================================
-- ANNOUNCEMENTS TABLE (with tenant_id)
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT, -- 'info', 'warning', 'success', 'error'
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_example_projects_tenant_id ON example_projects(tenant_id);
CREATE INDEX idx_user_subscriptions_tenant_id ON user_subscriptions(tenant_id);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_pricing_plans_tenant_id ON pricing_plans(tenant_id);
CREATE INDEX idx_discount_codes_tenant_id ON discount_codes(tenant_id);
CREATE INDEX idx_announcements_tenant_id ON announcements(tenant_id);;
