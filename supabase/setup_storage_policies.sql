-- ============================================
-- Storage Bucket Setup with RLS Policies
-- ============================================

-- Step 1: Create the storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  true, -- Public bucket so avatars can be viewed
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Step 2: Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Step 3: Create new RLS policies

-- Policy 1: Allow authenticated users to INSERT (upload) files
CREATE POLICY "user_uploads_insert_policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads'
);

-- Policy 2: Allow public SELECT (view) access to all files
CREATE POLICY "user_uploads_select_policy"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'user-uploads'
);

-- Policy 3: Allow users to UPDATE their own files
CREATE POLICY "user_uploads_update_policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Allow users to DELETE their own files
CREATE POLICY "user_uploads_delete_policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Step 4: Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE 'user_uploads%'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Storage bucket "user-uploads" has been configured successfully!';
  RAISE NOTICE 'RLS policies have been applied.';
  RAISE NOTICE 'You can now upload avatars from the Profile Edit modal.';
END $$;
