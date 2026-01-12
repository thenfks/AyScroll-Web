import { Search, Plus, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Header = () => {
  const { user, signOut, isGuest } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isGuest) {
      loadUserProfile();
    }
  }, [user, isGuest]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('avatar_url, display_name')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading user profile:', error);
      return;
    }

    if (data) {
      setAvatarUrl(data.avatar_url);
      setDisplayName(data.display_name);
    }
  };

  const userName = displayName || user?.user_metadata?.name || user?.email;
  const userAvatar = avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userHandle = user?.user_metadata?.username ? `@${user.user_metadata.username}` : '';

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search AyScroll..."
            className="pl-11 bg-secondary border-0 rounded-full h-10 focus-visible:ring-primary/50"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        {isGuest ? (
          <>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="primary" className="rounded-full">
              <Link to="/signup">
                <Plus className="w-4 h-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 border-0 p-0 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Plus className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
