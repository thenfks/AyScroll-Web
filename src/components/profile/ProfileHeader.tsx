import React, { useState, useEffect, useRef } from 'react';
import { Flame, BadgeCheck } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/database';
import { GradientButton } from '@/components/ui/GradientButton';
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  user: User;
  onEditClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setProfile(data);
    }
  };

  // Strictly use Database Profile Tier
  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'go';

  const { toast } = useToast();
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadBannerImage = async (file: File) => {
    try {
      setUploadingBanner(true);
      const fileExt = file.name.split('.').pop() || 'jpeg';
      const fileName = `banner_${Date.now()}.${fileExt}`;
      const filePath = `banners/${user.id}/${fileName}`;

      console.log(`Uploading to user-uploads bucket: ${filePath}`);

      // Upload to 'user-uploads' bucket
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      console.log("Generated Public URL:", publicUrl);

      // Update profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ cover_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, cover_image_url: publicUrl } : null);

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error uploading banner",
        description: error.message,
      });
    } finally {
      setUploadingBanner(false);
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Simplification: Direct Upload, No Cropping
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadBannerImage(file);
    }
  };

  const handleBannerRemove = async () => {
    if (!profile?.cover_image_url) return;

    try {
      setUploadingBanner(true);
      // Extract path from URL. Assuming standard structure: .../user-uploads/banners/user_id/filename
      const urlParts = profile.cover_image_url.split('/user-uploads/');
      const path = urlParts.length > 1 ? urlParts[1] : null;

      if (path) {
        await supabase.storage.from('user-uploads').remove([path]);
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ cover_image_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, cover_image_url: null } : null);

      toast({
        title: "Banner Removed",
        description: "Your banner has been removed.",
      });

    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error removing banner",
        description: e.message
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  const defaultBanner = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2670&auto=format&fit=crop";

  return (
    <div className="relative w-full rounded-[32px] md:rounded-[48px] bg-white dark:bg-black border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden group">


      {/* Banner Section - Compact Design */}
      <div className="relative h-32 md:h-40 w-full bg-gray-100 dark:bg-neutral-900 overflow-hidden">
        <img
          src={profile?.cover_image_url || defaultBanner}
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          alt="Profile Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Edit Banner Button (Visual Only for now) */}
        {onEditClick && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {profile?.cover_image_url && (
              <button
                onClick={handleBannerRemove}
                disabled={uploadingBanner}
                className="p-2.5 rounded-full bg-red-500/80 backdrop-blur-md border border-red-500/20 text-white hover:bg-red-600 transition-all"
                title="Remove Banner"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                </div>
              </button>
            )}

            <div
              className={`relative p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all cursor-pointer ${uploadingBanner ? 'animate-pulse' : ''}`}
              title="Change Banner"
            >
              <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
              </div>

              {/* Input retained but hidden, issue unresolved as per user request */}
              <input
                ref={fileInputRef}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                onChange={onFileChange}
                disabled={uploadingBanner}
              />
            </div>
          </div>
        )}
      </div>

      {/* Profile Info Section - Compact Horizonatal Layout */}
      {/* Profile Info Section - Responsive Layout */}
      <div className="relative px-6 md:px-10 pb-6 pt-16 md:pt-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">

          {/* Spacer for Desktop Alignment (Matches Avatar Width) */}
          <div className="hidden md:block w-32 shrink-0" />

          {/* User Info & Actions */}
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-6">

            {/* Text Payload */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {profile?.display_name || user.user_metadata?.name || 'User'}
                </h1>
                {profile?.is_verified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/20" />}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-gray-400 mb-3 md:mb-0">
                <span className="text-gray-600 dark:text-gray-300">@{profile?.username || user.user_metadata?.username || 'user'}</span>
                <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                <span className="w-full md:w-auto truncate max-w-[300px]">{profile?.bio}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-bold text-white">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-900 dark:text-white text-sm">{profile?.followers_count || '15k'}</span>
                  <span className="text-gray-600 dark:text-gray-500 font-normal">Followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-900 dark:text-white text-sm">{profile?.following_count || '10'}</span>
                  <span className="text-gray-600 dark:text-gray-500 font-normal">Following</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500">
                  <Flame className="w-3 h-3 fill-current" />
                  <span className="">{profile?.current_streak_days || '50'} DAY STREAK</span>
                </div>
              </div>
            </div>

            {/* Desktop Actions (Inline) */}
            <div className="hidden md:flex items-center gap-3 mb-auto">
              {onEditClick ? (
                <>
                  <GradientButton
                    onClick={onEditClick}
                    round
                    className="px-6 py-2 h-9 text-xs font-bold shadow-none"
                  >
                    Edit Profile
                  </GradientButton>
                  <button className="px-6 py-2 h-9 rounded-full border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    Share
                  </button>
                </>
              ) : (
                <>
                  <GradientButton round className="px-6 py-2 h-9 text-xs font-bold shadow-none bg-brand-gradient">
                    Follow
                  </GradientButton>
                  <button className="px-6 py-2 h-9 rounded-full border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/5 transition-colors uppercase tracking-wider">
                    Share
                  </button>
                </>
              )}
            </div>

            {/* Mobile Actions (Absolute Top-Right) */}
            <div className="md:hidden absolute top-4 right-4 flex items-center gap-2">
              {onEditClick ? (
                <>
                  <button
                    onClick={onEditClick}
                    className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-900 dark:text-white border border-transparent"
                  >
                    Edit
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                  </button>
                </>
              ) : (
                <>
                  <button className="px-5 py-1.5 rounded-full bg-brand-gradient text-white text-xs font-bold">
                    Follow
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Avatar - Overlapping - Adjusted Position */}
        <div className="absolute -top-12 md:-top-16 left-6 md:left-10 p-1 rounded-full bg-black/50 backdrop-blur-sm">
          <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-black ${isPro ? 'ring-4 ring-brand-purple' : 'ring-2 ring-pink-500'}`}>
            <img
              src={profile?.avatar_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || 'User')}&background=random`}
              className="w-full h-full object-cover"
              alt="Avatar"
            />
            {profile?.is_verified && (
              <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-black" title="Verified">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

  );
};

export default ProfileHeader;
