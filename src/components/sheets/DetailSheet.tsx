import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { X, Sparkles, Clock, Brain, ChevronRight } from 'lucide-react';
import { Reel } from '@/data/types';

interface DetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reel?: Reel;
}

export const DetailSheet: React.FC<DetailSheetProps> = ({
  open,
  onOpenChange,
  reel
}) => {
  if (!reel) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/10 max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="relative border-b border-white/5 pb-4">
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
            
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={reel.creator_avatar} 
                alt={reel.creator}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
              />
              <div>
                <p className="text-white font-semibold">{reel.creator}</p>
                <p className="text-white/40 text-sm">{reel.creator_handle}</p>
              </div>
            </div>
            
            <DrawerTitle className="text-xl font-black text-white tracking-tight">
              {reel.title}
            </DrawerTitle>
          </DrawerHeader>
          
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
            {reel.insights && reel.insights.length > 0 && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-4">
                  Core Takeaways
                </p>
                <ul className="space-y-3">
                  {reel.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                      <span className="text-white/80">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Executive Summary */}
            {reel.full_chapter_summary && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4">
                  Executive Summary
                </p>
                <blockquote className="text-white/70 italic border-l-2 border-purple-500 pl-4">
                  "{reel.full_chapter_summary}"
                </blockquote>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white">{reel.duration}</p>
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};
