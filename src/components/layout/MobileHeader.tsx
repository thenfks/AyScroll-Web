import React from 'react';
import { Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const isFeedPage = location.pathname === '/feed';
  const showSearch = ['/explore', '/library', '/saved'].includes(location.pathname);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:hidden transition-all duration-300",
      isFeedPage
        ? "bg-transparent"
        : "bg-black/[0.05] backdrop-blur-xl border-b border-white/[0.05]"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/ayscroll-official-logo.png" alt="AyScroll Micro Learning Logo" className="w-8 h-8" />
        <span className="text-lg font-bold text-white">AyScroll</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Search Icon (Conditional) */}
        {showSearch && (
          <button
            className="p-2 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
            onClick={() => console.log('Search clicked')}
          >
            <Search className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>
    </header>
  );
};
