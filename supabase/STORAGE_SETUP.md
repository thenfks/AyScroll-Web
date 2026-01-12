# Storage Bucket Setup for User Uploads

## Quick Setup via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wbsepuoccppuqirtowzg/storage/buckets

2. Click **"New bucket"**

3. Configure the bucket:
   - **Name**: `user-uploads`
   - **Public bucket**: ✅ **Enabled** (so avatars can be viewed publicly)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

4. Click **"Create bucket"**

5. Set up policies (click on the bucket, then "Policies"):
   - Click **"New Policy"**
   - Select **"For full customization"**
   - Add these policies:

### Policy 1: Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');
```

### Policy 2: Allow Public Read
```sql
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');
```

### Policy 3: Allow Users to Update Own Files
```sql
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Policy 4: Allow Users to Delete Own Files
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Alternative: Via SQL Editor

If you prefer, you can run the migration file:

1. Go to SQL Editor: https://supabase.com/dashboard/project/wbsepuoccppuqirtowzg/sql
2. Copy contents from `supabase/migrations/20260112_1711_create_storage_bucket.sql`
3. Paste and click **Run**

## Verification

After setup, test by:
1. Go to Profile page
2. Click "Edit Profile"
3. Click camera icon to upload avatar
4. Upload should work without errors!

## Folder Structure

Avatars will be stored as:
```
user-uploads/
  └── avatars/
      └── {user-id}-{timestamp}.{ext}
```

Example: `user-uploads/avatars/abc123-1234567890.jpg`
