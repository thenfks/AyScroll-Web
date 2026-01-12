import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Home, Compass, Library, Bookmark, BarChart2, Settings, X, LogOut } from 'lucide-react';
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

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('username, display_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading user profile:', error);
      return;
    }

    if (data) {
      const profile = data as any;
      setUsername(profile.username);
      setDisplayName(profile.display_name);
      setAvatarUrl(profile.avatar_url);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[280px] bg-[#0A0A0F]/95 backdrop-blur-xl border-l border-white/10 p-0">
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-white font-bold">Menu</SheetTitle>
        </SheetHeader>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all",
                  isActive
                    ? "bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-pink-500 border border-pink-500/20"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#0A0A0F]">
          <button
            onClick={() => handleNavClick('/profile')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-3"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold">
                {user ? (displayName || user.user_metadata?.name)?.charAt(0).toUpperCase() : 'G'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold truncate">
                {user ? (displayName || user.user_metadata?.name || 'User') : 'Guest'}
              </p>
              <p className="text-white/40 text-sm">
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
