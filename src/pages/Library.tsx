import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Play, Download, Clock, ChevronRight, FolderPlus, Rocket, Palette, Heart, Bookmark } from 'lucide-react';
import { MOCK_REELS } from '@/data/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { GradientButton } from '@/components/ui/GradientButton';
import { cn } from '@/lib/utils';

const Library = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'downloaded' | 'history'>('saved');
  const isMobile = useIsMobile();
  const savedReels = MOCK_REELS.slice(0, 6);
  const currentReel = MOCK_REELS[0];

  return (
    <ProtectedRoute>
      <MainLayout showRightSidebar={false}>
        <div className="max-w-5xl mx-auto">
          {/* Header & Tabs */}
          <div className="flex flex-col gap-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">Library</h1>

            <div className="flex w-full md:w-auto items-center gap-1 p-1 bg-secondary/50 rounded-2xl border border-border overflow-x-auto no-scrollbar">
              {[
                { id: 'saved', label: 'Saved' },
                { id: 'downloaded', label: 'Downloaded' },
                { id: 'history', label: 'History' },
              ].map((tab) => (
                <GradientButton
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  gradient={activeTab === tab.id ? 'brand' : 'dark'}
                  glow={activeTab === tab.id}
                  className={cn(
                    "flex-1 w-full px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-[11px] whitespace-nowrap justify-center",
                    activeTab !== tab.id && "bg-transparent border-transparent"
                  )}
                >
                  {tab.label}
                </GradientButton>
              ))}
            </div>
          </div>

          {activeTab === 'saved' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Resume Session Hero */}
              <div className="p-5 md:p-6 rounded-[32px] bg-card/50 border border-border/50 mb-10 group overflow-hidden relative">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-64 aspect-video md:aspect-[4/5] rounded-2xl overflow-hidden shrink-0 shadow-2xl">
                    <img
                      src={currentReel.thumbnail_url}
                      className="w-full h-full object-cover"
                      alt={currentReel.title}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange mb-3">Resume Session</p>
                      <h3 className="text-xl md:text-2xl font-black text-foreground mb-3 leading-tight">{currentReel.title}</h3>
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">Breaking down the hybrid picking and double stops used by Mayank. High-fidelity audio walkthrough included.</p>

                      {/* Progress */}
                      <div className="flex items-center gap-4 mb-6 md:mb-0">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="w-[35%] h-full bg-brand-gradient rounded-full" />
                        </div>
                        <span className="text-muted-foreground text-xs font-bold">35%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <GradientButton className="px-8 py-3 text-xs md:text-sm font-bold uppercase tracking-wide">
                        <Play className="w-4 h-4 mr-2" /> Continue
                      </GradientButton>
                      <button className="px-6 py-3 rounded-xl border border-border text-xs md:text-sm font-bold uppercase tracking-wide hover:bg-secondary transition-colors flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Watch Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collections Grid Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Collections</h2>
                <button className="text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-orange flex items-center gap-1 hover:opacity-80 transition-opacity">
                  View All <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>

              {/* Collections Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {savedReels.map((reel) => (
                  <div key={reel.id} className="group cursor-pointer">
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-white/5 mb-3 bg-secondary shadow-lg">
                      <img
                        src={reel.thumbnail_url}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
                        alt={reel.title}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Download Badge */}
                      <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors">
                        <Download className="w-4 h-4 text-white" />
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-sm md:text-[15px] font-bold text-white leading-snug line-clamp-2">{reel.title}</p>
                      </div>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-2 px-1">
                      <img
                        src={reel.creator_avatar}
                        className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white/10"
                        alt=""
                      />
                      <span className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">{reel.creator}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-70 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-[32px] bg-secondary/50 flex items-center justify-center mb-6">
                <Play className="w-10 h-10 text-muted-foreground opacity-50 ml-1" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2 capitalize">{activeTab}</h3>
              <p className="text-muted-foreground text-sm font-medium">This section is coming soon.</p>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute >
  );
};

export default Library;
// Forced update to clear cache
