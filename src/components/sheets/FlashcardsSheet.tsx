import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { X, Lightbulb } from 'lucide-react';
import { Flashcard } from '@/data/types';

interface FlashcardsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcards?: Flashcard[];
  title?: string;
}

export const FlashcardsSheet: React.FC<FlashcardsSheetProps> = ({
  open,
  onOpenChange,
  flashcards = [],
  title = 'Flashcards'
}) => {
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
            <DrawerTitle className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              {title}
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {flashcards.length > 0 ? (
              flashcards.map((card, index) => (
                <div 
                  key={index}
                  className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden group hover:bg-white/[0.05] transition-colors"
                >
                  {/* Gradient left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500" />
                  
                  <div className="pl-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2">Question</p>
                    <p className="text-white font-semibold mb-4">{card.question}</p>
                    
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Answer</p>
                    <p className="text-white/70">{card.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 font-medium">No flashcards available</p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
