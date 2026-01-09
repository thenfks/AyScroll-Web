import React from 'react';
import { ThumbsUp, ThumbsDown, Download, MoreVertical, Share2 } from 'lucide-react';

interface SideNavProps {
  likes: string; // Assuming likes will be passed as a prop
}

export const SideNav: React.FC<SideNavProps> = ({ likes }) => {
  return (
    <div className="absolute right-4 bottom-32 flex flex-col gap-4">
      <button className="flex flex-col items-center gap-1 text-foreground transition-colors">
        <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors glass"> {/* Added glass effect */}
          <ThumbsUp className="w-6 h-6" />
        </div>
        <span className="text-xs">{likes}</span>
      </button>
      <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass"> {/* Added glass effect */}
        <ThumbsDown className="w-6 h-6" />
      </button>
      <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass"> {/* Added glass effect */}
        <Share2 className="w-6 h-6" />
      </button>
      <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass"> {/* Added glass effect */}
        <Download className="w-6 h-6" />
      </button>
      <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 hover:text-white transition-colors glass"> {/* Added glass effect */}
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  );
};
