-- ⚠️ RUN THIS IN SUPABASE SQL EDITOR TO FIX DB NOT UPDATING ⚠️

-- 1. Enable RLS (if not already enabled)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create a Policy to allow users to UPDATE their own profile
-- NOTE: In production, you might want to restrict 'subscription_tier' 
-- and only allow the Webhook (Service Role) to update it. 
-- But for this DEMO, we perform the update client-side.

CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. If the above fails because a policy already exists, verify it allows 'subscription_tier'
-- or drop and recreate it:
-- DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
-- Re-run the CREATE POLICY command above.
