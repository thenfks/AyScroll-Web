# Fix: User Profile Not Found Error

## Problem
You're seeing errors like:
```
Error loading user profile: {code: 'PGRST116', details: 'The result contains 0 rows', hint: null, message: 'Cannot coerce the result to a single JSON object'}
```

This happens because:
1. The database migrations haven't been applied yet
2. The user signed up before the `user_profiles` table was created
3. The trigger to auto-create profiles isn't active

## Solution

### Step 1: Apply Database Migrations

Run these SQL scripts in your Supabase SQL Editor (https://supabase.com/dashboard/project/wbsepuoccppuqirtowzg/sql):

#### 1. Create User Profiles Table & Trigger
Copy and paste the entire contents of:
`supabase/migrations/20260112_create_user_profiles.sql`

This will:
- Create the `user_profiles` table
- Create all related tables (activity, follows, etc.)
- Set up the trigger to auto-create profiles
- Enable RLS policies

#### 2. Update Username Generation
Copy and paste the entire contents of:
`supabase/migrations/20260112_1649_update_username_generation.sql`

This will update the username generation to format: `maya-{first3letters}-{4digits}`

### Step 2: Create Profile for Existing Users

For users who signed up before the migrations, manually create their profiles:

```sql
-- Replace the user_id with your actual user ID from the error message
INSERT INTO public.user_profiles (
    id,
    username,
    display_name,
    email,
    avatar_url
)
SELECT 
    id,
    'maya-' || LOWER(SUBSTRING(COALESCE(raw_user_meta_data->>'name', 'user'), 1, 3)) || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name'),
    email,
    COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture')
FROM auth.users
WHERE id = '2b560478-b6a9-4ed4-ad27-e57794cf00b5' -- Replace with actual user ID
ON CONFLICT (id) DO NOTHING;
```

Or create profiles for ALL existing users at once:

```sql
INSERT INTO public.user_profiles (
    id,
    username,
    display_name,
    email,
    avatar_url
)
SELECT 
    id,
    'maya-' || LOWER(SUBSTRING(COALESCE(raw_user_meta_data->>'name', 'user'), 1, 3)) || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name'),
    email,
    COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;
```

### Step 3: Verify

Check that profiles were created:

```sql
SELECT 
    up.id,
    up.username,
    up.display_name,
    up.email,
    au.email as auth_email
FROM public.user_profiles up
JOIN auth.users au ON au.id = up.id
ORDER BY up.created_at DESC;
```

### Step 4: Test

1. Refresh your app
2. The errors should be gone
3. You should see your username, display name, and avatar

## Future Users

All new users who sign up after applying the migrations will automatically get:
- A profile record in `user_profiles`
- A username like `maya-may-1234`
- Their Google/nFKs avatar and name

## Quick Fix (One Command)

Run this in SQL Editor to do everything at once:

```sql
-- Apply migrations and create profiles for existing users
BEGIN;

-- Create profiles for all existing users who don't have one
INSERT INTO public.user_profiles (
    id,
    username,
    display_name,
    email,
    avatar_url
)
SELECT 
    id,
    'maya-' || LOWER(SUBSTRING(COALESCE(raw_user_meta_data->>'name', 'user'), 1, 3)) || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name'),
    email,
    COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

COMMIT;
```

After running this, refresh your app and the errors should be gone! ✅
