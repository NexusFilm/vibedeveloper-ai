#!/bin/bash

# VibeDeveloper AI - Deployment Script
# This script helps you deploy to Vercel

echo "🚀 VibeDeveloper AI - Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - migrated from Base44 to Vercel"
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Next steps:"
echo ""
echo "1️⃣  Create GitHub repository:"
echo "   Go to https://github.com/new"
echo "   Name: vibedeveloperai"
echo "   Don't initialize with README"
echo ""
echo "2️⃣  Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/vibedeveloperai.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  Set up Supabase:"
echo "   1. Go to https://supabase.com"
echo "   2. Create new project"
echo "   3. Run SQL from supabase/schema.sql"
echo "   4. Enable Auth providers"
echo "   5. Copy Project URL and Anon Key"
echo ""
echo "4️⃣  Deploy to Vercel:"
echo "   1. Go to https://vercel.com/new"
echo "   2. Import your GitHub repository"
echo "   3. Add environment variables:"
echo "      - VITE_SUPABASE_URL"
echo "      - VITE_SUPABASE_ANON_KEY"
echo "      - OPENAI_API_KEY"
echo "   4. Click Deploy"
echo ""
echo "5️⃣  Update Supabase redirects:"
echo "   Add your Vercel URL to Supabase Auth settings"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - DEPLOY.md (quick guide)"
echo "   - VERCEL_DEPLOYMENT.md (detailed guide)"
echo "   - SETUP_COMPLETE.md (migration summary)"
echo ""
echo "💡 Need help? Check the documentation files!"
echo ""
