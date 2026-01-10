import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Play, Download, Clock, ChevronRight } from 'lucide-react';
import { MOCK_REELS } from '@/data/data';
import { useIsMobile } from '@/hooks/use-mobile';

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
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Library</h1>
            
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero - Resume Session */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6 md:mb-8">
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Resume Session</p>
                  <h3 className="text-lg md:text-xl font-black text-white mb-2 line-clamp-2">{currentReel.title}</h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{currentReel.description}</p>
                  
                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[35%] h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    </div>
                    <span className="text-white/40 text-xs font-bold">35%</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-opacity">
                    <Play className="w-4 h-4" /> Continue
                  </button>
                  <button className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    <Clock className="w-4 h-4" /> Watch Later
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Collections</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-pink-500 flex items-center gap-1 hover:text-pink-400 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {savedReels.map((reel) => (
              <div key={reel.id} className="group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 mb-3 bg-white/[0.02]">
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
                    className="w-6 h-6 rounded-full object-cover border border-white/10"
                    alt=""
                  />
                  <span className="text-xs text-white/50 truncate">{reel.creator}</span>
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
