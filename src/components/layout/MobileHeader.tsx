import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SearchDrawer } from './SearchDrawer';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const isFeedPage = location.pathname === '/feed';

  // Show search everywhere except maybe specific pages? 
  // User asked to "add search button", implies general availability.
  // We'll keep it simple and show it.

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:hidden transition-all duration-300",
        isFeedPage
          ? "bg-transparent"
          : "bg-white/80 dark:bg-black/50 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.05]"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/ayscroll-official-logo.png" alt="AyScroll Micro Learning Logo" className="w-8 h-8" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">AyScroll</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button - Always Visible */}
          <button
            className="p-2 rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
        </div>
      </header>

      <SearchDrawer open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
