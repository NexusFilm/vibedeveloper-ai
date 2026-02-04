# Component Migration Reference

## Quick Reference Guide for Updating Components

This guide shows how to migrate each type of Base44 call to Supabase.

## Authentication

### Base44 → Supabase

| Base44 | Supabase |
|--------|----------|
| \`base44.auth.me()\` | \`useAuth().user\` or \`supabaseHelpers.getCurrentUser()\` |
| \`base44.auth.redirectToLogin(url)\` | \`useAuth().signInWithOAuth('google')\` |
| \`base44.auth.logout(url)\` | \`useAuth().logout()\` |

### Example: Home.jsx

**Before:**
\`\`\`javascript
import { base44 } from '@/api/base44Client';

const handleGetStarted = () => {
  base44.auth.redirectToLogin(createPageUrl('Dashboard'));
};
\`\`\`

**After:**
\`\`\`javascript
import { useAuth } from '@/lib/SupabaseAuthContext';

const { signInWithOAuth } = useAuth();

const handleGetStarted = async () => {
  await signInWithOAuth('google');
};
\`\`\`

## Database Operations

### Projects

| Operation | Base44 | Supabase |
|-----------|--------|----------|
| List all | \`base44.entities.Project.list()\` | \`supabaseHelpers.getProjects(userId)\` |
| Get by ID | \`base44.entities.Project.get(id)\` | \`supabaseHelpers.getProjectById(id)\` |
| Filter | \`base44.entities.Project.filter({...})\` | \`supabase.from('projects').select().eq(...)\` |
| Create | \`base44.entities.Project.create({...})\` | \`supabaseHelpers.createProject({...})\` |
| Update | \`base44.entities.Project.update(id, {...})\` | \`supabaseHelpers.updateProject(id, {...})\` |
| Delete | \`base44.entities.Project.delete(id)\` | \`supabaseHelpers.deleteProject(id)\` |

### Example: Dashboard.jsx

**Before:**
\`\`\`javascript
import { base44 } from '@/api/base44Client';

const fetchProjects = async () => {
  const userData = await base44.auth.me();
  const projectData = await base44.entities.Project.filter(
    { created_by: userData.email },
    '-updated_date'
  );
  setProjects(projectData);
};
\`\`\`

**After:**
\`\`\`javascript
import { supabaseHelpers } from '@/api/supabaseClient';
import { useAuth } from '@/lib/SupabaseAuthContext';

const { user } = useAuth();

const fetchProjects = async () => {
  const projectData = await supabaseHelpers.getProjects(user.id);
  setProjects(projectData);
};
\`\`\`

### Example: NewProject.jsx

**Before:**
\`\`\`javascript
const handleSave = async () => {
  if (projectData?.id) {
    await base44.entities.Project.update(projectData.id, {
      title,
      description,
      prompt
    });
  } else {
    const created = await base44.entities.Project.create({
      title,
      description,
      prompt
    });
    setProjectData(created);
  }
};
\`\`\`

**After:**
\`\`\`javascript
const handleSave = async () => {
  if (projectData?.id) {
    await supabaseHelpers.updateProject(projectData.id, {
      title,
      description,
      prompt
    });
  } else {
    const created = await supabaseHelpers.createProject({
      title,
      description,
      prompt
    });
    setProjectData(created);
  }
};
\`\`\`

## LLM Integration

### Base44 → Supabase

**Before:**
\`\`\`javascript
const response = await base44.integrations.Core.InvokeLLM({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: userPrompt }
  ],
  model: 'gpt-4',
  temperature: 0.7
});

const result = response.content;
\`\`\`

**After:**
\`\`\`javascript
const response = await supabaseHelpers.invokeLLM({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: userPrompt }
  ],
  model: 'gpt-4',
  temperature: 0.7
});

const result = response.content;
\`\`\`

## Stripe/Payments

### Base44 → Supabase

**Before:**
\`\`\`javascript
const handleCheckout = async (priceId) => {
  const response = await base44.functions.invoke('createCheckout', { priceId });
  window.location.href = response.url;
};
\`\`\`

**After:**
\`\`\`javascript
import { supabase } from '@/api/supabaseClient';

const handleCheckout = async (priceId) => {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { priceId }
  });
  
  if (error) throw error;
  window.location.href = data.url;
};
\`\`\`

## User Subscriptions

**Before:**
\`\`\`javascript
const subs = await base44.entities.UserSubscription.filter({ 
  user_email: currentUser.email 
});
\`\`\`

**After:**
\`\`\`javascript
const subscription = await supabaseHelpers.getUserSubscription(user.email);
\`\`\`

## Templates

**Before:**
\`\`\`javascript
const templates = await base44.entities.Template.list();
\`\`\`

**After:**
\`\`\`javascript
const templates = await supabaseHelpers.getTemplates();
\`\`\`

## Examples

**Before:**
\`\`\`javascript
const examples = await base44.entities.ExampleProject.list();
\`\`\`

**After:**
\`\`\`javascript
const examples = await supabaseHelpers.getExampleProjects();
\`\`\`

## Complete Component Example

### Dashboard.jsx Migration

**Before (Base44):**
\`\`\`javascript
import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      const projectData = await base44.entities.Project.filter(
        { created_by: userData.email },
        '-updated_date'
      );
      setProjects(projectData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout(window.location.href);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {projects.map(project => (
          <div key={project.id}>{project.title}</div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

**After (Supabase):**
\`\`\`javascript
import React, { useEffect, useState } from 'react';
import { supabaseHelpers } from '@/api/supabaseClient';
import { useAuth } from '@/lib/SupabaseAuthContext';

export default function Dashboard() {
  const { user, logout, isLoadingAuth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const projectData = await supabaseHelpers.getProjects(user.id);
      setProjects(projectData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoadingAuth || loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {projects.map(project => (
          <div key={project.id}>{project.title}</div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## Advanced Queries

For complex queries not covered by helpers, use Supabase client directly:

\`\`\`javascript
import { supabase } from '@/api/supabaseClient';

// Complex filter with multiple conditions
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'published')
  .gte('created_date', '2024-01-01')
  .order('created_date', { ascending: false })
  .limit(10);

// Join with related tables
const { data, error } = await supabase
  .from('projects')
  .select(\`
    *,
    user:user_id (email, name)
  \`)
  .eq('user_id', userId);

// Search
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .textSearch('title', 'search term', {
    type: 'websearch',
    config: 'english'
  });
\`\`\`

## Error Handling

**Base44:**
\`\`\`javascript
try {
  const data = await base44.entities.Project.list();
} catch (error) {
  console.error('Error:', error.message);
}
\`\`\`

**Supabase:**
\`\`\`javascript
const { data, error } = await supabase
  .from('projects')
  .select('*');

if (error) {
  console.error('Error:', error.message);
  return;
}

// Use data
\`\`\`

## Migration Checklist for Each Component

- [ ] Replace \`base44\` import with \`supabaseHelpers\` and/or \`useAuth\`
- [ ] Update auth calls to use \`useAuth()\` hook
- [ ] Replace \`.entities.XXX\` calls with \`supabaseHelpers\` methods
- [ ] Update LLM calls to use new Edge Function
- [ ] Update payment/checkout calls
- [ ] Test user flow thoroughly
- [ ] Check error handling
- [ ] Verify data is saved correctly

## Files That Need Migration

1. ✅ \`src/lib/AuthContext.jsx\` → Use \`SupabaseAuthContext.jsx\` instead
2. ⚠️ \`src/pages/Home.jsx\` - Update auth flow
3. ⚠️ \`src/pages/Dashboard.jsx\` - Update auth + projects
4. ⚠️ \`src/pages/NewProject.jsx\` - Update project CRUD
5. ⚠️ \`src/pages/ProjectResult.jsx\` - Update project fetch
6. ⚠️ \`src/pages/PromptEditor.jsx\` - Update project + LLM
7. ⚠️ \`src/pages/Examples.jsx\` - Update examples fetch
8. ⚠️ \`src/pages/Templates.jsx\` - Update templates fetch
9. ⚠️ \`src/pages/Pricing.jsx\` - Update checkout
10. ⚠️ \`src/pages/AdminDashboard.jsx\` - Update admin operations
11. ⚠️ \`src/components/ChatRefinement.jsx\` - Update LLM
12. ⚠️ \`src/components/wizard/*.jsx\` - Update wizard steps
13. ⚠️ \`src/Layout.jsx\` - Update auth + subscription

## Tips

1. **Start small**: Migrate one component at a time
2. **Test immediately**: Run the app after each component migration
3. **Use helpers**: Leverage \`supabaseHelpers\` for common operations
4. **Auth hook**: Always use \`useAuth()\` for auth state
5. **Error handling**: Supabase returns \`{ data, error }\` - always check error
6. **RLS**: Remember Row Level Security - users can only access their own data

## Need Help?

- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed setup
- Review [Supabase JS docs](https://supabase.com/docs/reference/javascript)
- Look at [supabaseClient.js](./src/api/supabaseClient.js) for available helpers
