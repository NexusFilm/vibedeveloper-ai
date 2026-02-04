-- Insert sample pricing plans for VibeDeveloper
INSERT INTO pricing_plans (tenant_id, name, description, price_monthly, price_yearly, projects_limit, features, sort_order, is_popular) VALUES
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'Free', 'Perfect for trying out VibeDeveloper AI', 0, 0, 3, 
 '["3 projects", "Basic AI assistance", "Community support"]', 1, false),
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'Pro', 'For serious developers', 29, 290, 50, 
 '["50 projects", "Advanced AI models", "Priority support", "Export to code", "Team collaboration"]', 2, true),
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'Enterprise', 'For teams and organizations', 99, 990, 999, 
 '["Unlimited projects", "Custom AI training", "24/7 support", "White label", "API access", "Advanced analytics"]', 3, false);

-- Insert sample templates for VibeDeveloper
INSERT INTO templates (tenant_id, name, description, category, prompt_template, tags, is_featured) VALUES
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'E-commerce Store', 'Complete online store with shopping cart', 'Business', 
 'Create a modern e-commerce platform with product listings, shopping cart, and checkout', 
 ARRAY['ecommerce', 'shopping', 'business'], true),
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'SaaS Dashboard', 'Analytics dashboard for SaaS applications', 'Business',
 'Build a comprehensive SaaS dashboard with analytics, user management, and billing',
 ARRAY['saas', 'dashboard', 'analytics'], true),
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'Landing Page', 'Marketing landing page with lead capture', 'Marketing',
 'Design a high-converting landing page with hero section, features, and CTA',
 ARRAY['marketing', 'landing', 'leads'], false);

-- Insert sample example projects for VibeDeveloper
INSERT INTO example_projects (tenant_id, title, description, tags, is_featured) VALUES
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'Modern Portfolio Site', 'Clean, responsive portfolio website', ARRAY['portfolio', 'personal', 'responsive'], true),
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'Task Management App', 'Full-featured task and project management application', ARRAY['productivity', 'management', 'app'], true),
('eabc44ea-c919-40b2-9d1f-e0923d7d1db7', 'Blog Platform', 'Content management system for blogging', ARRAY['blog', 'cms', 'content'], false);;
