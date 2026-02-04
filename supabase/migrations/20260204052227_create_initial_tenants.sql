-- Create initial tenants
INSERT INTO tenants (name, slug, subdomain, storage_bucket, settings) VALUES
('AI Edu', 'aiedu', 'aiedu', 'aiedu-storage', '{"theme": "education", "features": ["courses", "prompts", "progress_tracking"]}'),
('VibeDeveloper AI', 'vibedeveloper', 'vibedeveloper', 'vibedeveloper-storage', '{"theme": "developer", "features": ["projects", "templates", "ai_generation", "subscriptions"]}');

-- Get the tenant IDs for reference
SELECT id, name, slug FROM tenants;;
