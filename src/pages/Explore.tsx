import React, { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Play, User as UserIcon, ShieldCheck } from 'lucide-react';
import { MOCK_REELS } from '@/data/data';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { GradientButton } from '@/components/ui/GradientButton';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'users'>('content');
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const isMobile = useIsMobile();

  const categories = [
    { name: 'All', icon: null },
    { name: 'Technology', icon: '🌐' },
    { name: 'Design', icon: '🎨' },
    { name: 'Psychology', icon: '🧠' },
    { name: 'Business', icon: '💼' },
    { name: 'Engineering', icon: '⚙️' },
    { name: 'Music', icon: '🎸' },
  ];

  // Fetch Users when query changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery) {
        // Optionally fetch recommended users or recent
        setUsers([]);
        return;
      }

      setLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .or(`display_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
          .limit(20);

        if (!error && data) {
          setUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [searchQuery, activeTab]);

  // Content Filtering (Mock for now, can be swapped for real DB)
  const displayReels = useMemo(() => {
    return MOCK_REELS.filter((reel) => {
      const matchesSearch =
        reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || reel.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-7xl mx-auto pt-0 md:pt-6 px-4 md:px-0">

        {/* Premium Tabs */}
        <div className="hidden md:flex items-center gap-8 mb-8 border-b border-border/50 px-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'text-primary border-b-[3px] border-primary' : 'text-muted-foreground border-b-[3px] border-transparent hover:text-foreground'}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'text-primary border-b-[3px] border-primary' : 'text-muted-foreground border-b-[3px] border-transparent hover:text-foreground'}`}
          >
            People
          </button>
        </div>

        {activeTab === 'content' ? (
          <>
            {/* Categories */}
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <GradientButton
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  gradient={selectedCategory === cat.name ? 'brand' : 'dark'}
                  glow={selectedCategory === cat.name}
                  className={`px-5 md:px-8 py-2.5 md:py-3.5 text-[10px] md:text-[12px] whitespace-nowrap shrink-0`}
                >
                  {cat.name}
                </GradientButton>
              ))}
            </div>

            {/* Grid Content */}
            {displayReels.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
                {displayReels.map((reel) => (
                  <div key={reel.id} className="group cursor-pointer">
                    {/* Thumbnail Card */}
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border mb-3 md:mb-4 bg-secondary shadow-theme-md transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-theme-lg group-hover:border-primary/30">
                      <img
                        src={reel.thumbnail_url}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700"
                        alt={reel.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                      {/* Modern Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Title Overlay */}
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end pointer-events-none">
                        <h4 className="text-[13px] md:text-[17px] font-black text-white leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                          {reel.title}
                        </h4>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          <Play className="w-5 h-5 md:w-7 md:h-7 text-white fill-current translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Creator Footer */}
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl overflow-hidden border border-border bg-secondary shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <img src={reel.creator_avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-[14px] font-black text-foreground tracking-tight truncate group-hover:text-primary transition-colors">{reel.creator}</p>
                        <p className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] truncate">{reel.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <p className="text-muted-foreground font-medium">No content found matching "{searchQuery}"</p>
              </div>
            )}
          </>
        ) : (
          /* Users Tab (Premium Design) */
          <div className="space-y-6 animate-fade-in">
            {loadingUsers ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="relative p-5 rounded-[32px] bg-secondary/30 backdrop-blur-md border border-white/5 hover:bg-secondary/50 hover:border-primary/20 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-xl shadow-black/5"
                    onClick={() => navigate(`/profile/${user.username || user.id}`)}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <Avatar className="w-16 h-16 border-2 border-background shadow-md group-hover:border-primary/50 transition-colors">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-white font-bold text-xl">
                            {user.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {user.is_verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-background shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-white fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-foreground text-lg truncate group-hover:text-primary transition-colors tracking-tight">
                          {user.display_name || 'Anonymous User'}
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium truncate mb-1">@{user.username || 'user'}</p>

                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-md bg-background/50 border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {Math.floor(Math.random() * 500)} Followers
                          </span>
                        </div>
                      </div>
                    </div>

                    {user.bio && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 font-medium leading-relaxed">
                          {user.bio}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <UserIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-black text-foreground mb-1">No Users Found</h3>
                <p className="text-muted-foreground font-medium text-sm">{searchQuery ? `We couldn't find anyone matching "${searchQuery}"` : "Search for creators to follow"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Explore;
