import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Bookmark, FolderPlus, Play, Heart, Rocket, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_REELS } from '@/data/data';
import { useIsMobile } from '@/hooks/use-mobile';

const collections = [
  { name: 'Tech Trends', items: 12, icon: Rocket, color: 'from-pink-500 to-orange-500' },
  { name: 'Design Inspo', items: 48, icon: Paintbrush, color: 'from-purple-500 to-pink-500' },
  { name: 'Favorites', items: 154, icon: Heart, color: 'from-red-500 to-pink-500' },
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
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Saved</h1>
            <Button 
              variant="outline" 
              className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs font-bold"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Collection
            </Button>
          </div>

          {/* Collections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {collections.map((col, i) => {
              const Icon = col.icon;
              return (
                <div 
                  key={i}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${col.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">{col.name}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/30">{col.items} items</p>
                </div>
              );
            })}
          </div>

          {/* All Saved Items */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-pink-500" />
              All Saved
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {savedReels.map((reel) => (
              <div key={reel.id} className="group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 mb-3 bg-white/[0.02]">
                  <img 
                    src={reel.thumbnail_url} 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    alt={reel.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Bookmark Badge */}
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-pink-500/20 backdrop-blur">
                    <Bookmark className="w-3 h-3 text-pink-500 fill-current" />
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
                    className="w-5 h-5 rounded-full object-cover border border-white/10"
                    alt=""
                  />
                  <span className="text-[10px] text-white/40 truncate">{reel.creator}</span>
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
