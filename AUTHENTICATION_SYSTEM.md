# Authentication System Documentation

## Overview

CallWaiting AI now has a complete, production-ready authentication system with email verification, password reset, and user profile management.

## Features

### ✅ Complete Authentication Flow
- **Sign Up** with email verification
- **Sign In** with email/password or Google OAuth
- **Password Reset** via email
- **Email Verification** required for full access
- **Session Management** with automatic refresh
- **Route Protection** for dashboard pages

### ✅ User Management
- **Profile Management** - Update name and company
- **Password Change** - Secure password updates
- **Account Deletion** - Self-service account removal
- **Email Verification Status** - Visual indicators

### ✅ Security Features
- **Protected Routes** - Middleware-based protection
- **Session Persistence** - Automatic token refresh
- **Secure Password Storage** - Handled by Supabase
- **OAuth Integration** - Google sign-in support

## File Structure

```
├── app/
│   ├── login/page.tsx                 # Sign in page
│   ├── signup/page.tsx                # Sign up page with email verification
│   ├── forgot-password/page.tsx       # Password reset request
│   ├── auth/
│   │   ├── callback/route.ts          # OAuth callback handler
│   │   └── reset-password/page.tsx    # Password reset form
│   └── dashboard/
│       ├── layout.tsx                 # Protected dashboard layout
│       ├── page.tsx                   # Dashboard home
│       └── settings/page.tsx          # User profile settings
├── lib/
│   ├── supabase-client.ts             # Supabase client configuration
│   ├── auth-helpers.ts                # Authentication functions
│   └── api-client.ts                  # API functions for dashboard data
└── middleware.ts                       # Route protection middleware
```

## Authentication Functions

### Sign Up
```typescript
import { signUp } from '@/lib/auth-helpers'

const { data, error } = await signUp({
  email: 'user@example.com',
  password: 'securepassword',
  fullName: 'John Doe',
  company: 'Acme Inc'
})
```

### Sign In
```typescript
import { signIn } from '@/lib/auth-helpers'

const { data, error } = await signIn({
  email: 'user@example.com',
  password: 'securepassword'
})
```

### Sign In with Google
```typescript
import { signInWithGoogle } from '@/lib/auth-helpers'

const { error } = await signInWithGoogle()
```

### Sign Out
```typescript
import { signOut } from '@/lib/auth-helpers'

const { error } = await signOut()
```

### Reset Password
```typescript
import { resetPassword } from '@/lib/auth-helpers'

const { error } = await resetPassword({
  email: 'user@example.com'
})
```

### Update Password
```typescript
import { updatePassword } from '@/lib/auth-helpers'

const { error } = await updatePassword('newpassword')
```

### Get Current User
```typescript
import { getUser } from '@/lib/auth-helpers'

const { data, error } = await getUser()
const user = data?.user
```

## API Client Functions

### Get Usage Statistics
```typescript
import { getUsageStats } from '@/lib/api-client'

const { data, error } = await getUsageStats()
// Returns: total_calls, total_minutes, total_leads, etc.
```

### Get Call History
```typescript
import { getCalls } from '@/lib/api-client'

const { data, error } = await getCalls(50) // limit to 50 calls
```

### Get Leads
```typescript
import { getLeads } from '@/lib/api-client'

const { data, error } = await getLeads(50) // limit to 50 leads
```

### Update Lead Status
```typescript
import { updateLeadStatus } from '@/lib/api-client'

const { data, error } = await updateLeadStatus(leadId, 'contacted')
```

### Export Data to CSV
```typescript
import { exportToCSV } from '@/lib/api-client'

exportToCSV(calls, 'calls-export.csv')
exportToCSV(leads, 'leads-export.csv')
```

## Route Protection

The middleware automatically protects dashboard routes and redirects unauthenticated users to the login page:

```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password']
}
```

### Protected Routes
- `/dashboard/*` - Requires authentication
- `/dashboard/calls` - Call history
- `/dashboard/leads` - Lead management
- `/dashboard/payments` - Payment history
- `/dashboard/settings` - User settings
- `/dashboard/upgrade` - Upgrade plan

### Public Routes
- `/` - Homepage
- `/login` - Sign in
- `/signup` - Sign up
- `/forgot-password` - Password reset

## Email Verification

### How it Works
1. User signs up with email and password
2. Supabase sends verification email automatically
3. User clicks verification link in email
4. User is redirected to `/auth/callback`
5. Session is established and user is redirected to dashboard

### Verification Banner
A banner appears in the dashboard for unverified users with a "Resend Email" button.

## OAuth Integration

### Google Sign-In
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After approval, redirected to `/auth/callback`
4. Session is established and user is redirected to dashboard

### Configuration
Google OAuth must be configured in Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## Database Schema

### Required Tables

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  plan_name TEXT DEFAULT 'Free Trial',
  plan_limit INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### calls
```sql
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  customer_phone TEXT,
  duration INTEGER, -- in seconds
  status TEXT CHECK (status IN ('completed', 'missed', 'in_progress')),
  transcript TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  source TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Environment Variables

Required in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing the System

### 1. Sign Up Flow
1. Go to `/signup`
2. Fill in email, password, name, and company
3. Click "Create Account"
4. Check email for verification link
5. Click verification link
6. Redirected to dashboard

### 2. Sign In Flow
1. Go to `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to dashboard

### 3. Password Reset Flow
1. Go to `/forgot-password`
2. Enter email
3. Click "Send Reset Link"
4. Check email for reset link
5. Click reset link
6. Enter new password
7. Redirected to dashboard

### 4. Google OAuth Flow
1. Go to `/login`
2. Click "Sign in with Google"
3. Approve Google consent screen
4. Redirected to dashboard

## Error Handling

All authentication functions return a consistent response format:

```typescript
{
  data?: any,
  error?: {
    message: string,
    status?: number
  }
}
```

### Common Errors
- `Invalid login credentials` - Wrong email or password
- `Email not confirmed` - User hasn't verified email
- `User already registered` - Email already in use
- `Failed to fetch` - Network or Supabase connection issue

## Best Practices

1. **Always check for errors** in authentication responses
2. **Handle loading states** during async operations
3. **Show clear error messages** to users
4. **Validate input** before submitting forms
5. **Use secure passwords** (minimum 6 characters)
6. **Verify email addresses** before full access
7. **Log out users** after password changes
8. **Protect sensitive routes** with middleware

## Next Steps

### Recommended Enhancements
1. **Two-Factor Authentication (2FA)** - Add SMS or authenticator app
2. **Social Login** - Add more OAuth providers (Facebook, Twitter, etc.)
3. **Magic Links** - Passwordless authentication
4. **Session Management** - View and revoke active sessions
5. **Activity Log** - Track login history and security events
6. **Rate Limiting** - Prevent brute force attacks
7. **Email Templates** - Custom branded verification emails
8. **Account Recovery** - Additional recovery options

## Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Review browser console for errors
3. Check network tab for failed requests
4. Verify environment variables are set
5. Ensure database tables exist

## License

This authentication system is part of CallWaiting AI and follows the project's license.

