import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const trendingItems = [
  { rank: 1, category: 'TECH • TRENDING', title: '#AIRevolution', views: '2.3M reels' },
  { rank: 2, category: 'MUSIC • VIRAL', title: 'Epic Guitar Solos', views: '896k reels' },
  { rank: 3, category: 'CREATIVE • HOT', title: 'AyScroll Edit', views: '195k reels' },
];

const suggestedUsers = [
  { name: 'Anurag Pandey', username: '@anurag', avatar: '' },
  { name: 'Mayank Jha', username: '@mayankjha', avatar: '' },
  { name: 'Miricale', username: '@minio04', avatar: '' },
  { name: 'Dhruv Aggarwal', username: '@dhruv23', avatar: '' },
];

export const RightSidebar = () => {
  return (
    <aside className="fixed right-0 top-0 h-screen w-[320px] bg-background border-l border-border flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 pt-20">
        {/* Trending Section */}
        <div className="bg-card rounded-2xl p-5 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Hottest</h3>
          </div>

          <div className="space-y-4">
            {trendingItems.map((item) => (
              <div
                key={item.rank}
                className="flex items-start gap-3 group cursor-pointer"
              >
                <span className="text-lg font-bold text-muted-foreground/50 w-4">
                  {item.rank}
                </span>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.category}</p>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.views}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 rounded-full border-border hover:border-primary hover:text-primary"
          >
            Explore All
          </Button>
        </div>

        {/* Who to Follow */}
        <div className="bg-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🌟</span>
            <h3 className="font-semibold text-foreground">Who to Follow</h3>
          </div>

          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div
                key={user.username}
                className="flex items-center gap-3"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-secondary text-muted-foreground text-sm">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.username}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs px-4 border-border hover:border-primary hover:text-primary"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <footer className="p-6 text-center">
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} AyScroll. All rights reserved.
        </p>
      </footer>
    </aside>
  );
};
