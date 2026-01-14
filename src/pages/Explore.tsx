import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Play } from 'lucide-react';
import { MOCK_REELS } from '@/data/data';
import { useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { GradientButton } from '@/components/ui/GradientButton';

const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const isMobile = useIsMobile();

  const categories = [
    { name: 'All', icon: null },
    { name: 'Technology', icon: '🌐' },
    { name: 'Design', icon: '🎨' },
    { name: 'Psychology', icon: '🧠' },
    { name: 'Business', icon: '💼' },
    { name: 'Engineering', icon: '⚙️' },
    { name: 'Music', icon: '🎸' },
  ];

  const displayReels = useMemo(() => {
    return MOCK_REELS.filter((reel) => {
      const matchesSearch =
        reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || reel.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-7xl mx-auto pt-6">

        {/* Categories */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <GradientButton
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              gradient={selectedCategory === cat.name ? 'brand' : 'dark'}
              glow={selectedCategory === cat.name}
              className={`px-5 md:px-8 py-2.5 md:py-3.5 text-[10px] md:text-[12px] whitespace-nowrap shrink-0`}
            >
              {cat.name}
            </GradientButton>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayReels.map((reel) => (
            <div key={reel.id} className="group cursor-pointer">
              {/* Thumbnail Card */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border mb-3 md:mb-4 bg-secondary shadow-theme-md transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-theme-lg group-hover:border-primary/30">
                <img
                  src={reel.thumbnail_url}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700"
                  alt={reel.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end pointer-events-none">
                  <h4 className="text-[13px] md:text-[17px] font-black text-white leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {reel.title}
                  </h4>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Play className="w-5 h-5 md:w-7 md:h-7 text-white fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Creator Footer - Outside card, theme adaptive */}
              <div className="flex items-center gap-3 px-1">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl overflow-hidden border border-border bg-secondary shrink-0 shadow-sm transition-transform group-hover:scale-105">
                  <img src={reel.creator_avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-[14px] font-black text-foreground tracking-tight truncate group-hover:text-primary transition-colors">{reel.creator}</p>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] truncate">{reel.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Explore;
