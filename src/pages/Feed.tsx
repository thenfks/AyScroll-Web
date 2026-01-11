import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/feed/VideoCard';
import { MOCK_REELS } from '@/data/data';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { useIsMobile } from '@/hooks/use-mobile';

const Feed = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  // Mobile full-screen reel view
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-background overflow-hidden">
        {/* Transparent Mobile Header - overlaid on video */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 safe-area-top bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <img src="/ayscroll-official-logo.png" alt="AyScroll Micro Learning Logo" className="w-8 h-8" />
            <span className="text-lg font-bold text-white">AyScroll</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-xl bg-white/10 backdrop-blur-sm"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

        {/* Full Screen Reels - covers entire viewport */}
        <div className="h-full w-full snap-y snap-mandatory overflow-y-auto">
          {MOCK_REELS.slice(0, 10).map((reel) => (
            <div key={reel.id} className="h-[100dvh] w-full snap-start snap-always">
              <VideoCard {...reel} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop view with MainLayout
  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-8">
        <div className="space-y-8 pb-8">
          {MOCK_REELS.map((reel) => (
            <VideoCard
              key={reel.id}
              {...reel}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Feed;
