# SUPABASE REDIRECT URL CONFIGURATION FIX

## Problem
Email confirmation redirects to localhost:3000 instead of production dashboard

## Solution
Update Supabase Auth settings with correct redirect URLs

## Steps to Fix

### 1. Go to Supabase Dashboard
- Navigate to: https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd
- Go to Authentication → URL Configuration

### 2. Update Site URL
- Change from: `http://localhost:3000`
- Change to: `https://callwaitingai.dev`

### 3. Update Redirect URLs
Add these URLs to the "Redirect URLs" list:
- `https://callwaitingai.dev/auth/callback`
- `https://callwaitingai.dev/dashboard`
- `https://callwaitingai.dev/login`
- `https://callwaitingai.dev/signup`

### 4. Update Additional Redirect URLs
Add these URLs to the "Additional Redirect URLs" list:
- `https://callwaitingai.dev/auth/reset-password`
- `https://callwaitingai.dev/success`

### 5. Save Configuration
Click "Save" to apply the changes

## Verification
After updating:
1. Try signing up with a new email
2. Check email confirmation link
3. Verify it redirects to https://callwaitingai.dev/dashboard

## Current Environment Variables
- NEXT_PUBLIC_APP_URL=https://callwaitingai.dev ✅
- NEXT_PUBLIC_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co ✅
