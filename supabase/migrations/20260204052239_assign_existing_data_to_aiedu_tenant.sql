-- Update existing AI Edu data to belong to the aiedu tenant
UPDATE users SET tenant_id = '197d5a23-023d-4cfb-94ac-12475fca5514' WHERE tenant_id IS NULL;
UPDATE courses SET tenant_id = '197d5a23-023d-4cfb-94ac-12475fca5514' WHERE tenant_id IS NULL;
UPDATE course_prompts SET tenant_id = '197d5a23-023d-4cfb-94ac-12475fca5514' WHERE tenant_id IS NULL;
UPDATE user_course_progress SET tenant_id = '197d5a23-023d-4cfb-94ac-12475fca5514' WHERE tenant_id IS NULL;
UPDATE prompt_conversations SET tenant_id = '197d5a23-023d-4cfb-94ac-12475fca5514' WHERE tenant_id IS NULL;
UPDATE profiles SET tenant_id = '197d5a23-023d-4cfb-94ac-12475fca5514' WHERE tenant_id IS NULL;

-- Add existing users to the aiedu tenant as members
INSERT INTO tenant_members (tenant_id, user_id, role)
SELECT '197d5a23-023d-4cfb-94ac-12475fca5514', id, 'member'
FROM users
WHERE id NOT IN (SELECT user_id FROM tenant_members WHERE tenant_id = '197d5a23-023d-4cfb-94ac-12475fca5514');;
