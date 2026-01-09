import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';

export const Header = () => {
  const { user, signOut, isGuest } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
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
        <div className="flex items-center gap-3 ml-6">
          {isGuest ? (
            <Button 
              variant="primary" 
              className="rounded-full"
              onClick={() => setShowAuthModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          ) : (
            <>
              <Button variant="primary" className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Post
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};
