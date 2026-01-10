import React from 'react';
import { ThumbsUp, ThumbsDown, Download, MoreVertical, Share2, FileText } from 'lucide-react';

interface SideNavProps {
  likes: string;
  onDetailClick?: () => void;
  onResourcesClick?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ likes, onDetailClick, onResourcesClick }) => {
  return (
    <div className="absolute right-4 bottom-32 flex flex-col gap-4">
      <button className="flex flex-col items-center gap-1 text-foreground transition-colors">
        <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors glass">
          <ThumbsUp className="w-6 h-6" />
        </div>
        <span className="text-xs">{likes}</span>
      </button>
      <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass">
        <ThumbsDown className="w-6 h-6" />
      </button>
      <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass">
        <Share2 className="w-6 h-6" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onResourcesClick?.(); }}
        className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass"
      >
        <FileText className="w-6 h-6" />
      </button>
      <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass">
        <Download className="w-6 h-6" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onDetailClick?.(); }}
        className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass"
      >
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  );
};
