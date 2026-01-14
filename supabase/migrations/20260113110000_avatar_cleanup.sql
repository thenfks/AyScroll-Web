-- Migration: Setup Avatar Cleanup Queue and Scheduler
-- Description: Handles delayed deletion of old avatar images (5 mins for testing, simulating 30 days)

-- 1. Create the Queue Table
create table if not exists public.avatar_cleanup_queue (
  id uuid default gen_random_uuid() primary key,
  avatar_path text not null,
  delete_at timestamptz not null default (now() + interval '5 minutes'), -- Testing: 5 mins. Prod: interval '30 days'
  created_at timestamptz default now()
);

-- Enable RLS (Security)
alter table public.avatar_cleanup_queue enable row level security;
-- Only database/system should access this, effectively closing it off from public API unless policies added.

-- 2. Create Trigger Function to Queue Old Avatars
create or replace function public.queue_old_avatar_for_deletion()
returns trigger as $$
begin
  -- If avatar_url changed and old one wasn't null
  if (old.avatar_url is not null and old.avatar_url <> new.avatar_url) then
    -- Insert into queue
    insert into public.avatar_cleanup_queue (avatar_path)
    values (old.avatar_url);
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- 3. Attach Trigger to user_profiles
drop trigger if exists on_avatar_change on public.user_profiles;
create trigger on_avatar_change
  after update on public.user_profiles
  for each row
  execute function public.queue_old_avatar_for_deletion();

-- 4. Create the Cleanup Processing Function
-- This function deletes files from storage.objects and removes the queue entry
create or replace function public.process_avatar_cleanup()
returns void as $$
declare
  r record;
  storage_path text;
begin
  -- Loop through items ready for deletion
  for r in select * from public.avatar_cleanup_queue where delete_at < now() loop
    
    -- Extract the relative storage path from the public URL
    -- URL format assumption: .../storage/v1/object/public/user-uploads/avatars/filename.ext
    -- We need: avatars/filename.ext (assuming bucket is correct)
    
    -- Robust extraction: Look for 'user-uploads/' and take everything after.
    storage_path := substring(r.avatar_path from 'user-uploads/(.*)');
    
    if storage_path is not null then
      -- Delete the actual object from Supabase Storage metadata
      -- WARNING: Direct deletion from storage.objects requires appropriate permissions or security definer
      delete from storage.objects
      where bucket_id = 'user-uploads' and name = storage_path;
      
      -- If working with S3/backend directly, file deletion happens here.
      -- Supabase storage.objects deletion triggers the actual cleanup background job on Supabase side.
    end if;
    
    -- Remove from queue after processing
    delete from public.avatar_cleanup_queue where id = r.id;
    
  end loop;
end;
$$ language plpgsql security definer;

-- 5. Schedule the Cleanup (Requires pg_cron extension)
-- Note: Enable pg_cron in Supabase Dashboard -> Database -> Extensions if this fails.

do $$
begin
  if not exists (select 1 from pg_extension where extname = 'pg_cron') then
    create extension if not exists pg_cron;
  end if;
exception
  when others then
    raise notice 'pg_cron extension could not be enabled automatically. Please enable it in Dashboard.';
end
$$;

-- Schedule job to run every minute
-- (Checks queue for items older than 5 mins)
select cron.schedule(
  'invoke-avatar-cleanup', -- job name
  '* * * * *',             -- every minute
  'select public.process_avatar_cleanup()'
);
