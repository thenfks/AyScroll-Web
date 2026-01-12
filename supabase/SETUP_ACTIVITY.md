# Setup Daily Activity Tracking

To enable the dynamic "Daily Activity" and "Weekly Activity" charts, you need to create the database table.

## 1. Run Migration

Go to your **Supabase Dashboard** -> **SQL Editor** and run the following script:

```sql
create table if not exists public.daily_learning_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_date date default current_date not null,
  minutes_spent integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one record per user per day
  constraint daily_activity_user_date_unique unique (user_id, activity_date)
);

alter table public.daily_learning_activity enable row level security;

create policy "Users can view their own activity" on public.daily_learning_activity
  for select using (auth.uid() = user_id);

create policy "Users can insert their own activity" on public.daily_learning_activity
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own activity" on public.daily_learning_activity
  for update using (auth.uid() = user_id);

-- Create a function to easily add minutes (atomic increment)
create or replace function increment_learning_minutes(p_minutes int, p_date date)
returns void as $$
begin
  insert into public.daily_learning_activity (user_id, activity_date, minutes_spent)
  values (auth.uid(), p_date, p_minutes)
  on conflict (user_id, activity_date)
  do update set minutes_spent = daily_learning_activity.minutes_spent + p_minutes;
end;
$$ language plpgsql security definer;
```

## 2. Verify

After running this, your Profile and Analysis pages will automatically fetch data from this table!
