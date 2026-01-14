import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Home, Compass, Library, Bookmark, BarChart2, Settings, X, LogOut, ShieldCheck, Crown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { icon: Home, label: 'Home', path: '/feed' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Library, label: 'Library', path: '/library' },
  { icon: Bookmark, label: 'Saved', path: '/saved' },
  { icon: BarChart2, label: 'Analysis', path: '/analysis' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ open, onOpenChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('username, avatar_url, display_name, subscription_tier')
      .eq('id', user.id)
      .single() as any;

    if (error) {
      console.error('Error loading user profile:', error);
      return;
    }

    if (data) {
      setUsername(data.username);
      setDisplayName(data.display_name);
      setAvatarUrl(data.avatar_url);
      setTier(data.subscription_tier);
      setIsPro(data.subscription_tier === 'pro' || data.subscription_tier === 'premium' || data.subscription_tier === 'go');
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleSignOut = async () => {
    try {
      onOpenChange(false); // Close immediately for better UX
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      navigate('/');
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.label === 'Analysis') return isPro;
    return true;
  });

  const mainNavLinks = filteredNavItems.filter(i => i.label !== 'Settings');
  const settingsNavLink = filteredNavItems.find(i => i.label === 'Settings');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[270px] bg-sidebar border-l border-border p-0 scrollbar-hide overflow-hidden [&>button]:top-8">
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="flex items-center gap-3">
            <img src="/ayscroll-official-logo.png" alt="AyScroll Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-foreground">AyScroll</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 space-y-1">
          {mainNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all",
                  isActive
                    ? "bg-brand-gradient/20 text-pink-500 border border-pink-500/20"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Minimalist Manage Subscription Option */}
          {user && (
            <button
              onClick={() => {
                navigate('/profile', { state: { targetTab: 'Subscription' } });
                onOpenChange(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-white/60 hover:bg-white/5 hover:text-white",
                location.pathname === '/profile' && "bg-white/5 text-white"
              )}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Manage Subscription</span>
            </button>
          )}
        </nav>

        {settingsNavLink && (
          <nav className="p-4 pt-1 space-y-1">
            <button
              onClick={() => handleNavClick(settingsNavLink.path)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all",
                location.pathname === settingsNavLink.path
                  ? "bg-brand-gradient/20 text-pink-500 border border-pink-500/20"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <settingsNavLink.icon className="w-5 h-5" />
              <span className="font-medium">{settingsNavLink.label}</span>
            </button>
          </nav>
        )}

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#0A0A0F]">
          <button
            onClick={() => handleNavClick('/profile')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-3"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture} />
              <AvatarFallback className="bg-brand-gradient text-white font-bold">
                {user ? (displayName || user.user_metadata?.name)?.charAt(0).toUpperCase() : 'G'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-semibold truncate leading-none">
                  {user ? (displayName || user.user_metadata?.name || 'User') : 'Guest'}
                </p>
                {user && isPro && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter shrink-0 leading-none",
                    "bg-brand-gradient text-white shadow-lg shadow-pink-500/20"
                  )}>
                    {tier?.toUpperCase() || 'PRO'}
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm truncate">
                {user ? `@${username || 'loading...'}` : 'Sign in to continue'}
              </p>
            </div>
          </button>

          {user && (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
