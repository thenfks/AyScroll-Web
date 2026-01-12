import { Home, Search, Library, Bookmark, Settings, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const mainNavItems = [
  { icon: Home, label: 'Home', path: '/feed', public: true },
  { icon: Search, label: 'Explore', path: '/explore', public: true },
  { icon: Library, label: 'Library', path: '/library', public: false },
  { icon: Bookmark, label: 'Saved', path: '/saved', public: false },
  { icon: BarChart2, label: 'Analysis', path: '/analysis', public: false },
];

const topics = [
  { label: 'History', color: 'bg-topic-blue' },
  { label: 'Science', color: 'bg-topic-green' },
  { label: 'Tech', color: 'bg-topic-purple' },
  { label: 'Economics', color: 'bg-topic-orange' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('username, avatar_url, display_name')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading user profile:', error);
      return;
    }

    if (data) {
      setUsername(data.username);
      setAvatarUrl(data.avatar_url);
      setDisplayName(data.display_name);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar flex-col border-r border-sidebar-border hidden md:flex">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img src="/ayscroll-official-logo.png" alt="AyScroll Micro Learning Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-foreground">AyScroll</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Topics */}
        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Topics
          </h3>
          <ul className="space-y-1">
            {topics.map((topic) => (
              <li key={topic.label}>
                <Link
                  to={`/topic/${topic.label.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200"
                >
                  <span className={cn("w-2 h-2 rounded-full", topic.color)} />
                  <span>{topic.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>

        {/* User Profile / Guest */}
        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent">
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {user ? (displayName || user.user_metadata?.name)?.charAt(0).toUpperCase() : 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user ? (displayName || user.user_metadata?.name || 'User') : 'Guest'}
            </p>
            <p className="text-xs text-muted-foreground">
              {user ? `@${username || 'loading...'}` : '@guest'}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
