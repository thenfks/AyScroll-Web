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
      <button
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-1 text-white transition-colors group"
      >
        <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-all glass border border-white/10">
          <ThumbsUp className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black">{likes}</span>
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all glass border border-white/10"
      >
        <ThumbsDown className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all glass border border-white/10"
      >
        <Share2 className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onResourcesClick?.(); }}
        className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all glass border border-white/10"
      >
        <FileText className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all glass border border-white/10"
      >
        <Download className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDetailClick?.(); }}
        className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all glass border border-white/10"
      >
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  );
};
