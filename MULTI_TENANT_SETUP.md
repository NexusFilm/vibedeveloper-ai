# Multi-Tenant Architecture Setup

This project has been successfully configured with a multi-tenant architecture using Supabase as the backend. This allows multiple websites/applications to share the same database while maintaining complete data isolation.

## Architecture Overview

### Core Components

1. **Tenants Table**: Central registry of all tenants
2. **Tenant Members**: User membership and roles within tenants
3. **Tenant-Aware Tables**: All data tables include `tenant_id` for isolation
4. **Row Level Security (RLS)**: Enforces tenant boundaries at the database level
5. **Edge Functions**: Tenant-aware serverless functions

### Current Tenants

1. **AI Edu** (`aiedu`)
   - Slug: `aiedu`
   - Subdomain: `aiedu.yourapp.com`
   - Features: Courses, prompts, progress tracking
   - Tenant ID: `197d5a23-023d-4cfb-94ac-12475fca5514`

2. **VibeDeveloper AI** (`vibedeveloper`)
   - Slug: `vibedeveloper`
   - Subdomain: `vibedeveloper.yourapp.com`
   - Features: Projects, templates, AI generation, subscriptions
   - Tenant ID: `eabc44ea-c919-40b2-9d1f-e0923d7d1db7`

## Database Schema

### Tenant Management Tables

```sql
-- Core tenant registry
tenants (id, name, slug, domain, subdomain, settings, storage_bucket, is_active)

-- User membership in tenants
tenant_members (id, tenant_id, user_id, role, permissions, joined_at)
```

### Tenant-Aware Tables

All application tables include `tenant_id`:

**AI Edu Tables:**
- `users` (with tenant_id)
- `courses` (with tenant_id)
- `course_prompts` (with tenant_id)
- `user_course_progress` (with tenant_id)
- `prompt_conversations` (with tenant_id)

**VibeDeveloper Tables:**
- `projects` (with tenant_id)
- `templates` (with tenant_id)
- `example_projects` (with tenant_id)
- `user_subscriptions` (with tenant_id)
- `pricing_plans` (with tenant_id)
- `discount_codes` (with tenant_id)
- `announcements` (with tenant_id)

## Security & Access Control

### Row Level Security (RLS)

All tables have RLS policies that enforce tenant boundaries:

```sql
-- Example policy
CREATE POLICY "Users can view own projects in their tenant" ON projects
  FOR SELECT USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_members.tenant_id = projects.tenant_id 
      AND tenant_members.user_id = auth.uid()
    )
  );
```

### Helper Functions

- `get_user_tenant_id()`: Get user's current tenant
- `user_has_tenant_access(tenant_id)`: Check tenant access
- `get_tenant_by_domain(domain)`: Resolve tenant from domain
- `create_tenant_with_owner()`: Create new tenant with owner

## Edge Functions

### Deployed Functions

1. **chat**: AI chat functionality (AI Edu)
2. **generate-course**: Course generation (AI Edu)
3. **generate-project**: Project generation (VibeDeveloper)
4. **create-checkout**: Stripe checkout (VibeDeveloper)
5. **invoke-llm**: General LLM invocation

All functions are tenant-aware and validate user access.

## Frontend Integration

### Tenant Context

The React app includes a `TenantProvider` that:
- Automatically detects tenant from domain/subdomain
- Sets tenant context for API calls
- Provides tenant switching functionality

```jsx
import { useTenant } from '@/lib/TenantContext';

const { tenant, isVibeDeveloper, isAiEdu } = useTenant();
```

### API Client

The Supabase client is enhanced with tenant-aware helpers:

```javascript
import { supabaseHelpers, setTenantContext } from '@/api/supabaseClient';

// All operations are automatically scoped to current tenant
const projects = await supabaseHelpers.getProjects(userId);
const templates = await supabaseHelpers.getTemplates();
```

## Environment Configuration

```env
# Supabase Configuration (AI Edu Project)
VITE_SUPABASE_URL=https://ozzjcuamqslxjcfgtfhj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Domain Mapping

### Development
- `localhost:5173?tenant=vibedeveloper` → VibeDeveloper
- `localhost:5173?tenant=aiedu` → AI Edu

### Production
- `vibedeveloper.yourapp.com` → VibeDeveloper
- `aiedu.yourapp.com` → AI Edu
- Custom domains can be mapped in the `tenants.domain` field

## Storage Isolation

Each tenant has its own storage bucket:
- AI Edu: `aiedu-storage`
- VibeDeveloper: `vibedeveloper-storage`

## Adding New Tenants

1. Insert into `tenants` table
2. Create tenant membership for owner
3. Add tenant-specific data (pricing plans, templates, etc.)
4. Configure domain mapping
5. Set up storage bucket

```sql
-- Example: Add new tenant
SELECT create_tenant_with_owner('New Site', 'newsite', 'user-uuid');
```

## Security Considerations

✅ **Implemented:**
- Row Level Security on all tables
- Tenant boundary enforcement
- Function search_path security
- JWT-based authentication
- Tenant membership validation

⚠️ **Recommended:**
- Enable leaked password protection in Supabase Auth settings
- Set up custom domains with SSL
- Configure CORS policies
- Implement rate limiting
- Set up monitoring and alerts

## Next Steps

1. Configure custom domains for each tenant
2. Set up Stripe webhooks for subscription management
3. Implement tenant-specific theming
4. Add tenant analytics and monitoring
5. Create tenant admin dashboard
6. Set up automated backups per tenant

This multi-tenant setup provides a solid foundation for scaling multiple applications while maintaining security and data isolation.