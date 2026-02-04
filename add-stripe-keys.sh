#!/bin/bash

# 🔐 Add Stripe API Keys to Vercel
# This script helps you add your Stripe keys to the Vercel project

echo "🔐 Stripe API Keys Setup for Vercel"
echo "===================================="
echo ""
echo "📍 Get your Stripe keys from:"
echo "   https://dashboard.stripe.com/acct_1SQb8bJg9u093mYC/apikeys"
echo ""
echo "⚠️  You need TWO keys:"
echo "   1. Secret Key (starts with sk_test_ or sk_live_)"
echo "   2. Publishable Key (starts with pk_test_ or pk_live_)"
echo ""
echo "---------------------------------------------------"
echo ""

# Get Secret Key
echo "📝 Enter your Stripe SECRET KEY (starts with sk_):"
read -s STRIPE_SECRET_KEY
echo ""

# Get Publishable Key
echo "📝 Enter your Stripe PUBLISHABLE KEY (starts with pk_):"
read STRIPE_PUBLISHABLE_KEY
echo ""

# Validate keys
if [[ ! $STRIPE_SECRET_KEY =~ ^sk_ ]]; then
    echo "❌ Error: Secret key should start with 'sk_'"
    exit 1
fi

if [[ ! $STRIPE_PUBLISHABLE_KEY =~ ^pk_ ]]; then
    echo "❌ Error: Publishable key should start with 'pk_'"
    exit 1
fi

echo "✅ Keys validated!"
echo ""
echo "🚀 Adding keys to Vercel..."
echo ""

# Add Secret Key
echo "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production
if [ $? -eq 0 ]; then
    echo "✅ Secret key added to production"
else
    echo "❌ Failed to add secret key"
    exit 1
fi

# Add Publishable Key
echo "$STRIPE_PUBLISHABLE_KEY" | vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
if [ $? -eq 0 ]; then
    echo "✅ Publishable key added to production"
else
    echo "❌ Failed to add publishable key"
    exit 1
fi

echo ""
echo "🎉 Success! Stripe keys added to Vercel"
echo ""
echo "📝 Next steps:"
echo "   1. Deploy to apply changes: vercel --prod"
echo "   2. Update Stripe webhook URL in dashboard"
echo "   3. Test payment flow"
echo ""
echo "✨ All done!"
