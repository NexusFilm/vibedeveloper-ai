# VibeDeveloper Troubleshooting Guide

This guide helps resolve common issues with the VibeDeveloper application.

## 🚨 Current Issues & Solutions

### React Error #419 (Suspense Boundary Error)

**Symptoms:**
- `Uncaught Error: Minified React error #419`
- App fails to load or shows blank screen
- Console shows "The server could not finish this Suspense boundary"

**Root Cause:**
Server-side rendering fails due to async operations in TenantProvider during initial render.

**Solution Applied:**
✅ Updated TenantContext to handle SSR properly
✅ Added client-side detection before making API calls
✅ Added fallback tenant data for server-side rendering
✅ Added comprehensive error handling

### Content Security Policy (CSP) Font Error

**Symptoms:**
- `Loading the font 'https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2' violates CSP`

**Solution:**
Add to your Vercel headers configuration or remove the problematic font reference.

### Vercel API 404 Errors

**Symptoms:**
- Multiple 404 errors for `/api/v1/projects/nexusprompt/production-deployment`
- `/api/v2/projects/nexusprompt` not found

**Root Cause:**
These are Vercel dashboard API calls, not your application APIs.

**Solution:**
These errors are normal and don't affect your application functionality.

### Missing customEnvironment Property

**Symptoms:**
- `Cannot read properties of undefined (reading 'customEnvironment')`

**Root Cause:**
JavaScript trying to access undefined object properties.

**Solution Applied:**
✅ Added ErrorBoundary component to catch and handle errors gracefully
✅ Improved error handling in TenantContext

## 🔧 Debugging Steps

### 1. Check Environment Variables

Ensure these are set in your Vercel project:

```bash
# Required
VITE_SUPABASE_URL=https://ozzjcuamqslxjcfgtfhj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For AI features
OPENAI_API_KEY=sk-...

# For payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Test API Endpoints

Use the debug script in browser console:

```javascript
// Copy and paste debug-production.js content into browser console
// Or run individual checks:
await window.debugVibeDeveloper.checkAPIs();
await window.debugVibeDeveloper.checkSupabase();
```

### 3. Check Network Tab

Look for failed requests:
- ✅ `/api/tenant-info` should return 200
- ✅ `/api/generate-project` should return 200 (with auth)
- ❌ Vercel dashboard APIs (404s are normal)

### 4. Verify Database Connection

```javascript
// In browser console
const { supabase } = await import('./src/api/supabaseClient.js');
const { data, error } = await supabase.from('tenants').select('*').limit(1);
console.log('Tenants:', data, error);
```

## 🛠️ Common Fixes

### Fix 1: Clear Browser Cache

```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or clear all browser data for the site
```

### Fix 2: Redeploy with Environment Variables

```bash
# In your local project
vercel --prod

# Or redeploy from Vercel dashboard
```

### Fix 3: Check Supabase RLS Policies

```sql
-- Verify tenant policies are working
SELECT * FROM tenants WHERE is_active = true;

-- Check if user can access tenant
SELECT * FROM tenant_members WHERE user_id = auth.uid();
```

### Fix 4: Verify Stripe Webhook

```bash
# Test webhook endpoint
curl -X POST https://your-domain.vercel.app/api/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📊 Monitoring & Logging

### Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on any function to see logs

### Browser Console Monitoring

```javascript
// Enable detailed logging
localStorage.setItem('debug', 'vibedeveloper:*');

// Monitor React errors
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Monitor unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});
```

### Supabase Logs

1. Go to Supabase Dashboard
2. Select your project
3. Go to "Logs" section
4. Filter by API, Auth, or Database logs

## 🚀 Performance Optimization

### 1. Reduce Bundle Size

```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist

# Remove unused dependencies
npm uninstall unused-package
```

### 2. Optimize Images

```javascript
// Use next/image or similar optimization
<img 
  src="/image.jpg" 
  loading="lazy" 
  width="300" 
  height="200" 
  alt="Description"
/>
```

### 3. Code Splitting

```javascript
// Lazy load components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Use Suspense
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

## 🔒 Security Checklist

- ✅ Environment variables are set correctly
- ✅ Supabase RLS policies are enabled
- ✅ API endpoints validate authentication
- ✅ Stripe webhooks verify signatures
- ✅ CORS headers are configured properly

## 📞 Getting Help

If issues persist:

1. **Check this guide first** - Most issues are covered here
2. **Run the debug script** - Provides detailed diagnostic info
3. **Check browser console** - Look for specific error messages
4. **Verify environment variables** - Ensure all required vars are set
5. **Test API endpoints** - Use curl or Postman to test directly

## 🔄 Recent Fixes Applied

- ✅ Fixed React #419 error with improved TenantContext
- ✅ Added ErrorBoundary for graceful error handling
- ✅ Improved webhook body parsing for Vercel
- ✅ Added server-side rendering compatibility
- ✅ Enhanced error logging and debugging tools

## 📈 Health Check URLs

Test these URLs to verify your deployment:

- `https://your-domain.vercel.app/api/tenant-info?slug=vibedeveloper`
- `https://your-domain.vercel.app/?tenant=vibedeveloper`
- `https://your-domain.vercel.app/Dashboard`

All should return 200 status codes or proper redirects.