# Migration Guide: Base44 to Supabase + GitHub Pages

This guide will help you migrate your VibeDeveloper AI application from Base44 to Supabase with GitHub Pages deployment.

## Overview

The migration includes:
- **Frontend**: Hosted on GitHub Pages
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **Payments**: Stripe (via Supabase Edge Functions)
- **LLM Integration**: OpenAI/Anthropic via Supabase Edge Functions

## Prerequisites

1. GitHub account
2. Supabase account (free tier available at https://supabase.com)
3. Stripe account (if using payments)
4. OpenAI or Anthropic API key (for LLM features)

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Set project name, database password, and region
5. Wait for the project to be created (~2 minutes)

### 1.2 Get Your Supabase Credentials

1. Go to Settings > API
2. Copy your:
   - Project URL (VITE_SUPABASE_URL)
   - Anon/Public Key (VITE_SUPABASE_ANON_KEY)

### 1.3 Create Database Tables

Run these SQL commands in the Supabase SQL Editor:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by TEXT,
  title TEXT,
  description TEXT,
  prompt TEXT,
  refined_prompt TEXT,
  wireframe_data JSONB,
  status TEXT DEFAULT 'draft',
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Templates table
CREATE TABLE templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  prompt_template TEXT,
  thumbnail_url TEXT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example projects table
CREATE TABLE example_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  tags TEXT[],
  demo_url TEXT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_name TEXT,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_date ON projects(created_date DESC);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
\`\`\`

### 1.4 Set Up Authentication

1. Go to Authentication > Providers in Supabase
2. Enable Email auth
3. Enable OAuth providers (Google, GitHub, etc.) as needed
4. Configure redirect URLs:
   - Add your local dev URL: \`http://localhost:5173/**\`
   - Add your GitHub Pages URL: \`https://yourusername.github.io/vibedeveloperai/**\`

### 1.5 Deploy Edge Functions

Install Supabase CLI:
\`\`\`bash
npm install -g supabase
\`\`\`

Login and link your project:
\`\`\`bash
supabase login
supabase link --project-ref your-project-ref
\`\`\`

Deploy the edge functions:
\`\`\`bash
supabase functions deploy create-checkout
supabase functions deploy invoke-llm
\`\`\`

Set secrets for edge functions:
\`\`\`bash
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
supabase secrets set OPENAI_API_KEY=your_openai_api_key
\`\`\`

## Step 2: Set Up GitHub Repository

### 2.1 Initialize Git Repository

\`\`\`bash
git init
git add .
git commit -m "Initial commit - migrated from Base44"
\`\`\`

### 2.2 Create GitHub Repository

1. Go to GitHub and create a new repository
2. Name it \`vibedeveloperai\`
3. Don't initialize with README (you already have files)
4. Follow the instructions to push your existing repository

\`\`\`bash
git remote add origin https://github.com/yourusername/vibedeveloperai.git
git branch -M main
git push -u origin main
\`\`\`

### 2.3 Configure GitHub Pages

1. Go to your repository Settings
2. Navigate to Pages
3. Under "Build and deployment":
   - Source: GitHub Actions
4. Add repository secrets (Settings > Secrets and variables > Actions):
   - \`VITE_SUPABASE_URL\`: Your Supabase project URL
   - \`VITE_SUPABASE_ANON_KEY\`: Your Supabase anon key
   - \`VITE_STRIPE_PUBLISHABLE_KEY\`: Your Stripe publishable key

### 2.4 Configure Base Path (if using custom domain)

If deploying to \`username.github.io/vibedeveloperai\`, update \`vite.config.js\`:

\`\`\`javascript
export default defineConfig({
  base: '/vibedeveloperai/', // Add this line
  // ... rest of config
});
\`\`\`

## Step 3: Update Local Environment

### 3.1 Install New Dependencies

\`\`\`bash
npm install
\`\`\`

This will install Supabase JS client and remove Base44 dependencies.

### 3.2 Create Local Environment File

Copy \`.env.example\` to \`.env\`:

\`\`\`bash
cp .env.example .env
\`\`\`

Update \`.env\` with your credentials:

\`\`\`env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
VITE_APP_NAME=VibeDeveloper AI
VITE_APP_URL=http://localhost:5173
\`\`\`

## Step 4: Update Application Code

### 4.1 Update Main App Entry

Replace the old AuthProvider import in your app with the new one:

**In \`src/main.jsx\` or \`src/App.jsx\`:**

Change:
\`\`\`javascript
import { AuthProvider } from '@/lib/AuthContext';
\`\`\`

To:
\`\`\`javascript
import { AuthProvider } from '@/lib/SupabaseAuthContext';
\`\`\`

### 4.2 Update Individual Pages

Each page that uses Base44 needs to be updated. Here's the pattern:

**Before (Base44):**
\`\`\`javascript
import { base44 } from '@/api/base44Client';

const data = await base44.entities.Project.list();
\`\`\`

**After (Supabase):**
\`\`\`javascript
import { supabaseHelpers } from '@/api/supabaseClient';

const data = await supabaseHelpers.getProjects(user.id);
\`\`\`

### 4.3 Update Auth Calls

**Before:**
\`\`\`javascript
base44.auth.redirectToLogin(url);
base44.auth.logout();
\`\`\`

**After:**
\`\`\`javascript
const { signInWithOAuth, logout } = useAuth();
await signInWithOAuth('google');
await logout();
\`\`\`

## Step 5: Test Locally

\`\`\`bash
npm run dev
\`\`\`

Test all functionality:
- [ ] User authentication (sign in/sign up)
- [ ] Create new projects
- [ ] View existing projects
- [ ] LLM integration
- [ ] Payment flow (if applicable)

## Step 6: Deploy to GitHub Pages

\`\`\`bash
git add .
git commit -m "Complete migration to Supabase"
git push origin main
\`\`\`

The GitHub Action will automatically:
1. Build your application
2. Deploy to GitHub Pages

View your deployment at:
- \`https://yourusername.github.io/vibedeveloperai/\`

## Stripe Webhook Setup (Optional)

If you're using subscriptions, set up Stripe webhooks:

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: \`https://your-project.supabase.co/functions/v1/stripe-webhook\`
3. Select events: \`checkout.session.completed\`, \`customer.subscription.updated\`, \`customer.subscription.deleted\`
4. Copy webhook signing secret
5. Add to Supabase secrets:
   \`\`\`bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=your_webhook_secret
   \`\`\`

## Troubleshooting

### CORS Issues
- Ensure Supabase Edge Functions have proper CORS headers
- Check that your GitHub Pages URL is in Supabase Auth redirect URLs

### Authentication Not Working
- Verify environment variables are set correctly
- Check Supabase Auth settings and providers
- Ensure redirect URLs match your deployment URL

### Build Fails
- Check that all Base44 imports are removed
- Verify environment variables in GitHub secrets
- Review GitHub Actions logs for specific errors

### Database Queries Failing
- Verify Row Level Security policies are correct
- Check that user is authenticated before queries
- Review Supabase logs in Dashboard

## Migration Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Authentication configured
- [ ] Edge functions deployed
- [ ] GitHub repository created
- [ ] GitHub secrets configured
- [ ] Local environment setup
- [ ] Code updated to use Supabase
- [ ] Local testing completed
- [ ] Deployed to GitHub Pages
- [ ] Production testing completed

## Support

- Supabase Docs: https://supabase.com/docs
- GitHub Pages Docs: https://docs.github.com/en/pages
- Stripe Docs: https://stripe.com/docs

## Cost Comparison

### Base44
- Variable based on usage and plan

### New Stack (Supabase + GitHub Pages)
- **GitHub Pages**: Free for public repos
- **Supabase Free Tier**:
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth
  - 50MB edge function logs
  - 500K edge function invocations
- **Paid Tier**: $25/month (if needed)
  - 8GB database
  - 100GB file storage
  - 250GB bandwidth
  - Unlimited edge function logs
  - 2M edge function invocations

## Next Steps

1. Update remaining pages to use Supabase
2. Add more OAuth providers if needed
3. Implement additional features:
   - Real-time collaboration
   - File uploads (Supabase Storage)
   - Advanced analytics
   - Team collaboration features

---

**Note**: This migration guide provides the foundation. You'll need to update each page component individually to replace Base44 calls with Supabase equivalents. Use the \`supabaseHelpers\` in \`src/api/supabaseClient.js\` as a starting point, and expand as needed for your specific use cases.
