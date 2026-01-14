import { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, Sparkles, Clock, Brain, ChevronRight, Lightbulb, FileText, Link2, Quote, Plus } from 'lucide-react'; // Added necessary icons
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/feed/nav/BottomNav';
import { SideNav } from '@/components/feed/nav/SideNav';
import ContainedBottomSheet from '@/components/ui/ContainedBottomSheet'; // Import the new ContainedBottomSheet
import { Reel, Flashcard, Resource } from '@/data/types'; // Ensure Flashcard and Resource types are imported

interface VideoCardProps extends Reel {
  className?: string;
}

type ActiveSheet = 'flashcards' | 'resources' | 'detail' | null;

const resourceIcons = {
  pdf: FileText,
  link: Link2,
  citation: Quote,
};

export const VideoCard: React.FC<VideoCardProps> = (props) => {
  const {
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
    flashcards,
    resources,
    insights, // Added insights
    full_chapter_summary, // Added full_chapter_summary
    className,
  } = props;

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null); // New state for active sheet
  const [showActionIcon, setShowActionIcon] = useState<'play' | 'pause' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iconTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (iconTimeoutRef.current) clearTimeout(iconTimeoutRef.current);

      if (!videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowActionIcon('pause');
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowActionIcon('play');
      }

      iconTimeoutRef.current = setTimeout(() => {
        setShowActionIcon(null);
      }, 500);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(err => console.log("Autoplay blocked:", err));
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const renderSheetContent = () => {
    switch (activeSheet) {
      case 'flashcards':
        return (
          <>
            <div className="relative border-b border-border pb-4 px-4">
              <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                Flashcards: {title}
              </h2>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {flashcards && flashcards.length > 0 ? (
                flashcards.map((card, index) => (
                  <div
                    key={index}
                    className="relative p-5 rounded-2xl bg-secondary/50 border border-border overflow-hidden group hover:bg-secondary/80 transition-colors"
                  >
                    {/* Gradient left border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gradient" />

                    <div className="pl-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Question</p>
                      <p className="text-foreground font-semibold mb-4">{card.question}</p>

                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Answer</p>
                      <p className="text-muted-foreground">{card.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Lightbulb className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                  <p className="text-muted-foreground font-medium">No flashcards available</p>
                </div>
              )}
            </div>
          </>
        );
      case 'resources':
        return (
          <>
            <div className="relative border-b border-border pb-4 px-4">
              <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Reference Materials
              </h2>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {resources && resources.length > 0 ? (
                <>
                  {resources.map((resource, index) => {
                    const Icon = resourceIcons[resource.type] || FileText;
                    return (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-2xl bg-secondary/50 border border-border hover:bg-secondary/80 transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                              {resource.type}
                            </p>
                            <p className="text-primary font-semibold group-hover:opacity-80 transition-colors truncate">
                              {resource.title}
                            </p>
                            {resource.description && (
                              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                {resource.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}

                  {/* Smart Analyser Upsell */}
                  <div className="p-5 rounded-2xl bg-brand-gradient/10 border border-primary/20 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-foreground font-bold">Smart Analyser</p>
                        <p className="text-muted-foreground text-xs">AI-powered deep analysis</p>
                      </div>
                    </div>
                    <p className="text-foreground/70 text-sm mb-4">
                      Get comprehensive insights, related topics, and personalized learning paths.
                    </p>
                    <button className="w-full py-3 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 transition-opacity">
                      Unlock Pro Features
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                  <p className="text-muted-foreground font-medium">No resources available</p>
                </div>
              )}
            </div>
          </>
        );
      case 'detail':
        return (
          <>
            <div className="relative border-b border-border pb-4 px-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={creator_avatar}
                  alt={creator}
                  className="w-10 h-10 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <p className="text-foreground font-semibold">{creator}</p>
                  <p className="text-muted-foreground text-sm">{creator_handle}</p>
                </div>
              </div>

              <h2 className="text-xl font-black text-foreground tracking-tight">
                {title}
              </h2>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Master Insight CTA */}
              <button className="w-full p-5 rounded-3xl bg-secondary/50 border border-border flex items-center justify-between group hover:bg-secondary/80 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-gradient/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground font-black tracking-tight">Master Insight</p>
                    <p className="text-muted-foreground text-xs font-medium">Unlock deep AI analysis</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300 relative z-10" />
              </button>

              {/* Core Takeaways */}
              {insights && insights.length > 0 && (
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                    Core Takeaways
                  </p>
                  <ul className="space-y-3">
                    {insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground font-medium">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Executive Summary */}
              {full_chapter_summary && (
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                    Executive Summary
                  </p>
                  <blockquote className="text-muted-foreground italic border-l-2 border-primary pl-4 font-medium">
                    "{full_chapter_summary}"
                  </blockquote>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-green-500/10 flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-2xl font-black text-foreground">{duration}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Saved</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-black text-foreground">94%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retention</p>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative w-full max-w-[400px] mx-auto rounded-3xl overflow-hidden bg-card group animate-scale-in",
          "md:max-w-[400px] md:aspect-[9/16]",
          // Mobile: full screen with no max-width or rounded corners
          "max-md:max-w-none max-md:rounded-none max-md:h-full max-md:w-full",
          className
        )}
      >
        {/* Video Player */}
        <div className="relative aspect-[9/16] md:aspect-[9/16] max-md:aspect-auto max-md:h-full bg-secondary overflow-hidden" onClick={togglePlay}>
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

          {/* Action Icon Pulse Overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none z-50 transition-all duration-300",
            showActionIcon ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}>
            <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
              {showActionIcon === 'play' ? (
                <Play className="w-10 h-10 text-white fill-current translate-x-1" />
              ) : (
                <Pause className="w-10 h-10 text-white fill-current" />
              )}
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Category & Duration - Desktop only (top position) */}
          <div className="absolute top-4 left-4 hidden md:flex items-center gap-2">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
              {category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              {duration}
            </span>
          </div>

          {/* Action Buttons - Right Side */}
          <SideNav
            likes={likes}
            onDetailClick={() => setActiveSheet('detail')}
            onResourcesClick={() => setActiveSheet('resources')}
          />

          {/* Author & Content Info */}
          <div className="absolute bottom-20 max-md:bottom-24 left-4 right-16 pointer-events-none">
            {/* Category & Duration - Mobile only (before avatar) */}
            <div className="flex md:hidden items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                {category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                {duration}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Avatar className="w-10 h-10 border-2 border-white/20">
                <AvatarImage src={creator_avatar} />
                <AvatarFallback className="bg-primary text-white text-sm">
                  {creator.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-bold text-[14px] text-white tracking-tight">{creator}</p>
                <p className="text-[11px] text-white/60 font-medium">{creator_handle}</p>
              </div>
            </div>
            <h3 className="font-black text-white mb-1.5 line-clamp-2 tracking-tight text-[15px]">{title}</h3>
            <p className="text-sm text-white/70 line-clamp-2 font-medium leading-snug">{description}</p>
          </div>

          {/* Bottom Left Actions */}
          <BottomNav onFlashcardsClick={() => setActiveSheet('flashcards')} />
        </div>

        {/* Contained Bottom Sheet */}
        <ContainedBottomSheet
          isOpen={activeSheet !== null}
          onClose={() => setActiveSheet(null)}
        >
          {renderSheetContent()}
        </ContainedBottomSheet>
      </div>
    </>
  );
};
