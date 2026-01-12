// Database Types for AyScroll User Profiles

export interface UserProfile {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    cover_image_url: string | null;

    // Personal Information
    email: string | null;
    phone: string | null;
    date_of_birth: string | null;
    location: string | null;
    website: string | null;

    // Activity Tracking
    total_watch_hours: number;
    current_streak_days: number;
    longest_streak_days: number;
    last_active_at: string;
    last_login_at: string;

    // Creator Status
    is_creator: boolean;
    is_verified: boolean;
    creator_tier: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | null;

    // Social Stats
    followers_count: number;
    following_count: number;

    // Subscription
    subscription_tier: 'free' | 'pro' | 'premium';
    subscription_status: 'active' | 'cancelled' | 'expired' | 'trial';
    subscription_start_date: string | null;
    subscription_end_date: string | null;

    // Preferences
    notification_preferences: {
        email: boolean;
        push: boolean;
        in_app: boolean;
    };
    privacy_settings: {
        profile_visibility: 'public' | 'private' | 'friends';
        show_activity: boolean;
    };
    theme_preference: 'light' | 'dark' | 'auto';
    language_preference: string;

    // Metadata
    created_at: string;
    updated_at: string;
}

export interface UserActivity {
    id: string;
    user_id: string;
    activity_type: 'watch' | 'like' | 'comment' | 'share' | 'save' | 'download' | 'upload' | 'follow' | 'unfollow';
    content_id: string | null;
    content_type: 'reel' | 'course' | 'path' | 'collection' | null;
    metadata: Record<string, any> | null;
    created_at: string;
}

export interface SavedContent {
    id: string;
    user_id: string;
    content_id: string;
    content_type: 'reel' | 'course' | 'path';
    collection_id: string | null;
    saved_at: string;
}

export interface Collection {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    is_public: boolean;
    cover_image_url: string | null;
    items_count: number;
    created_at: string;
    updated_at: string;
}

export interface Download {
    id: string;
    user_id: string;
    content_id: string;
    content_type: 'reel' | 'course' | 'resource';
    file_url: string | null;
    file_size_mb: number | null;
    download_status: 'pending' | 'completed' | 'failed';
    downloaded_at: string;
}

export interface UserFollow {
    id: string;
    follower_id: string;
    following_id: string;
    created_at: string;
}

export interface LearningPath {
    id: string;
    creator_id: string;
    title: string;
    description: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
    category: string | null;
    thumbnail_url: string | null;
    is_published: boolean;
    enrollments_count: number;
    completion_rate: number;
    created_at: string;
    updated_at: string;
}

export interface UserPathProgress {
    id: string;
    user_id: string;
    path_id: string;
    progress_percentage: number;
    completed_items: number;
    total_items: number;
    started_at: string;
    last_accessed_at: string;
    completed_at: string | null;
}

export interface UserUpload {
    id: string;
    user_id: string;
    content_type: 'reel' | 'course' | 'resource';
    title: string;
    description: string | null;
    file_url: string | null;
    thumbnail_url: string | null;
    duration_seconds: number | null;
    file_size_mb: number | null;
    status: 'draft' | 'processing' | 'published' | 'archived';
    views_count: number;
    likes_count: number;
    created_at: string;
    published_at: string | null;
    updated_at: string;
}

export interface UserSession {
    id: string;
    user_id: string;
    session_token: string | null;
    user_agent: string | null;
    ip_address: string | null;
    location: string | null;
    device_type: string | null;
    os: string | null;
    browser: string | null;
    is_current_session: boolean;
    last_active: string;
    created_at: string;
}

// Database type for Supabase client
export interface Database {
    public: {
        Tables: {
            user_profiles: {
                Row: UserProfile;
                Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at' | 'followers_count' | 'following_count' | 'total_watch_hours' | 'current_streak_days' | 'longest_streak_days'>;
                Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
            };
            user_sessions: {
                Row: UserSession;
                Insert: Omit<UserSession, 'id' | 'created_at' | 'last_active' | 'is_current_session'>;
                Update: Partial<Omit<UserSession, 'id' | 'created_at'>>;
            };
            user_activity: {
                Row: UserActivity;
                Insert: Omit<UserActivity, 'id' | 'created_at'>;
                Update: Partial<Omit<UserActivity, 'id' | 'created_at'>>;
            };
            saved_content: {
                Row: SavedContent;
                Insert: Omit<SavedContent, 'id' | 'saved_at'>;
                Update: Partial<Omit<SavedContent, 'id' | 'saved_at'>>;
            };
            collections: {
                Row: Collection;
                Insert: Omit<Collection, 'id' | 'created_at' | 'updated_at' | 'items_count'>;
                Update: Partial<Omit<Collection, 'id' | 'created_at'>>;
            };
            downloads: {
                Row: Download;
                Insert: Omit<Download, 'id' | 'downloaded_at'>;
                Update: Partial<Omit<Download, 'id' | 'downloaded_at'>>;
            };
            user_follows: {
                Row: UserFollow;
                Insert: Omit<UserFollow, 'id' | 'created_at'>;
                Update: Partial<Omit<UserFollow, 'id' | 'created_at'>>;
            };
            learning_paths: {
                Row: LearningPath;
                Insert: Omit<LearningPath, 'id' | 'created_at' | 'updated_at' | 'enrollments_count' | 'completion_rate'>;
                Update: Partial<Omit<LearningPath, 'id' | 'created_at'>>;
            };
            user_path_progress: {
                Row: UserPathProgress;
                Insert: Omit<UserPathProgress, 'id' | 'started_at' | 'last_accessed_at'>;
                Update: Partial<Omit<UserPathProgress, 'id' | 'started_at'>>;
            };
            user_uploads: {
                Row: UserUpload;
                Insert: Omit<UserUpload, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'likes_count'>;
                Update: Partial<Omit<UserUpload, 'id' | 'created_at'>>;
            };
        };
    };
}
