# Vercel Deployment Guide

## Quick Start

This app deploys to Vercel with:
- **Frontend**: React (hosted on Vercel)
- **Backend API**: Vercel Serverless Functions
- **Database & Auth**: Supabase
- **AI/LLM**: OpenAI API (via Vercel functions)
- **Payments**: Stripe (via Vercel functions)

## Prerequisites

1. Vercel account (https://vercel.com)
2. Supabase account (https://supabase.com)
3. OpenAI API key (https://platform.openai.com)
4. Stripe account (optional, for payments)

## Step 1: Set Up Supabase

### Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait ~2 minutes for setup
3. Get your credentials from Settings > API:
   - Project URL
   - Anon/Public Key

### Set Up Database

Run this SQL in Supabase SQL Editor:

\`\`\`sql
-- Copy and run the entire schema from supabase/schema.sql
\`\`\`

### Configure Authentication

1. Go to Authentication > Providers
2. Enable Email auth
3. Enable Google OAuth (or your preferred provider)
4. Add redirect URLs:
   - \`http://localhost:5173/**\`
   - \`https://your-app.vercel.app/**\`

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Login to Vercel:
\`\`\`bash
vercel login
\`\`\`

3. Deploy:
\`\`\`bash
vercel
\`\`\`

4. Follow the prompts to link/create project

### Option B: Deploy via GitHub Integration

1. Push your code to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vibedeveloperai.git
git push -u origin main
\`\`\`

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

## Step 3: Configure Environment Variables

In your Vercel project dashboard (Settings > Environment Variables), add:

### Required Variables

\`\`\`
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
OPENAI_API_KEY=sk-proj-xxxxx
\`\`\`

### Optional (for Stripe payments)

\`\`\`
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
\`\`\`

**Important**: Add these for all environments (Production, Preview, Development)

## Step 4: Redeploy

After adding environment variables:

\`\`\`bash
vercel --prod
\`\`\`

Or trigger a new deployment from Vercel dashboard.

## Local Development

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create \`.env\` file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update \`.env\` with your credentials:
\`\`\`env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
OPENAI_API_KEY=sk-proj-xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
\`\`\`

4. Run development server:
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:5173

## API Endpoints

Vercel automatically creates these endpoints:

- \`/api/invoke-llm\` - OpenAI integration
- \`/api/create-checkout\` - Stripe checkout

These are serverless functions in the \`/api\` directory.

## Testing API Locally

Vercel CLI automatically runs serverless functions locally:

\`\`\`bash
vercel dev
\`\`\`

This will:
- Run your frontend on http://localhost:3000
- Make API endpoints available at \`/api/*\`
- Use your local \`.env\` file

## Project Structure

\`\`\`
/
├── api/                      # Vercel Serverless Functions
│   ├── invoke-llm.js        # OpenAI integration
│   └── create-checkout.js   # Stripe integration
├── src/                     # React frontend
│   ├── api/
│   │   └── supabaseClient.js
│   ├── lib/
│   │   └── SupabaseAuthContext.jsx
│   └── pages/
├── public/                  # Static assets
├── vercel.json             # Vercel configuration
├── .env.example            # Environment variables template
└── package.json
\`\`\`

## Updating Your App

### Push to Deploy

Every push to your main branch triggers a deployment:

\`\`\`bash
git add .
git commit -m "Update feature"
git push origin main
\`\`\`

Vercel automatically:
1. Builds your app
2. Runs tests (if configured)
3. Deploys to production
4. Provides preview URL

### Preview Deployments

Every pull request gets a preview deployment:
- Unique URL for testing
- No impact on production
- Perfect for code review

## Domain Configuration

### Custom Domain

1. Go to Vercel project Settings > Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Vercel provides free SSL

### Update Supabase Redirects

After adding custom domain, update Supabase Auth:
1. Go to Supabase Authentication > URL Configuration
2. Add your production URL to redirect URLs

## Monitoring

### Vercel Analytics

Enable in project Settings > Analytics for:
- Real User Monitoring (RUM)
- Web Vitals
- Page load times

### Serverless Function Logs

View logs in Vercel dashboard:
- Functions tab shows invocations
- Click function to see logs
- Filter by timeframe

### Supabase Logs

Monitor database and auth:
- Go to Supabase project
- Database > Logs
- Auth > Logs

## Troubleshooting

### Build Fails

Check Vercel build logs:
1. Go to deployment in Vercel dashboard
2. View build logs
3. Common issues:
   - Missing dependencies
   - Environment variables not set
   - Build errors in code

### API Functions Fail

Check function logs:
1. Go to Functions tab
2. Click failing function
3. View invocation logs
4. Check:
   - Environment variables set?
   - Correct API keys?
   - CORS configured?

### Authentication Issues

1. Check Supabase redirect URLs match your domain
2. Verify environment variables in Vercel
3. Check browser console for errors
4. Verify Supabase Auth provider is enabled

## Cost Breakdown

### Free Tier Includes:
- **Vercel**:
  - 100GB bandwidth
  - 100GB-hrs serverless function execution
  - 6,000 build minutes
  - Unlimited deployments
  
- **Supabase**:
  - 500MB database
  - 2GB bandwidth
  - 50K MAU

### Paid Plans:
- **Vercel Pro**: $20/month (team features)
- **Supabase Pro**: $25/month (more resources)

## Security Best Practices

1. **Never commit secrets**:
   - Use \`.env\` locally
   - Use Vercel environment variables for production
   - Add \`.env\` to \`.gitignore\`

2. **Rotate API keys periodically**

3. **Use environment-specific keys**:
   - Test keys for development
   - Live keys for production

4. **Enable Vercel Protection**:
   - Password protect preview deployments
   - Restrict deployment branches

## Next Steps

1. ✅ Deploy to Vercel
2. Configure custom domain
3. Set up monitoring
4. Enable analytics
5. Configure Stripe webhooks (if using payments)

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- OpenAI Docs: https://platform.openai.com/docs

---

**That's it!** Your app is now deployed to Vercel with Supabase backend and OpenAI integration. 🚀
