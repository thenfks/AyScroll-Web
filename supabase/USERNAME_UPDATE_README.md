# Username Generation Update

## Overview
This migration updates the `handle_new_user()` function to generate usernames in the format:
**`maya-{first3letters}-{4digits}`**

For example:
- User "Mayank Jha" → `maya-may-1234`
- User "John Doe" → `maya-joh-5678`
- User "Alice" → `maya-ali-9012`

## How to Apply

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wbsepuoccppuqirtowzg
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/20260112_1649_update_username_generation.sql`
5. Click **Run** to execute

### Option 2: Via CLI

```bash
# Navigate to project directory
cd /Users/mayankjha/Documents/nfks/ayscroll/temp-website

# Push the migration
supabase db push
# When prompted, select 'Y' for the new migration file
```

## What It Does

The updated function:
1. Extracts the first 3 letters of the user's name
2. Converts them to lowercase
3. Generates 4 random digits
4. Combines them as: `maya-{letters}-{digits}`
5. Checks for uniqueness and retries if needed
6. Falls back to UUID-based username if all attempts fail

## Testing

After applying, new users will automatically get usernames like:
- `maya-may-1234`
- `maya-joh-5678`
- `maya-ali-9012`

Users can edit their username later through the Profile Edit modal.

## Verification

To verify it's working, create a test user and check their username in the `user_profiles` table:

```sql
SELECT id, username, display_name, email 
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see usernames in the new format for newly created users.
