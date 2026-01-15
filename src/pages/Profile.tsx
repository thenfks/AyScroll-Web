import { useParams } from 'react-router-dom';
import ProfilePage from '../components/profile/ProfilePage';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { User, ShieldCheck, Flame, Calendar, Users, Video, LayoutGrid, GitFork, Shapes, Rocket, Sparkles } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('topics');

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
  const defaultBanner = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2670&auto=format&fit=crop";
  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'go';

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {!isMobile && <Sidebar />}
      {isMobile && <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />}
      <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar ${isMobile ? 'pt-24' : 'pl-[240px]'}`}>
        <div className={`flex-1 max-w-[1400px] mx-auto w-full ${isMobile ? 'px-3 py-4 space-y-4' : 'px-8 py-6 space-y-6'}`}>

          {/* Banner Card - Compact Horizontal Layout */}
          <div className="relative w-full rounded-[32px] md:rounded-[48px] bg-white dark:bg-black border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden group">

            {/* Banner Section */}
            <div className="relative h-32 md:h-40 w-full bg-gray-100 dark:bg-neutral-900 overflow-hidden">
              <img
                src={profile?.cover_image_url || defaultBanner}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                alt="Profile Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Profile Info Section */}
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
                        {profile.display_name}
                      </h1>
                      {profile.is_verified && <div className="text-blue-500 bg-blue-500/10 p-1 rounded-full"><ShieldCheck className="w-4 h-4" /></div>}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-gray-400 mb-3 md:mb-0">
                      <span className="text-gray-600 dark:text-gray-300">@{profile.username}</span>
                      <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                      <span className="w-full md:w-auto truncate max-w-[300px]">{profile.bio}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-900 dark:text-white text-sm">{profile.followers_count || '0'}</span>
                        <span className="text-gray-600 dark:text-gray-500 font-normal">Followers</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-900 dark:text-white text-sm">{profile.following_count || '0'}</span>
                        <span className="text-gray-600 dark:text-gray-500 font-normal">Following</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500">
                        <Flame className="w-3 h-3 fill-current" />
                        <span className="">{profile.current_streak_days || '0'} DAY STREAK</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Actions (Inline) */}
                  <div className="hidden md:flex items-center gap-3 mb-auto">
                    <GradientButton round className="px-6 py-2 h-9 text-xs font-bold shadow-none bg-brand-gradient">
                      Follow
                    </GradientButton>
                    <button className="px-6 py-2 h-9 rounded-full border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/5 transition-colors uppercase tracking-wider">
                      Share
                    </button>
                  </div>

                  {/* Mobile Actions (Absolute Top-Right) */}
                  <div className="md:hidden absolute top-4 right-4 flex items-center gap-2">
                    <button className="px-5 py-1.5 rounded-full bg-brand-gradient text-white text-xs font-bold">
                      Follow
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                    </button>
                  </div>

                </div>
              </div>

              {/* Avatar - Overlapping - Positioned Absolute */}
              <div className="absolute -top-12 md:-top-16 left-6 md:left-10 p-1 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-black ${isPro ? 'ring-4 ring-brand-purple' : 'ring-2 ring-pink-500'}`}>
                  <Avatar className="w-full h-full">
                    <AvatarImage src={profile.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black bg-brand-gradient text-white">
                      {profile.display_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>


          </div>

          {/* Tab Navigation & Content */}
          <div className="space-y-6 mt-8">

            {/* Tab Header */}
            <div className="flex items-center gap-8 border-b border-gray-200 dark:border-white/10 px-4">
              {[
                { id: 'topics', label: 'TOPICS', icon: Shapes },
                { id: 'collections', label: 'COLLECTIONS', icon: LayoutGrid },
                { id: 'roadmaps', label: 'ROAD MAPS', icon: GitFork }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 flex items-center gap-2 text-[10px] md:text-xs font-black tracking-widest uppercase transition-colors relative
                       ${activeTab === tab.id ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <tab.icon className={`w-3 h-3 md:w-4 md:h-4 ${activeTab === tab.id ? 'text-brand-orange' : 'text-gray-400 dark:text-gray-600'}`} />
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-gradient" />}
                </button>
              ))}
            </div>

            {/* Tab Components */}
            <div className="min-h-[400px]">
              {activeTab === 'topics' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Featured Topics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card 1: Advanced UI/UX */}
                    <div className="group relative bg-white dark:bg-[#1A1D1F] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:scale-[1.02] cursor-pointer shadow-sm dark:shadow-none">
                      <div className="h-48 bg-gray-50 dark:bg-[#2C3035] relative p-6 flex flex-col items-center justify-center">
                        <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">24 Lessons</div>
                        <img src="https://illustrations.popsy.co/amber/student-going-to-school.svg" className="w-32 h-32 opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500" alt="illustration" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-orange transition-colors">Advanced UI/UX</h3>
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest">PRO</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2">Modern design systems and high-end prototyping techniques.</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((i) => (
                                <img
                                  key={i}
                                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                  alt="User"
                                  className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1A1D1F] object-cover"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium pl-2">1.2k joined</span>
                          </div>
                          <span className="text-brand-orange text-xs font-black hover:underline">OPEN</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: JS Patterns */}
                    <div className="group relative bg-white dark:bg-[#1A1D1F] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:scale-[1.02] cursor-pointer shadow-sm dark:shadow-none">
                      <div className="h-48 bg-[#EBEBE0] relative p-6 flex flex-col items-center justify-center">
                        <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">18 Lessons</div>
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-black/10">JS</div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-orange transition-colors">JavaScript Patterns</h3>
                          <span className="px-2 py-0.5 rounded bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest">FREE</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2">Best practices for clean and modular JS code.</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {[10, 11].map((i) => (
                                <img
                                  key={i}
                                  src={`https://i.pravatar.cc/100?img=${i + 20}`}
                                  alt="User"
                                  className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1A1D1F] object-cover"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium pl-2">850 joined</span>
                          </div>
                          <span className="text-brand-orange text-xs font-black hover:underline">OPEN</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Fintech (Progress) */}
                    <div className="group relative bg-white dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 p-6 hover:border-gray-300 dark:hover:border-white/10 transition-all flex flex-col justify-between shadow-sm dark:shadow-none">
                      <div>
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                            <Rocket className="w-6 h-6 text-pink-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">Fintech Fundamentals</h3>
                            <p className="text-gray-500 text-xs">12 Mini-Guides</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-3 overflow-hidden">
                          <div className="h-full bg-pink-500 w-[75%]" />
                        </div>
                        <div className="flex justify-end">
                          <span className="text-[10px] font-bold text-gray-400">75% Complete</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Curated Paths Section */}
                  <div className="w-full rounded-3xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#111] p-12 text-center relative overflow-hidden group shadow-sm dark:shadow-none">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="w-6 h-6 text-gray-900 dark:text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Curated Learning Paths</h3>
                      <p className="text-gray-500 max-w-sm mx-auto text-sm">Explore more road maps and collections in the library.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'collections' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <LayoutGrid className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-50">No Collections Yet</p>
                </div>
              )}

              {activeTab === 'roadmaps' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <GitFork className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-50">No Road Maps Yet</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;