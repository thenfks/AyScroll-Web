import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Bookmark, FolderPlus, Play, Heart, Rocket, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_REELS } from '@/data/data';
import { useIsMobile } from '@/hooks/use-mobile';

const collections = [
  { name: 'Tech Trends', items: 12, icon: Rocket, color: 'bg-brand-gradient' },
  { name: 'Design Inspo', items: 48, icon: Paintbrush, color: 'bg-brand-gradient' },
  { name: 'Favorites', items: 154, icon: Heart, color: 'bg-brand-gradient' },
];

const Saved = () => {
  const isMobile = useIsMobile();
  const savedReels = MOCK_REELS.slice(0, 8);

  return (
    <ProtectedRoute>
      <MainLayout showRightSidebar={false}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">Saved</h1>
            <Button
              variant="outline"
              className="rounded-xl bg-secondary border-border text-foreground hover:bg-secondary/80 text-xs font-bold"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Collection
            </Button>
          </div>

          {/* Collections */}
          <div className="space-y-3 mb-10">
            {collections.map((col, i) => {
              const Icon = col.icon;
              return (
                <div
                  key={i}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-card border border-border/50 hover:border-border transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${col.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{col.name}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{col.items} ITEMS</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* All Saved Items */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" />
              All Saved
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {savedReels.map((reel) => (
              <div key={reel.id} className="group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border border-border mb-3 bg-secondary">
                  <img
                    src={reel.thumbnail_url}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    alt={reel.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Bookmark Badge */}
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-primary/20 backdrop-blur">
                    <Bookmark className="w-3 h-3 text-primary fill-current" />
                  </div>

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-bold text-white line-clamp-2">{reel.title}</p>
                  </div>
                </div>

                {/* Creator */}
                <div className="flex items-center gap-2 px-1">
                  <img
                    src={reel.creator_avatar}
                    className="w-5 h-5 rounded-full object-cover border border-border"
                    alt=""
                  />
                  <span className="text-[10px] text-muted-foreground truncate">{reel.creator}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Saved;
