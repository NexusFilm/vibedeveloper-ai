# VibeDeveloper AI - Quick Start Guide

## What Changed?

Your app has been migrated from Base44 to a modern, open-source stack:

- **Frontend**: Deployed on GitHub Pages (free)
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payments**: Stripe integration via Supabase Edge Functions
- **AI/LLM**: OpenAI/Anthropic via Supabase Edge Functions

## Quick Start (Development)

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Environment Variables

Copy the example file:
\`\`\`bash
cp .env.example .env
\`\`\`

Update \`.env\` with your credentials:
\`\`\`env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:5173

## Set Up Supabase Backend

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Wait ~2 minutes for setup

### 2. Set Up Database

1. Go to SQL Editor in Supabase
2. Copy and run the SQL from \`supabase/schema.sql\`
3. Verify tables are created in Database > Tables

### 3. Configure Authentication

1. Go to Authentication > Providers
2. Enable Email auth
3. Enable Google OAuth (or your preferred provider):
   - Get OAuth credentials from Google Cloud Console
   - Add to Supabase Auth settings
4. Add redirect URLs:
   - \`http://localhost:5173/**\`
   - Your production URL

### 4. Deploy Edge Functions

Install Supabase CLI:
\`\`\`bash
npm install -g supabase
\`\`\`

Login and link:
\`\`\`bash
supabase login
supabase link --project-ref your-project-ref
\`\`\`

Deploy functions:
\`\`\`bash
supabase functions deploy create-checkout
supabase functions deploy invoke-llm
\`\`\`

Set secrets:
\`\`\`bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set OPENAI_API_KEY=sk-xxxxx
\`\`\`

## Deploy to GitHub Pages

### 1. Create GitHub Repository

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vibedeveloperai.git
git push -u origin main
\`\`\`

### 2. Configure GitHub

1. Go to repository Settings > Pages
2. Source: GitHub Actions
3. Go to Settings > Secrets and variables > Actions
4. Add secrets:
   - \`VITE_SUPABASE_URL\`
   - \`VITE_SUPABASE_ANON_KEY\`
   - \`VITE_STRIPE_PUBLISHABLE_KEY\`

### 3. Deploy

Push to main branch:
\`\`\`bash
git push origin main
\`\`\`

GitHub Actions will automatically build and deploy!

## Code Migration Pattern

### Before (Base44):
\`\`\`javascript
import { base44 } from '@/api/base44Client';

// Get data
const projects = await base44.entities.Project.list();

// Create
await base44.entities.Project.create({ title: 'My Project' });

// Update
await base44.entities.Project.update(id, { title: 'Updated' });

// Auth
const user = await base44.auth.me();
base44.auth.redirectToLogin();
\`\`\`

### After (Supabase):
\`\`\`javascript
import { supabaseHelpers } from '@/api/supabaseClient';
import { useAuth } from '@/lib/SupabaseAuthContext';

// Get data
const projects = await supabaseHelpers.getProjects(user.id);

// Create
await supabaseHelpers.createProject({ title: 'My Project' });

// Update
await supabaseHelpers.updateProject(id, { title: 'Updated' });

// Auth (in component)
const { user, signInWithOAuth, logout } = useAuth();
await signInWithOAuth('google');
await logout();
\`\`\`

## File Structure Changes

### New Files:
- \`src/api/supabaseClient.js\` - Supabase client and helpers
- \`src/lib/SupabaseAuthContext.jsx\` - New auth context for Supabase
- \`.env.example\` - Environment variables template
- \`.github/workflows/deploy.yml\` - GitHub Actions deployment
- \`supabase/functions/\` - Edge functions for backend logic
- \`supabase/schema.sql\` - Database schema
- \`MIGRATION_GUIDE.md\` - Complete migration instructions

### Updated Files:
- \`package.json\` - Replaced Base44 with Supabase dependencies
- \`vite.config.js\` - Simplified config, removed Base44 plugin

### Files to Update:
You'll need to update each page that uses Base44:
- \`src/pages/Dashboard.jsx\`
- \`src/pages/NewProject.jsx\`
- \`src/pages/ProjectResult.jsx\`
- \`src/pages/PromptEditor.jsx\`
- And others...

Use the pattern shown above to replace Base44 calls with Supabase.

## Testing Checklist

- [ ] User can sign up
- [ ] User can sign in
- [ ] User can create project
- [ ] User can view projects
- [ ] User can update project
- [ ] User can delete project
- [ ] LLM integration works
- [ ] Payment flow works (if applicable)

## Cost Breakdown

### Free Tier (Supabase):
- 500MB database storage
- 2GB bandwidth
- 50,000 monthly active users
- 2 million Edge Function invocations

### Paid Plans (if needed):
- **Supabase Pro**: $25/month
  - 8GB database
  - 250GB bandwidth
  - Unlimited MAU
- **GitHub Pages**: Free for public repos

## Getting Help

1. **Supabase Docs**: https://supabase.com/docs
2. **GitHub Pages**: https://docs.github.com/pages
3. **Migration Guide**: See \`MIGRATION_GUIDE.md\` for detailed instructions

## Troubleshooting

### "Missing environment variables" error
- Check your \`.env\` file has all required variables
- Make sure GitHub secrets are set for deployment

### Authentication not working
- Verify Supabase Auth providers are enabled
- Check redirect URLs match your domain
- Ensure anon key is correct

### Database queries failing
- Check Row Level Security policies
- Verify user is authenticated
- Review Supabase logs in dashboard

### Build fails on GitHub
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure dependencies are compatible

## Next Steps

1. Complete the migration by updating all page components
2. Test thoroughly in development
3. Deploy to production
4. Set up custom domain (optional)
5. Configure monitoring and analytics

For detailed migration instructions, see **MIGRATION_GUIDE.md**
