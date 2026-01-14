import { Search, Sparkles, Bell, Plus } from 'lucide-react';
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
      .single() as any;

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
      {/* Left Section: Title */}
      <div className="flex items-center w-1/4 min-w-fit">
        {pageTitle && (
          <h1 className="text-2xl font-black text-white tracking-tight shrink-0">{pageTitle}</h1>
        )}
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex justify-center flex-1 max-w-xl mx-auto px-4">
        <div className="relative w-full">
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
      <div className="flex items-center justify-end w-1/4 gap-4 min-w-fit">
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
            <Button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300 p-0 flex items-center justify-center group relative overflow-hidden">
              {/* Subtle Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <Sparkles className="w-5 h-5 text-white/70 group-hover:text-pink-500 transition-colors relative z-10" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
