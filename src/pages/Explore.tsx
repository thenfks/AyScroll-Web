import React, { useState, useMemo, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Bell, Play } from 'lucide-react';
import { MOCK_REELS } from '../data/mockReels';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        reel.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || reel.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto no-scrollbar pb-40">
        {/* Header */}
        <header className="px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between sticky top-0 z-30 bg-[#020203]/90 backdrop-blur-3xl gap-4 border-b border-white/5">
          <h1 className="hidden md:block text-4xl font-black text-white tracking-tighter">Explore</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-[450px]">
              <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pink-500 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Topics, creators, or keywords..." 
                className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-12 outline-none text-sm text-white focus:bg-white/[0.07] focus:border-pink-500/30 transition-all placeholder:text-white/20"
              />
            </div>
            <button className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </header>

        {/* Categories Chips Container - Fixed visibility with shrink-0 and min-h */}
        <div className="px-6 md:px-12 py-8 shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar min-h-[50px]">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shadow-sm ${
                  selectedCategory === cat.name 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent shadow-pink-500/20' 
                    : 'bg-white/[0.05] text-white/40 border-white/5 hover:border-white/20 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Content */}
        <div className="px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {displayReels.map((reel) => (
              <div key={reel.id} className="group cursor-pointer">
                {/* Thumbnail Card with Standby Gradient */}
                <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden border border-white/10 mb-6 bg-gradient-to-br from-[#12121A] via-[#1A1A2E] to-[#0A0A0F] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  <img 
                    src={reel.thumbnailUrl} 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" 
                    alt={reel.caption} 
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                  
                  {/* Title Content - Reduced Font Size */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <h4 className="text-xl font-black text-white leading-[1.2] tracking-tight group-hover:text-pink-400 transition-colors">
                      {reel.caption}
                    </h4>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center">
                      <Play className="w-7 h-7 text-white fill-current translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Creator Footer */}
                <div className="flex items-center gap-4 px-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                    <img src={reel.creator.avatar} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[15px] font-black text-white tracking-tight leading-tight">{reel.creator.name}</p>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.15em] mt-1">{reel.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
