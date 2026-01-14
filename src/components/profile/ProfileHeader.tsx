import React, { useState, useEffect } from 'react';
import { Flame, BadgeCheck } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/database';
import { GradientButton } from '@/components/ui/GradientButton';

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
      .single();

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

  return (
    <header className="relative p-4 md:p-10 rounded-[28px] md:rounded-[40px] bg-secondary/30 border border-border overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-8 shadow-theme-lg">
      <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 relative z-10 w-full">
        <div className={`w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full shrink-0 ${isPro ? 'p-1 md:p-1.5 bg-brand-gradient shadow-2xl' : ''}`}>
          <img
            src={profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || user.user_metadata?.name || 'User')}&background=random`}
            className={`w-full h-full rounded-full object-cover ${isPro ? 'border-[3px] md:border-[6px] border-background' : ''}`}
            alt={profile?.display_name || user.user_metadata?.name}
          />
        </div>
        <div className="text-center md:text-left flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-1.5 truncate">
            {profile?.display_name || user.user_metadata?.name || 'User'}
          </h1>
          <p className="text-muted-foreground text-[12px] md:text-[14px] leading-relaxed max-w-sm mb-4 md:mb-6 font-medium line-clamp-2 md:line-clamp-none mx-auto md:mx-0">
            {profile?.bio || 'Product Designer & AI Enthusiast. Learning about Quantum Computing and UI Trends.'} <span className="text-primary">@{profile?.username || user.user_metadata?.username || 'user'}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-3 mb-5 md:mb-8">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-blue-500">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Top Learner
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary">
              <Flame className="w-2.5 h-2.5" /> {profile?.current_streak_days || 0} Streak
            </span>
            {isPro && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-500">
                <BadgeCheck className="w-3 h-3" /> {profile?.subscription_tier === 'go' ? 'Go' : 'Pro'}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2.5 md:gap-4">
            <GradientButton
              onClick={onEditClick}
              round
              className="px-5 md:px-12 py-2.5 md:py-3.5 text-[9px] md:text-[11px]"
            >
              Edit Profile
            </GradientButton>
            <GradientButton
              round
              gradient="dark"
              glow={false}
              className="px-5 md:px-12 py-2.5 md:py-3.5 text-[9px] md:text-[11px] text-muted-foreground hover:text-foreground"
            >
              Share
            </GradientButton>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 md:gap-4 relative z-10 w-full lg:w-auto">
        <div className="flex-1 px-4 md:px-8 py-3 md:py-6 rounded-2xl md:rounded-[28px] bg-secondary/30 border border-border text-center shadow-theme-md min-w-[80px] md:min-w-[120px]">
          <p className="text-xl md:text-3xl font-black text-foreground tracking-tighter">{profile?.followers_count || 0}</p>
          <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-0.5 font-bold">Followers</p>
        </div>
        <div className="flex-1 px-4 md:px-8 py-3 md:py-6 rounded-2xl md:rounded-[28px] bg-secondary/30 border border-border text-center shadow-theme-md min-w-[80px] md:min-w-[120px]">
          <p className="text-xl md:text-3xl font-black text-foreground tracking-tighter">{Math.floor(profile?.total_watch_hours || 0)}h</p>
          <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-0.5 font-bold">Learned</p>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
