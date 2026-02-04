# Authentication System

## Overview
VibeDeveloper AI uses Supabase email/password authentication with custom name collection during signup. No Google or social auth - just simple, secure email/password.

## Features

### 1. Email/Password Authentication
- Standard email and password login
- Minimum 6 character password requirement
- Email verification on signup
- Secure password hashing via Supabase

### 2. User Profile with Name
During signup, users provide:
- **Full Name** (required)
- **Email** (required)
- **Password** (required, min 6 chars)
- **Confirm Password** (must match)

### 3. Profile Creation
On successful signup:
1. User account created in Supabase Auth
2. Profile entry created in `profiles` table with:
   - `id` (matches auth user id)
   - `email`
   - `full_name`
   - `role` (defaults to 'user')
   - `created_date`

## User Flow

### New User Signup
1. Visit `/Auth` page
2. Click "Sign up" toggle
3. Enter full name, email, password
4. Submit form
5. Receive verification email
6. Click verification link
7. Redirected to login
8. Sign in and access dashboard

### Returning User Login
1. Visit `/Auth` page
2. Enter email and password
3. Click "Sign In"
4. Redirected to `/Dashboard`

## Pages

### Auth Page (`/Auth`)
**Location**: `src/pages/Auth.jsx`

**Features**:
- Toggle between Login and Signup modes
- Form validation
- Error handling
- Success messages
- Loading states
- Mobile responsive

**Components Used**:
- Card (for container)
- Input (for form fields)
- Button (for submit)
- Alert (for errors/success)
- Label (for field labels)

### Home Page (`/`)
**Updated**: Now redirects to `/Auth` instead of base44 login

**Button Action**:
```javascript
const handleGetStarted = () => {
  window.location.href = '/Auth';
};
```

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Authentication Context

### AuthContext (`src/lib/AuthContext.jsx`)
Provides authentication state throughout the app:

```javascript
const { 
  user,              // Current user object
  isAuthenticated,   // Boolean auth status
  isLoadingAuth,     // Loading state
  authError,         // Error object
  logout,            // Logout function
  navigateToLogin    // Redirect to login
} = useAuth();
```

### Protected Routes
Routes automatically check authentication via `AuthenticatedApp` component in `App.jsx`.

## API Integration

### Signup Flow
```javascript
// 1. Create auth user
const { data: authData, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName,
    }
  }
});

// 2. Create profile entry
await supabase
  .from('profiles')
  .insert([{
    id: authData.user.id,
    email: formData.email,
    full_name: formData.fullName,
    role: 'user'
  }]);
```

### Login Flow
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
});
```

### Logout Flow
```javascript
await supabase.auth.signOut();
```

## Security Features

### 1. Password Requirements
- Minimum 6 characters
- Enforced on both client and server
- Hashed using bcrypt via Supabase

### 2. Email Verification
- Verification email sent on signup
- User must verify before full access
- Configurable in Supabase dashboard

### 3. Session Management
- JWT tokens stored in httpOnly cookies
- Automatic token refresh
- Secure session handling via Supabase

### 4. CSRF Protection
- Built into Supabase Auth
- Tokens validated on each request

## Error Handling

### Common Errors
```javascript
// Invalid credentials
"Invalid login credentials"

// Email already exists
"User already registered"

// Weak password
"Password should be at least 6 characters"

// Network error
"Failed to connect to authentication service"
```

### Error Display
Errors shown in Alert component at top of form:
```jsx
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

## Validation

### Client-Side
- Email format validation (HTML5)
- Password length check (min 6)
- Password confirmation match
- Required field checks
- Real-time error display

### Server-Side
- Supabase validates email format
- Password strength requirements
- Duplicate email prevention
- Rate limiting on auth attempts

## User Experience

### Loading States
```jsx
{loading ? (
  <>
    <Loader2 className="animate-spin" />
    Creating account...
  </>
) : (
  'Create Account'
)}
```

### Success Messages
```jsx
{success && (
  <Alert className="bg-green-50 text-green-900">
    <AlertDescription>{success}</AlertDescription>
  </Alert>
)}
```

### Auto-Switch After Signup
After successful signup, automatically switches to login mode after 3 seconds.

## Mobile Optimization

### Responsive Design
- Full-width on mobile
- Touch-friendly inputs
- Proper keyboard types (email, password)
- Accessible tap targets

### Form Fields
```jsx
<Input
  type="email"
  inputMode="email"
  autoComplete="email"
  className="rounded-xl"
/>
```

## Future Enhancements

### Phase 2
- [ ] Password reset via email
- [ ] Remember me checkbox
- [ ] Two-factor authentication (2FA)
- [ ] Social auth (optional)
- [ ] Magic link login

### Phase 3
- [ ] Biometric authentication (mobile)
- [ ] Session management dashboard
- [ ] Login history
- [ ] Account deletion
- [ ] Export user data

## Testing Checklist

### Signup Flow
- [ ] Create account with valid data
- [ ] Verify email sent
- [ ] Click verification link
- [ ] Login with new account
- [ ] Profile created in database
- [ ] Full name displayed in dashboard

### Login Flow
- [ ] Login with valid credentials
- [ ] Error on invalid password
- [ ] Error on non-existent email
- [ ] Redirect to dashboard on success
- [ ] Session persists on refresh

### Validation
- [ ] Email format validation
- [ ] Password length validation
- [ ] Password match validation
- [ ] Required field validation
- [ ] Error messages display correctly

### Security
- [ ] Passwords not visible in network tab
- [ ] Session tokens secure
- [ ] Logout clears session
- [ ] Protected routes require auth

## Environment Variables

No additional environment variables needed - uses existing Supabase config:
```env
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## Troubleshooting

### "User already registered"
- Email already exists in system
- Try logging in instead
- Use password reset if forgotten

### "Invalid login credentials"
- Check email spelling
- Verify password is correct
- Ensure account is verified

### Email not received
- Check spam folder
- Verify email address is correct
- Resend verification email

### Session expires quickly
- Check Supabase JWT expiry settings
- Ensure refresh token is working
- Clear browser cache and retry

---

**Status**: ✅ Complete - Email/Password Auth  
**Version**: 1.0  
**Last Updated**: February 4, 2026  
**No Google Auth**: Email/password only
