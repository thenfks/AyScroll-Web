# AyScroll Database Schema Documentation

## Overview
This document describes the database schema for AyScroll's user profile and content management system.

## Tables

### 1. `user_profiles`
Main user profile table containing personal information, activity stats, and preferences.

**Key Fields:**
- `id` (UUID): Primary key, references auth.users
- `username` (TEXT): Unique username
- `display_name` (TEXT): Display name
- `bio` (TEXT): User biography
- `avatar_url` (TEXT): Profile picture URL
- `cover_image_url` (TEXT): Cover/banner image URL
- `total_watch_hours` (DECIMAL): Total hours of content watched
- `current_streak_days` (INTEGER): Current learning streak
- `is_creator` (BOOLEAN): Creator status flag
- `is_verified` (BOOLEAN): Verification badge
- `followers_count` (INTEGER): Number of followers
- `following_count` (INTEGER): Number of users following
- `subscription_tier` (TEXT): free, pro, or premium
- `notification_preferences` (JSONB): Email, push, in-app settings
- `privacy_settings` (JSONB): Profile visibility and activity settings

### 2. `user_activity`
Tracks all user activities for analytics and recommendations.

**Activity Types:**
- `watch`: Content viewing
- `like`: Content likes
- `comment`: Comments on content
- `share`: Content sharing
- `save`: Saving content
- `download`: Downloading content
- `upload`: Uploading content
- `follow/unfollow`: Social actions

### 3. `saved_content`
Stores user's saved/bookmarked content.

**Features:**
- Supports multiple content types (reels, courses, paths)
- Can be organized into collections
- Unique constraint prevents duplicate saves

### 4. `collections`
User-created collections for organizing saved content.

**Features:**
- Public/private visibility
- Custom cover images
- Automatic item counting

### 5. `downloads`
Tracks downloaded content for offline access.

**Features:**
- Download status tracking (pending, completed, failed)
- File size tracking
- Supports multiple content types

### 6. `user_follows`
Social graph for user connections.

**Features:**
- Bidirectional relationship tracking
- Prevents self-following
- Unique constraint on follower/following pairs

### 7. `learning_paths`
Curated learning paths created by creators.

**Features:**
- Difficulty levels (beginner, intermediate, advanced)
- Category tagging
- Enrollment and completion tracking
- Published/draft status

### 8. `user_path_progress`
Tracks user progress through learning paths.

**Features:**
- Progress percentage
- Completed vs total items
- Start, last access, and completion timestamps

### 9. `user_uploads`
Content uploaded by creators.

**Features:**
- Multiple content types (reels, courses, resources)
- Status workflow (draft → processing → published → archived)
- View and like counters
- File metadata (size, duration)

## Security

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

**Public Access:**
- User profiles (read-only)
- Published learning paths
- Published uploads
- User follows (read-only)

**User-Specific Access:**
- Users can only modify their own data
- Users can view their own activity, saves, downloads, and progress
- Creators can manage their own uploads and paths

### Automatic Profile Creation
A trigger automatically creates a user profile when a new user signs up via Supabase Auth.

## Indexes
Optimized indexes on:
- Username and email lookups
- User activity queries
- Social graph queries (followers/following)
- Content queries (uploads, paths)

## Triggers
- `update_updated_at_column`: Automatically updates `updated_at` timestamp
- `on_auth_user_created`: Creates user profile on signup

## Usage Examples

### TypeScript Integration
```typescript
import { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(url, key);

// Get user profile
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('username', 'johndoe')
  .single();

// Track activity
await supabase
  .from('user_activity')
  .insert({
    user_id: userId,
    activity_type: 'watch',
    content_id: reelId,
    content_type: 'reel'
  });

// Save content
await supabase
  .from('saved_content')
  .insert({
    user_id: userId,
    content_id: contentId,
    content_type: 'reel'
  });
```

## Migration
To apply this schema to your Supabase project:

```bash
supabase db push
```

## Future Enhancements
- [ ] Add content recommendations table
- [ ] Add user achievements/badges system
- [ ] Add content comments and ratings
- [ ] Add payment/transaction history
- [ ] Add analytics aggregation tables
