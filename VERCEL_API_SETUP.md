# Vercel API Setup for Multi-Tenant VibeDeveloper

This document outlines the Vercel serverless functions setup for the multi-tenant VibeDeveloper application.

## API Endpoints

### 1. `/api/generate-project` - AI Project Generation

**Method:** POST  
**Authentication:** Required (Bearer token)  
**Headers:** 
- `Authorization: Bearer <supabase_jwt>`
- `X-Tenant-ID: <tenant_uuid>`

**Request Body:**
```json
{
  "tenant_id": "uuid",
  "prompt": "Create a modern e-commerce website",
  "projectType": "web-app",
  "framework": "react",
  "styling": "tailwind",
  "features": ["authentication", "payments", "admin-panel"]
}
```

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "title": "Generated Project",
    "description": "AI-generated project",
    "status": "generated"
  },
  "generated_content": {
    "wireframe_data": {},
    "components": {},
    "pages": {},
    "package_json": {},
    "readme": "..."
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 2000,
    "total_tokens": 2150
  }
}
```

### 2. `/api/create-checkout` - Stripe Checkout

**Method:** POST  
**Authentication:** Required (Bearer token)  
**Headers:** 
- `Authorization: Bearer <supabase_jwt>`
- `X-Tenant-ID: <tenant_uuid>`

**Request Body:**
```json
{
  "priceId": "price_1234567890",
  "tenantId": "uuid",
  "planName": "Pro Plan"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/...",
  "session_id": "cs_1234567890"
}
```

### 3. `/api/invoke-llm` - General LLM Chat

**Method:** POST  
**Authentication:** Required (Bearer token)  
**Headers:** 
- `Authorization: Bearer <supabase_jwt>`

**Request Body:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "Hello!"}
  ],
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "content": "Hello! How can I help you today?",
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 10,
    "total_tokens": 30
  }
}
```

### 4. `/api/stripe-webhook` - Stripe Webhook Handler

**Method:** POST  
**Authentication:** Stripe signature verification  
**Headers:** 
- `stripe-signature: <webhook_signature>`

Handles the following Stripe events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 5. `/api/tenant-info` - Tenant Information

**Method:** GET  
**Authentication:** None (public endpoint)  
**Query Parameters:**
- `slug`: Tenant slug (e.g., "vibedeveloper")
- `domain`: Custom domain (e.g., "vibedeveloper.com")
- `subdomain`: Subdomain (e.g., "vibedeveloper")
- `id`: Tenant UUID

**Response:**
```json
{
  "tenant": {
    "id": "uuid",
    "name": "VibeDeveloper AI",
    "slug": "vibedeveloper",
    "domain": "vibedeveloper.com",
    "subdomain": "vibedeveloper",
    "settings": {
      "theme": "developer",
      "features": ["projects", "templates"]
    },
    "is_active": true
  }
}
```

## Environment Variables

### Required for All Functions
```env
VITE_SUPABASE_URL=https://ozzjcuamqslxjcfgtfhj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Required for Admin Operations (Webhooks)
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Required for AI Functions
```env
OPENAI_API_KEY=your_openai_api_key
```

### Required for Payment Functions
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Security Features

### Authentication
- All API endpoints (except tenant-info and webhooks) require Supabase JWT authentication
- User authentication is verified before processing requests
- Tenant membership is validated for tenant-specific operations

### Tenant Isolation
- All operations are scoped to the user's current tenant
- Cross-tenant data access is prevented
- Tenant ID is validated against user membership

### Webhook Security
- Stripe webhook signatures are verified
- Service role key is used for admin database operations
- Raw request body is preserved for signature verification

## Frontend Integration

### Supabase Client Updates
The Supabase client has been updated to use Vercel API endpoints:

```javascript
import { supabaseHelpers } from '@/api/supabaseClient';

// Generate a project
const result = await supabaseHelpers.generateProject(
  "Create a modern blog platform",
  {
    framework: "react",
    styling: "tailwind"
  }
);

// Create checkout session
const checkout = await supabaseHelpers.createCheckoutSession(
  "price_1234567890",
  "Pro Plan"
);

// Invoke LLM
const response = await supabaseHelpers.invokeLLM({
  messages: [
    { role: "user", content: "Help me with React hooks" }
  ]
});
```

### Tenant Context
The TenantProvider automatically:
- Detects tenant from domain/subdomain
- Sets tenant context for API calls
- Handles tenant switching

```jsx
import { useTenant } from '@/lib/TenantContext';

const { tenant, isVibeDeveloper, isAiEdu } = useTenant();
```

## Deployment Checklist

### 1. Environment Variables in Vercel
Set the following environment variables in your Vercel project:

```bash
# Supabase
VITE_SUPABASE_URL=https://ozzjcuamqslxjcfgtfhj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Stripe Webhook Configuration
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 3. Domain Configuration
Configure custom domains in Vercel:
- `vibedeveloper.yourapp.com` → VibeDeveloper tenant
- `aiedu.yourapp.com` → AI Edu tenant

### 4. CORS Configuration
API endpoints include CORS headers for cross-origin requests.

## Testing

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test with tenant parameter
http://localhost:5173?tenant=vibedeveloper
```

### API Testing
```bash
# Test tenant info
curl "http://localhost:5173/api/tenant-info?slug=vibedeveloper"

# Test project generation (requires auth)
curl -X POST "http://localhost:5173/api/generate-project" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "X-Tenant-ID: <tenant_id>" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple blog", "tenant_id": "<tenant_id>"}'
```

## Monitoring

### Error Handling
- All functions include comprehensive error handling
- Errors are logged to Vercel function logs
- Client receives appropriate error messages

### Performance
- Functions are optimized for cold start performance
- Database queries are efficient with proper indexing
- OpenAI API calls include timeout handling

### Logging
- Request/response logging for debugging
- Error tracking with stack traces
- Webhook event processing logs

This Vercel API setup provides a robust, scalable backend for the multi-tenant VibeDeveloper application with proper security, error handling, and monitoring.