import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:hidden">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="AyScroll" className="w-8 h-8" />
        <span className="text-lg font-bold text-white">AyScroll</span>
      </div>
      
      {/* Hamburger Menu */}
      <button 
        onClick={onMenuClick}
        className="p-2 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    </header>
  );
};
