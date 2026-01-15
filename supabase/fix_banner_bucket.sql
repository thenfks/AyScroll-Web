-- Create the storage bucket 'banner_bucket'
insert into storage.buckets (id, name, public)
values ('banner_bucket', 'banner_bucket', true)
on conflict (id) do nothing;

-- Enable Request Level Security (RLS) on the bucket (optional as storage.objects already has RLS)
-- Checks for existing policies to avoid errors or drop them first

drop policy if exists "Public Read Access" on storage.objects;
drop policy if exists "User Upload Access" on storage.objects;
drop policy if exists "User Delete Access" on storage.objects;

-- Policy: Allow Public Read Access
create policy "Public Read Access"
  on storage.objects for select
  using ( bucket_id = 'banner_bucket' );

-- Policy: Allow Authenticated Users to Upload
create policy "User Upload Access"
  on storage.objects for insert
  with check ( bucket_id = 'banner_bucket' and auth.role() = 'authenticated' );

-- Policy: Allow Users to Update/Delete their own files
create policy "User Delete Access"
  on storage.objects for delete
  using ( bucket_id = 'banner_bucket' and auth.uid()::text = (storage.foldername(name))[1] );
