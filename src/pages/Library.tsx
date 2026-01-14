import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Play, Download, Clock, ChevronRight } from 'lucide-react';
import { MOCK_REELS } from '@/data/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { GradientButton } from '@/components/ui/GradientButton';
import { cn } from '@/lib/utils';

const Library = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'downloaded' | 'history'>('saved');
  const isMobile = useIsMobile();
  const savedReels = MOCK_REELS.slice(0, 6);
  const currentReel = MOCK_REELS[0];

  const tabs = [
    { id: 'saved', label: 'Saved' },
    { id: 'downloaded', label: 'Downloaded' },
    { id: 'history', label: 'History' },
  ];

  return (
    <ProtectedRoute>
      <MainLayout showRightSidebar={false}>
        <div className="max-w-5xl mx-auto">
          {/* Header with Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">Library</h1>

            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-2xl border border-border">
              {tabs.map((tab) => (
                <GradientButton
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  gradient={activeTab === tab.id ? 'brand' : 'dark'}
                  glow={activeTab === tab.id}
                  className={cn(
                    "px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-[11px]",
                    activeTab !== tab.id && "bg-transparent border-transparent"
                  )}
                >
                  {tab.label}
                </GradientButton>
              ))}
            </div>
          </div>

          {/* Hero - Resume Session */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-brand-gradient/10 border border-primary/20 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Thumbnail */}
              <div className="relative w-full md:w-48 aspect-video md:aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shrink-0">
                <img
                  src={currentReel.thumbnail_url}
                  className="w-full h-full object-cover"
                  alt={currentReel.title}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Resume Session</p>
                  <h3 className="text-lg md:text-xl font-black text-foreground mb-2 line-clamp-2">{currentReel.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{currentReel.description}</p>

                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="w-[35%] h-full bg-brand-gradient rounded-full" />
                    </div>
                    <span className="text-muted-foreground text-xs font-bold">35%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <GradientButton className="px-4 md:px-6 py-3 text-[10px] md:text-[11px]">
                    <Play className="w-4 h-4" /> Continue
                  </GradientButton>
                  <GradientButton gradient="dark" glow={false} className="px-4 md:px-6 py-3 text-[10px] md:text-[11px] text-muted-foreground hover:text-foreground">
                    <Clock className="w-4 h-4" /> Watch Later
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Collections</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-80 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {savedReels.map((reel) => (
              <div key={reel.id} className="group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border border-border mb-3 bg-secondary">
                  <img
                    src={reel.thumbnail_url}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    alt={reel.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Download Badge */}
                  <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 backdrop-blur">
                    <Download className="w-4 h-4 text-white" />
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-bold text-white line-clamp-2">{reel.title}</p>
                  </div>
                </div>

                {/* Creator */}
                <div className="flex items-center gap-2">
                  <img
                    src={reel.creator_avatar}
                    className="w-6 h-6 rounded-full object-cover border border-border"
                    alt=""
                  />
                  <span className="text-xs text-muted-foreground truncate">{reel.creator}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Library;
