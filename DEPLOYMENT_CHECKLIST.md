# Pre-Deployment Checklist

Use this checklist before deploying to production.

## Local Setup ✓

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (\`npm install\`)
- [ ] .env file created from .env.example
- [ ] .env has all required values filled in

## Supabase Setup ✓

- [ ] Supabase account created
- [ ] New project created
- [ ] Database schema deployed (schema.sql)
- [ ] Authentication enabled
  - [ ] Email auth enabled
  - [ ] OAuth provider configured (Google/GitHub)
  - [ ] Redirect URLs added
- [ ] Edge Functions deployed
  - [ ] create-checkout function
  - [ ] invoke-llm function
- [ ] Edge Function secrets set
  - [ ] STRIPE_SECRET_KEY
  - [ ] OPENAI_API_KEY (or other LLM API key)
- [ ] RLS policies verified
- [ ] Test data added (optional)

## GitHub Setup ✓

- [ ] GitHub account ready
- [ ] Repository created
- [ ] Code pushed to main branch
- [ ] GitHub Pages enabled (Settings > Pages)
- [ ] GitHub Actions enabled
- [ ] Repository secrets added:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_STRIPE_PUBLISHABLE_KEY

## Code Migration ✓

- [ ] Layout.jsx updated
- [ ] Home.jsx updated
- [ ] Dashboard.jsx updated
- [ ] NewProject.jsx updated
- [ ] ProjectResult.jsx updated
- [ ] PromptEditor.jsx updated
- [ ] Examples.jsx updated
- [ ] Templates.jsx updated
- [ ] Pricing.jsx updated
- [ ] AdminDashboard.jsx updated
- [ ] All wizard components updated
- [ ] ChatRefinement.jsx updated
- [ ] NavigationTracker.jsx updated
- [ ] PageNotFound.jsx updated

## Testing (Local) ✓

- [ ] App runs locally (\`npm run dev\`)
- [ ] No console errors
- [ ] User can sign up
- [ ] User can sign in
- [ ] User can sign out
- [ ] Projects can be created
- [ ] Projects can be viewed
- [ ] Projects can be edited
- [ ] Projects can be deleted
- [ ] LLM integration works
- [ ] Payments work (test mode)

## Build ✓

- [ ] Build completes successfully (\`npm run build\`)
- [ ] No build errors or warnings
- [ ] Preview build works (\`npm run preview\`)

## Deployment ✓

- [ ] Code committed to git
- [ ] Code pushed to GitHub
- [ ] GitHub Action runs successfully
- [ ] Site deploys to GitHub Pages
- [ ] Deployment URL accessible

## Testing (Production) ✓

- [ ] Production site loads
- [ ] Authentication works
- [ ] OAuth redirect works
- [ ] User can create account
- [ ] User can create project
- [ ] Database operations work
- [ ] Edge Functions respond
- [ ] Payments work (if applicable)
- [ ] No CORS errors
- [ ] Mobile responsive
- [ ] All pages accessible

## Stripe Setup (if using payments) ✓

- [ ] Stripe account created
- [ ] Products created in Stripe
- [ ] Prices created
- [ ] Webhooks configured
- [ ] Webhook secret added to Supabase
- [ ] Test mode verified
- [ ] Live mode enabled (when ready)

## DNS & Domain (optional) ✓

- [ ] Custom domain purchased
- [ ] DNS configured
- [ ] CNAME record added
- [ ] SSL certificate active
- [ ] Domain works with https://

## Monitoring & Analytics ✓

- [ ] Supabase dashboard accessible
- [ ] Database usage monitored
- [ ] Edge Function logs reviewed
- [ ] GitHub Actions monitored
- [ ] Error tracking setup (optional)
- [ ] Analytics setup (optional)

## Security ✓

- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] RLS policies tested
- [ ] Auth redirects verified
- [ ] CORS configured correctly
- [ ] Rate limiting considered

## Performance ✓

- [ ] Build size optimized
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Code splitting used
- [ ] Lighthouse score checked

## Documentation ✓

- [ ] README.md updated
- [ ] Environment variables documented
- [ ] Setup instructions clear
- [ ] Deployment process documented

## Post-Launch ✓

- [ ] Monitor Supabase usage
- [ ] Check for errors
- [ ] Review user feedback
- [ ] Plan for scaling
- [ ] Backup strategy in place

## Cleanup (After successful migration) ✓

- [ ] Remove Base44 dependencies
- [ ] Delete base44Client.js
- [ ] Delete old AuthContext.jsx
- [ ] Delete app-params.js
- [ ] Remove unused functions
- [ ] Update README with new stack

---

## Quick Commands Reference

\`\`\`bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy Supabase functions
supabase functions deploy create-checkout
supabase functions deploy invoke-llm

# Set Supabase secrets
supabase secrets set STRIPE_SECRET_KEY=sk_xxx
supabase secrets set OPENAI_API_KEY=sk-xxx

# Deploy to GitHub
git add .
git commit -m "Deploy"
git push origin main
\`\`\`

---

**Tip**: Work through this checklist systematically. Don't skip steps!
