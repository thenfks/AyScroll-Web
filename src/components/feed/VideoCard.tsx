import { useState, useRef } from 'react';
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

  const renderSheetContent = () => {
    switch (activeSheet) {
      case 'flashcards':
        return (
          <>
            <div className="relative border-b border-white/5 pb-4 px-4">
              <button
                onClick={() => setActiveSheet(null)}
                className="absolute right-6 top-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
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
                    className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden group hover:bg-white/[0.05] transition-colors"
                  >
                    {/* Gradient left border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500" />

                    <div className="pl-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2">Question</p>
                      <p className="text-white font-semibold mb-4">{card.question}</p>

                      <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Answer</p>
                      <p className="text-white/70">{card.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <Lightbulb className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40 font-medium">No flashcards available</p>
                </div>
              )}
            </div>
          </>
        );
      case 'resources':
        return (
          <>
            <div className="relative border-b border-white/5 pb-4 px-4">
              <button
                onClick={() => setActiveSheet(null)}
                className="absolute right-6 top-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
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
                        className="block p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-pink-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                              {resource.type}
                            </p>
                            <p className="text-pink-400 font-semibold group-hover:text-pink-300 transition-colors truncate">
                              {resource.title}
                            </p>
                            {resource.description && (
                              <p className="text-white/50 text-sm mt-1 line-clamp-2">
                                {resource.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}

                  {/* Smart Analyser Upsell */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Smart Analyser</p>
                        <p className="text-white/50 text-xs">AI-powered deep analysis</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                      Get comprehensive insights, related topics, and personalized learning paths.
                    </p>
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity">
                      Unlock Pro Features
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40 font-medium">No resources available</p>
                </div>
              )}
            </div>
          </>
        );
      case 'detail':
        return (
          <>
            <div className="relative border-b border-white/5 pb-4 px-4">
              <button
                onClick={() => setActiveSheet(null)}
                className="absolute right-6 top-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={creator_avatar}
                  alt={creator}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                />
                <div>
                  <p className="text-white font-semibold">{creator}</p>
                  <p className="text-white/40 text-sm">{creator_handle}</p>
                </div>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight">
                {title}
              </h2>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Master Insight CTA */}
              <button className="w-full p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-between group hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold">Master Insight</p>
                    <p className="text-white/70 text-sm">Get AI-powered deep analysis</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Core Takeaways */}
              {insights && insights.length > 0 && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-4">
                    Core Takeaways
                  </p>
                  <ul className="space-y-3">
                    {insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                        <span className="text-white/80">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Executive Summary */}
              {full_chapter_summary && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4">
                    Executive Summary
                  </p>
                  <blockquote className="text-white/70 italic border-l-2 border-purple-500 pl-4">
                    "{full_chapter_summary}"
                  </blockquote>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{duration}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Time Saved</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 flex items-center justify-center mb-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-2xl font-black text-white">94%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Retention</p>
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
          "relative w-full max-w-[400px] mx-auto rounded-3xl overflow-hidden bg-card group animate-scale-in h-full", // Added h-full
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
          <SideNav
            likes={likes}
            onDetailClick={() => setActiveSheet('detail')}
            onResourcesClick={() => setActiveSheet('resources')}
          />

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
