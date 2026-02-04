# VibeDeveloper AI

AI-powered application builder with visual wireframe generation.

## 🚀 Quick Start

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vibedeveloperai)

See [DEPLOY.md](./DEPLOY.md) for quick deployment guide.

### Local Development

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your credentials
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

Visit http://localhost:5173

## 🏗 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI API
- **Payments**: Stripe

## 📁 Project Structure

\`\`\`
/
├── api/                        # Vercel Serverless Functions
│   ├── invoke-llm.js          # OpenAI integration
│   └── create-checkout.js     # Stripe payments
├── src/
│   ├── api/
│   │   └── supabaseClient.js  # Supabase client
│   ├── lib/
│   │   └── SupabaseAuthContext.jsx
│   ├── pages/                 # React pages
│   └── components/            # React components
├── supabase/
│   └── schema.sql             # Database schema
├── vercel.json                # Vercel config
└── package.json
\`\`\`

## 🔑 Environment Variables

Required variables:

\`\`\`env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
OPENAI_API_KEY=sk-proj-xxxxx
\`\`\`

Optional (for payments):

\`\`\`env
STRIPE_SECRET_KEY=sk_test_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
\`\`\`

## 📖 Documentation

- [DEPLOY.md](./DEPLOY.md) - Quick deployment guide
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Detailed Vercel setup
- [COMPONENT_MIGRATION.md](./COMPONENT_MIGRATION.md) - Code migration guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-launch checklist

## 🛠 Development

### Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
\`\`\`

### Testing Locally

\`\`\`bash
vercel dev       # Run with Vercel CLI (includes serverless functions)
\`\`\`

## 🔒 Security

- Environment variables stored in Vercel dashboard
- Row Level Security (RLS) enabled in Supabase
- JWT-based authentication
- API routes protected by auth middleware

## 📦 Deployment

### Automatic Deployment

Every push to \`main\` triggers automatic deployment to Vercel.

### Manual Deployment

\`\`\`bash
vercel --prod
\`\`\`

## 🐛 Troubleshooting

### Build Errors

Check that all environment variables are set in Vercel dashboard.

### API Errors

1. Verify OpenAI API key is valid
2. Check Supabase credentials
3. Review function logs in Vercel dashboard

### Auth Issues

1. Verify Supabase redirect URLs include your Vercel domain
2. Check auth provider is enabled in Supabase

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Need help?** Check the documentation files or open an issue.
