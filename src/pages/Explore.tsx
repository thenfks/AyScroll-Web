import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Play } from 'lucide-react';
import { MOCK_REELS } from '@/data/data';
import { useIsMobile } from '@/hooks/use-mobile';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const isMobile = useIsMobile();

  const categories = [
    { name: 'All', icon: null },
    { name: 'Technology', icon: '🌐' },
    { name: 'Design', icon: '🎨' },
    { name: 'Science', icon: '🧠' },
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter">Explore</h1>
          
          {/* Search */}
          <div className="relative w-full md:w-[400px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Topics, creators, or keywords..." 
              className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 outline-none text-sm text-white focus:bg-white/[0.07] focus:border-pink-500/30 transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[11px] md:text-[12px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat.name 
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent shadow-lg shadow-pink-500/20' 
                  : 'bg-white/[0.05] text-white/40 border-white/5 hover:border-white/20 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayReels.map((reel) => (
            <div key={reel.id} className="group cursor-pointer">
              {/* Thumbnail Card */}
              <div className="relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 mb-3 md:mb-4 bg-gradient-to-br from-[#12121A] via-[#1A1A2E] to-[#0A0A0F] shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src={reel.thumbnail_url} 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" 
                  alt={reel.title} 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                
                {/* Title */}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  <h4 className="text-sm md:text-lg font-black text-white leading-tight tracking-tight group-hover:text-pink-400 transition-colors line-clamp-2">
                    {reel.title}
                  </h4>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center">
                    <Play className="w-5 h-5 md:w-7 md:h-7 text-white fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Creator Footer */}
              <div className="flex items-center gap-2 md:gap-3 px-1">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  <img src={reel.creator_avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-bold text-white tracking-tight truncate">{reel.creator}</p>
                  <p className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest truncate">{reel.category}</p>
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
