-- Create user_sessions table
create table if not exists public.user_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  session_token text, -- Optional: to link with specific auth sessions if needed later
  user_agent text,
  ip_address text,
  location text,
  device_type text,
  os text,
  browser text,
  is_current_session boolean default false, -- This is computed client-side typically, but can be useful
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
