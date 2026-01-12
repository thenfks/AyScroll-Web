import { Search, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Header = () => {
  const { user, isGuest } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isExplorePage = location.pathname === '/explore';

  // Initialize local search state from URL if on explore page
  const [searchTerm, setSearchTerm] = useState(isExplorePage ? searchParams.get('q') || '' : '');

  // Keep local search in sync with URL on Explore page
  useEffect(() => {
    if (isExplorePage) {
      setSearchTerm(searchParams.get('q') || '');
    }
  }, [searchParams, isExplorePage]);

  const getPageTitle = (path: string) => {
    if (path === '/explore') return 'Explore';
    if (path === '/library') return 'Library';
    if (path === '/saved') return 'Saved';
    if (path === '/analysis') return 'Analysis';
    if (path === '/settings') return 'Settings';
    return null;
  };

  const pageTitle = getPageTitle(location.pathname);

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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (isExplorePage) {
      setSearchParams({ q: value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isExplorePage && searchTerm.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-6">
      {/* Left Section: Title + Search */}
      <div className="flex items-center gap-6 flex-1">
        {pageTitle && (
          <h1 className="text-xl font-black text-white tracking-tight shrink-0">{pageTitle}</h1>
        )}

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Topics, creators, or keywords..."
            className="pl-11 bg-secondary border-0 rounded-full h-10 focus-visible:ring-primary/50 w-full"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6 shrink-0">
        {/* Bell Icon */}
        <Button variant="ghost" className="w-10 h-10 rounded-full border border-border bg-background/50 hover:bg-accent shrink-0 flex items-center justify-center p-0">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </Button>

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
