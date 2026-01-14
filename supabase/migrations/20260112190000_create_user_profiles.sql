-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    
    -- Personal Information
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    location TEXT,
    website TEXT,
    
    -- Activity Tracking
    total_watch_hours DECIMAL(10, 2) DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Creator Status
    is_creator BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    creator_tier TEXT CHECK (creator_tier IN ('none', 'bronze', 'silver', 'gold', 'platinum')),
    
    -- Social Stats
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    
    -- Subscription
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'trial')),
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "in_app": true}'::jsonb,
    privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "show_activity": true}'::jsonb,
    theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    language_preference TEXT DEFAULT 'en',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activity table for detailed activity tracking
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('watch', 'like', 'comment', 'share', 'save', 'download', 'upload', 'follow', 'unfollow')),
    content_id UUID,
    content_type TEXT CHECK (content_type IN ('reel', 'course', 'path', 'collection')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_content table
CREATE TABLE IF NOT EXISTS public.saved_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('reel', 'course', 'path')),
    collection_id UUID,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id, content_type)
);

-- Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    cover_image_url TEXT,
    items_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('reel', 'course', 'resource')),
    file_url TEXT,
    file_size_mb DECIMAL(10, 2),
    download_status TEXT DEFAULT 'completed' CHECK (download_status IN ('pending', 'completed', 'failed')),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create following table (social connections)
CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    category TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    enrollments_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_path_progress table
CREATE TABLE IF NOT EXISTS public.user_path_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    completed_items INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, path_id)
);

-- Create user_uploads table (for creators)
CREATE TABLE IF NOT EXISTS public.user_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('reel', 'course', 'resource')),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    file_size_mb DECIMAL(10, 2),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'published', 'archived')),
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_content_user_id ON public.saved_content(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON public.user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_creator ON public.learning_paths(creator_id);
CREATE INDEX IF NOT EXISTS idx_user_path_progress_user ON public.user_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_uploads_user_id ON public.user_uploads(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_uploads_updated_at BEFORE UPDATE ON public.user_uploads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, display_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_path_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_activity
CREATE POLICY "Users can view own activity" ON public.user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for saved_content
CREATE POLICY "Users can view own saved content" ON public.saved_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved content" ON public.saved_content
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for collections
CREATE POLICY "Public collections are viewable by everyone" ON public.collections
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own collections" ON public.collections
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for downloads
CREATE POLICY "Users can view own downloads" ON public.downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own downloads" ON public.downloads
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_follows
CREATE POLICY "Follows are viewable by everyone" ON public.user_follows
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON public.user_follows
    FOR ALL USING (auth.uid() = follower_id);

-- RLS Policies for learning_paths
CREATE POLICY "Published paths are viewable by everyone" ON public.learning_paths
    FOR SELECT USING (is_published = true OR auth.uid() = creator_id);

CREATE POLICY "Creators can manage own paths" ON public.learning_paths
    FOR ALL USING (auth.uid() = creator_id);

-- RLS Policies for user_path_progress
CREATE POLICY "Users can view own progress" ON public.user_path_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON public.user_path_progress
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_uploads
CREATE POLICY "Published uploads are viewable by everyone" ON public.user_uploads
    FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can manage own uploads" ON public.user_uploads
    FOR ALL USING (auth.uid() = user_id);
