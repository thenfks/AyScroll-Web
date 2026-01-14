import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardIcon } from '@/components/ui/flashcardsicon';

interface BottomNavProps {
  onFlashcardsClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onFlashcardsClick }) => {
  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onFlashcardsClick?.();
        }}
        className="rounded-full w-12 h-12 border-0 backdrop-blur-md hover:bg-white/20 hover:text-white bg-flashcard-gradient glass shadow-lg shadow-primary/20"
      >
        <FlashcardIcon size="w-6 h-6" color="white" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => e.stopPropagation()}
        className="rounded-full w-12 h-12 bg-black/30 border border-white/10 backdrop-blur-md hover:bg-white/20 text-white glass"
      >
        <Bookmark className="w-6 h-6" />
      </Button>
    </div>
  );
};
