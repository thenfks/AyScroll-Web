import { useParams } from 'react-router-dom';
import ProfilePage from '../components/profile/ProfilePage';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { User, ShieldCheck, Flame, Calendar, Users, Video } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GradientButton } from '@/components/ui/GradientButton';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Check if we are viewing our own profile
  const isOwnProfile = !username || (user?.user_metadata?.username === username);

  useEffect(() => {
    if (!username) return;

    const fetchPublicProfile = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('username', username)
          .maybeSingle();

        if (error || !data) {
          setError(true);
        } else {
          setProfile(data);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  if (isOwnProfile) {
    return <ProfilePage />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen bg-transparent">
        {!isMobile && <Sidebar />}
        {isMobile && <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />}
        <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
        <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center bg-background ${isMobile ? 'pt-20' : 'pl-[240px]'}`}>
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground">The user @{username} does not exist or has a private profile.</p>
        </div>
      </div>
    );
  }

  // Render Public Profile View (Standardized)
  // Render Public Profile View (Banner Card Design)
  const defaultBanner = "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop";
  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'go';

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {!isMobile && <Sidebar />}
      {isMobile && <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />}
      <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar ${isMobile ? 'pt-24' : 'pl-[240px]'}`}>
        <div className={`flex-1 max-w-[1400px] mx-auto w-full ${isMobile ? 'px-3 py-4 space-y-4' : 'px-8 py-6 space-y-6'}`}>

          {/* Banner Card */}
          <div className="relative w-full rounded-[32px] md:rounded-[48px] bg-black border border-white/10 shadow-2xl overflow-hidden group">

            {/* Banner Section */}
            <div className="relative h-48 md:h-64 w-full bg-neutral-900 overflow-hidden">
              <img
                src={profile?.cover_image_url || defaultBanner}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                alt="Profile Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Profile Info Section */}
            <div className="relative px-6 md:px-10 pb-8 md:pb-10 pt-16 md:pt-[72px]">

              {/* Avatar - Overlapping */}
              <div className="absolute -top-16 md:-top-20 left-6 md:left-10 p-1.5 rounded-full bg-black">
                <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-black ${isPro ? 'ring-4 ring-brand-purple' : 'ring-2 ring-white/10'}`}>
                  <Avatar className="w-full h-full">
                    <AvatarImage src={profile.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black bg-brand-gradient text-white">
                      {profile.display_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {profile.is_verified && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1 border-4 border-black text-white" title="Verified Creator">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  </div>
                )}
              </div>

              {/* Actions (Top Right aligned) */}
              <div className="absolute top-4 right-6 md:right-10 flex gap-3">
                <GradientButton round className="px-8 py-2.5 h-10 text-xs font-bold uppercase tracking-wider">
                  Follow
                </GradientButton>
                <button className="px-8 py-2.5 h-10 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors">
                  Message
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start justify-between">

                {/* Text Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">
                    {profile.display_name}
                  </h1>
                  <p className="text-lg text-primary font-bold font-mono mb-4">
                    @{profile.username}
                    {isPro && <span className="ml-3 px-2 py-0.5 rounded text-[10px] bg-brand-gradient text-white font-black uppercase tracking-widest align-middle">PRO</span>}
                  </p>

                  {profile.bio && (
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-medium mb-6">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm font-bold text-white">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-white text-lg">{profile.followers_count || 0}</span>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Followers</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-white text-lg">{profile.following_count || 0}</span>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Following</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-white text-lg">{profile.current_streak_days || 0}</span>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-6 border-b border-border px-4">
              <button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm">VIDEOS</button>
              <button className="pb-4 border-b-2 border-transparent text-muted-foreground font-bold text-sm hover:text-foreground">ABOUT</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Placeholder for user content */}
              <div className="aspect-video rounded-3xl bg-secondary/30 border border-border flex items-center justify-center flex-col gap-3 text-muted-foreground/50">
                <Video className="w-8 h-8 opacity-50" />
                <p className="font-bold text-xs uppercase tracking-widest opacity-70">No public content</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;