# Stripe Webhook Setup Guide

## Current Status ✅
- ✅ Build is working (no more base44 errors)
- ✅ Deployed to Vercel: https://nexusprompt-e85cvq1yq-derricchambers-gmailcoms-projects.vercel.app
- ✅ Webhook endpoint ready at: `/api/stripe-webhook`
- ✅ Stripe CLI installed and authenticated

## Next Steps to Complete Setup

### 1. Create Stripe Webhook Endpoint (Manual)

Since the Stripe CLI doesn't have a direct webhook creation command, you need to create it through the Dashboard:

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"** or "Create new destination"
3. **Enter webhook URL**: 
   ```
   https://nexusprompt-e85cvq1yq-derricchambers-gmailcoms-projects.vercel.app/api/stripe-webhook
   ```
4. **Select these events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. **Click "Add endpoint"**

### 2. Get Webhook Secret

After creating the endpoint:
1. Click on the newly created webhook endpoint
2. Copy the **Signing secret** (starts with `whsec_`)
3. This is what you'll need for the next step

### 3. Update Vercel Environment Variables

Add the webhook secret to Vercel:

```bash
# Add the webhook secret (replace with actual secret from step 2)
vercel env add STRIPE_WEBHOOK_SECRET

# Also add your Stripe keys if not already added:
vercel env add STRIPE_SECRET_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
```

Or use the Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...` (from step 2)
   - `STRIPE_SECRET_KEY` = `sk_test_...` (your Stripe secret key)
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...` (your Stripe publishable key)

### 4. Redeploy to Apply Environment Variables

```bash
vercel --prod
```

### 5. Test the Webhook

Use Stripe CLI to test:

```bash
# Test checkout session completion
stripe trigger checkout.session.completed

# Test payment success
stripe trigger payment_intent.succeeded
```

## Webhook Endpoint Details

Your webhook endpoint at `/api/stripe-webhook` handles:

- **Checkout Sessions**: Updates user subscription status
- **Payment Intents**: Confirms successful payments
- **Subscriptions**: Manages subscription lifecycle
- **Invoices**: Handles billing events

## Verification

The webhook endpoint includes:
- ✅ Signature verification using `STRIPE_WEBHOOK_SECRET`
- ✅ Tenant-aware database updates
- ✅ Error handling and logging
- ✅ Proper HTTP status responses

## Troubleshooting

### If webhook fails:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure webhook secret matches Dashboard
4. Test with Stripe CLI: `stripe listen --forward-to https://your-domain.vercel.app/api/stripe-webhook`

### Common Issues:
- **401 Unauthorized**: Check `STRIPE_WEBHOOK_SECRET`
- **500 Error**: Check `SUPABASE_SERVICE_ROLE_KEY`
- **Timeout**: Webhook processing should be under 10 seconds

## Next Steps After Setup

1. Test payment flow end-to-end
2. Verify subscription creation in Supabase
3. Test webhook events in Stripe Dashboard
4. Monitor webhook delivery success rates

## Files Modified

- ✅ `api/stripe-webhook.js` - Webhook handler
- ✅ `api/create-checkout.js` - Checkout session creation
- ✅ `src/api/base44Client.js` - Removed base44 dependencies
- ✅ `src/api/supabaseClient.js` - Added Stripe integration helpers
- ✅ All React components - Updated to use Supabase instead of base44

The integration is ready - just need to complete the webhook endpoint creation and environment variable setup!