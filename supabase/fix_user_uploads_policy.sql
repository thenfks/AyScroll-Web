-- Allow authenticated users to upload to the "banners" folder in "user-uploads" bucket
drop policy if exists "Allow authenticated uploads to banners folder" on storage.objects;
create policy "Allow authenticated uploads to banners folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = 'banners' AND
  auth.uid() = owner
);

-- Allow authenticated users to update their own banners
drop policy if exists "Allow authenticated updates to banners folder" on storage.objects;
create policy "Allow authenticated updates to banners folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = 'banners' AND
  auth.uid() = owner
);

-- Allow authenticated users to delete their own banners
drop policy if exists "Allow authenticated deletes in banners folder" on storage.objects;
create policy "Allow authenticated deletes in banners folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = 'banners' AND
  auth.uid() = owner
);

-- Allow public read access to banners
drop policy if exists "Allow public read access to banners" on storage.objects;
create policy "Allow public read access to banners"
on storage.objects
for select
to public
using (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = 'banners'
);
