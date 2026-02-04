# Vercel Deployment - Quick Reference

## Deploy in 3 Steps

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin https://github.com/YOUR_USERNAME/vibedeveloperai.git
git push -u origin main
\`\`\`

### 3. Deploy to Vercel
Go to https://vercel.com/new and:
1. Import your GitHub repository
2. Add environment variables:
   - \`VITE_SUPABASE_URL\`
   - \`VITE_SUPABASE_ANON_KEY\`
   - \`OPENAI_API_KEY\`
   - \`STRIPE_SECRET_KEY\` (optional)
   - \`VITE_STRIPE_PUBLISHABLE_KEY\` (optional)
3. Click Deploy

## Environment Variables

Add these in Vercel dashboard (Settings > Environment Variables):

\`\`\`
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
OPENAI_API_KEY=sk-proj-xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx (optional)
\`\`\`

## Stack Overview

- **Hosting**: Vercel
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **AI**: OpenAI (via Vercel Serverless Functions)
- **Payments**: Stripe (via Vercel Serverless Functions)

## API Endpoints

- \`/api/invoke-llm\` - OpenAI integration
- \`/api/create-checkout\` - Stripe checkout

## Update & Redeploy

\`\`\`bash
git add .
git commit -m "Update"
git push
\`\`\`

Vercel auto-deploys on push!

## Local Development

\`\`\`bash
# Create .env file
cp .env.example .env

# Add your keys to .env
# Then run:
npm run dev
\`\`\`

## Full Documentation

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete setup guide.
