# Architecture Overview

## New Stack Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           React App (Vite + React Router)                │  │
│  │                                                          │  │
│  │  - Components (UI)                                       │  │
│  │  - Pages (Routes)                                        │  │
│  │  - Hooks (useAuth, etc.)                                 │  │
│  └────────────────┬─────────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────────┘
                    │
                    │ HTTPS
                    │
    ┌───────────────┴─────────────┐
    │                             │
    ▼                             ▼
┌──────────┐            ┌────────────────────┐
│ GitHub   │            │    Supabase        │
│ Pages    │            │                    │
│          │            │  ┌──────────────┐  │
│ - Static │            │  │ PostgreSQL   │  │
│   Files  │            │  │  Database    │  │
│ - SPA    │            │  └──────┬───────┘  │
│   Host   │            │         │          │
└──────────┘            │  ┌──────▼───────┐  │
                        │  │     Auth     │  │
                        │  │ (JWT tokens) │  │
                        │  └──────┬───────┘  │
                        │         │          │
                        │  ┌──────▼───────┐  │
                        │  │ Edge         │  │
                        │  │ Functions    │  │
                        │  │              │  │
                        │  │ - LLM        │  │
                        │  │ - Checkout   │  │
                        │  └──────┬───────┘  │
                        └─────────┼──────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  │                               │
                  ▼                               ▼
          ┌──────────────┐              ┌─────────────┐
          │   OpenAI /   │              │   Stripe    │
          │  Anthropic   │              │   Payment   │
          │     API      │              │  Processing │
          └──────────────┘              └─────────────┘
