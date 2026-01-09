import { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Bookmark, Download, MoreVertical, Share2, Play, Pause } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FlashcardIcon } from '@/components/ui/flashcardsicon';
import { BottomNav } from '@/components/feed/nav/BottomNav';
import { SideNav } from '@/components/feed/nav/SideNav';
import { Reel } from '@/data/types';

interface VideoCardProps extends Reel {
  className?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  category,
  duration,
  thumbnail_url,
  video_url,
  creator,
  creator_handle,
  creator_avatar,
  title,
  description,
  likes,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[400px] mx-auto rounded-3xl overflow-hidden bg-card group animate-scale-in",
        className
      )}
    >
      {/* Video Player */}
      <div className="relative aspect-[9/16] bg-secondary overflow-hidden" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={video_url}
          poster={thumbnail_url}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
        />
        
        {/* Play/Pause Icon */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Play className="w-20 h-20 text-white" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Category & Duration */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
            {category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-foreground">
            <span className="w-1.5 h-1.5 bg-topic-green rounded-full animate-pulse" />
            {duration}
          </span>
        </div>

        {/* Action Buttons - Right Side */}
        <SideNav likes={likes} />

        {/* Author & Content Info */}
        <div className="absolute bottom-20 left-4 right-16">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-10 h-10 border-2 border-foreground">
              <AvatarImage src={creator_avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {creator.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-foreground">{creator}</p>
              <p className="text-xs text-foreground/70">{creator_handle}</p>
            </div>
          </div>
          <h3 className="font-bold text-foreground mb-1 line-clamp-2">{title}</h3>
          <p className="text-sm text-foreground/80 line-clamp-2">{description}</p>
        </div>
      {/* Bottom Left Actions */}
        <BottomNav />
      </div>
    </div>
  );
};
