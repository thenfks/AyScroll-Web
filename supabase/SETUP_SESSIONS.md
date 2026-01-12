# Setup Session Management

To enable the Active Devices feature, you need to create the `user_sessions` table in your Supabase database.

## Step 1: Run the Migration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor** (icon on the left sidebar).
3. Click **New Query**.
4. Paste the content of the migration file located at:
   `supabase/migrations/20260112_create_user_sessions.sql`
5. Click **Run**.

## Migration Content

```sql
-- Create user_sessions table
create table if not exists public.user_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  session_token text,
  user_agent text,
  ip_address text,
  location text,
  device_type text,
  os text,
  browser text,
  is_current_session boolean default false,
  last_active timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_sessions enable row level security;

-- Policies
create policy "Users can view their own sessions"
  on public.user_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.user_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on public.user_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sessions"
  on public.user_sessions for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists user_sessions_user_id_idx on public.user_sessions(user_id);
create index if not exists user_sessions_last_active_idx on public.user_sessions(last_active);
```

After running this, the "Active Devices" section in your Profile will automatically start tracking and displaying sessions!
