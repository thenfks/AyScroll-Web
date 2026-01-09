import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardIcon } from '@/components/ui/flashcardsicon';

interface BottomNavProps {
  // Add any props if needed
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-3">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full w-12 h-12 border-0 backdrop-blur-sm hover:bg-white/20 hover:text-white bg-flashcard-gradient glass" // Added glass effect
      >
        <FlashcardIcon size="w-6 h-6" color="white" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full w-12 h-12 bg-black/30 border-0 backdrop-blur-sm hover:bg-white/20 hover:text-white glass" // Added glass effect
      >
        <Bookmark className="w-6 h-6" />
      </Button>
    </div>
  );
};