\`\`\`

## Request Flow Examples

### 1. User Authentication (OAuth)

\`\`\`
User Browser
    │
    │ 1. Click "Sign in with Google"
    ▼
Supabase Auth
    │
    │ 2. Redirect to Google OAuth
    ▼
Google Login
    │
    │ 3. User approves
    ▼
Supabase Auth
    │
    │ 4. Create session, generate JWT
    ▼
User Browser
    │
    │ 5. Store session in localStorage
    │ 6. Redirect to /Dashboard
    ▼
React App (Dashboard)
\`\`\`

### 2. Creating a Project

\`\`\`
User Browser (Dashboard)
    │
    │ 1. User fills form, clicks "Create"
    ▼
React App
    │
    │ 2. Call supabaseHelpers.createProject(data)
    ▼
Supabase Client
    │
    │ 3. Send INSERT with JWT token
    ▼
Supabase Database
    │
    │ 4. Check RLS policy (user owns this row)
    │ 5. Insert row if authorized
    ▼
React App
    │
    │ 6. Receive new project data
    │ 7. Update UI
    ▼
User Browser (shows new project)
\`\`\`

### 3. AI/LLM Integration

\`\`\`
User Browser
    │
    │ 1. User enters prompt
    ▼
React App
    │
    │ 2. Call supabaseHelpers.invokeLLM(messages)
    ▼
Supabase Edge Function (invoke-llm)
    │
    │ 3. Verify JWT token
    │ 4. Extract user info
    ▼
OpenAI/Anthropic API
    │
    │ 5. Process prompt with AI model
    │ 6. Return completion
    ▼
Edge Function
    │
    │ 7. Format response
    ▼
React App
    │
    │ 8. Display AI response to user
    ▼
User Browser
\`\`\`

### 4. Payment Processing

\`\`\`
User Browser (Pricing Page)
    │
    │ 1. Click "Subscribe to Pro"
    ▼
React App
    │
    │ 2. Call supabase.functions.invoke('create-checkout')
    ▼
Supabase Edge Function (create-checkout)
    │
    │ 3. Verify JWT token
    │ 4. Get user email
    ▼
Stripe API
    │
    │ 5. Create checkout session
    │ 6. Return checkout URL
    ▼
Edge Function
    │
    │ 7. Return URL to client
    ▼
React App
    │
    │ 8. Redirect to Stripe Checkout
    ▼
Stripe Hosted Page
    │
    │ 9. User completes payment
    │
    │ On success:
    ▼
Stripe Webhook → Supabase Edge Function
    │
    │ 10. Update user_subscriptions table
    ▼
User redirected to Dashboard
\`\`\`

## Data Flow

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│                                                             │
│  State Management:                                          │
│  - useAuth() → User session & profile                       │
│  - useState() → Component state                             │
│  - useQuery() → Server state (optional)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ API Calls
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Supabase Client Library                        │
│                                                             │
│  - Auth: Session management, JWT tokens                    │
│  - Database: CRUD operations with RLS                       │
│  - Functions: Edge function invocations                     │
│  - Realtime: Subscriptions (optional)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Network (HTTPS)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Supabase Backend                         │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ PostgreSQL Database                                │    │
│  │                                                    │    │
│  │  Tables:                                           │    │
│  │  - projects (user projects)                        │    │
│  │  - user_subscriptions (billing)                    │    │
│  │  - templates (app templates)                       │    │
│  │  - example_projects (showcase)                     │    │
│  │  - pricing_plans (product plans)                   │    │
│  │  - discount_codes (promotions)                     │    │
│  │  - announcements (notifications)                   │    │
│  │                                                    │    │
│  │  + Row Level Security policies                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Edge Functions (Deno runtime)                      │    │
│  │                                                    │    │
│  │  - create-checkout (Stripe integration)            │    │
│  │  - invoke-llm (AI/LLM integration)                 │    │
│  │  - stripe-webhook (future: payment events)         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Security Model

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  Row Level Security (RLS)                   │
│                                                             │
│  Every database query is automatically filtered:            │
│                                                             │
│  SELECT * FROM projects                                     │
│      ↓                                                      │
│  SELECT * FROM projects                                     │
│    WHERE user_id = auth.uid()  ← Automatic RLS             │
│                                                             │
│  This means:                                                │
│  - Users can only see their own data                        │
│  - No way to access other users' projects                   │
│  - Enforced at database level, not app level                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    JWT Authentication                       │
│                                                             │
│  1. User signs in → Supabase generates JWT                  │
│  2. JWT stored in browser (localStorage/cookie)             │
│  3. Every API request includes JWT in header                │
│  4. Supabase verifies JWT signature                         │
│  5. Extracts user_id from JWT                               │
│  6. Uses user_id in RLS policies                            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Deployment Pipeline

\`\`\`
Developer's Machine
    │
    │ git add . && git commit -m "changes"
    │ git push origin main
    ▼
GitHub Repository
    │
    │ Trigger: Push to main branch
    ▼
GitHub Actions
    │
    │ 1. Checkout code
    │ 2. Install Node.js
    │ 3. npm ci (install dependencies)
    │ 4. npm run build (build production bundle)
    │ 5. Inject environment variables from secrets
    ▼
Build Artifacts (dist/)
    │
    │ Upload to GitHub Pages
    ▼
GitHub Pages CDN
    │
    │ Serve static files globally
    ▼
Users around the world
\`\`\`

## Key Differences from Base44

| Aspect | Base44 | New Stack (Supabase) |
|--------|--------|---------------------|
| **Hosting** | Base44 Platform | GitHub Pages (Free) |
| **Database** | Base44 Managed | PostgreSQL (Supabase) |
| **Auth** | Base44 Auth | Supabase Auth (OAuth, JWT) |
| **Backend Logic** | Base44 Functions | Supabase Edge Functions |
| **Cost** | Variable pricing | Free tier + $25/mo Pro |
| **Vendor Lock-in** | High | Low (open source) |
| **Self-hosting** | No | Yes (Supabase is open source) |
| **API Style** | \`base44.entities.X\` | \`supabase.from('X')\` |
| **Real-time** | Limited | Built-in subscriptions |
| **File Storage** | Limited | Supabase Storage (S3-like) |

## Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **State**: React Context + hooks

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (JWT + OAuth)
- **API**: Supabase Client (REST + WebSocket)
- **Functions**: Deno-based Edge Functions
- **Storage**: Supabase Storage (optional)

### Infrastructure
- **Frontend Host**: GitHub Pages
- **Backend Host**: Supabase Cloud
- **CI/CD**: GitHub Actions
- **Domain**: GitHub Pages (+ custom domain optional)

### External Services
- **AI/LLM**: OpenAI or Anthropic
- **Payments**: Stripe
- **Analytics**: (Your choice - GA, Plausible, etc.)

## Scaling Considerations

### Free Tier Limits
- 500MB database storage
- 2GB bandwidth/month
- 50,000 monthly active users
- 2M Edge Function invocations

### When to Upgrade
- \> 500MB data
- \> 50K MAU
- Need more bandwidth
- Need better support

### Horizontal Scaling
- Supabase handles database scaling
- GitHub Pages is globally distributed CDN
- Edge Functions auto-scale

### Future Optimizations
- Add Redis for caching
- Use Supabase Realtime for live updates
- Implement service workers for offline mode
- Add CDN for assets (Cloudflare)
