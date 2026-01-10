import React from 'react';
import { cn } from '../../lib/utils'; // Assuming cn utility is available

interface ReelModelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Content for the main ReelModel (e.g., video player)
  bottomSheetContent: React.ReactNode; // Content for the bottom sheet
}

const ReelModel: React.FC<ReelModelProps> = ({ isOpen, onClose, children, bottomSheetContent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="relative w-full max-w-md h-full max-h-[80vh] rounded-lg overflow-hidden bg-gray-900 flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
      >
        {/* Main Reel Content (e.g., Video Player) */}
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>

        {/* Custom Bottom Sheet */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-50 flex h-auto max-h-[50%] flex-col rounded-t-[10px] border bg-gray-800", // Adjusted background for contrast
            "transition-transform duration-300 ease-out",
            isOpen ? "translate-y-0" : "translate-y-full" // Simple animation
          )}
        >
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-600" />
          {bottomSheetContent}
        </div>
      </div>
    </div>
  );
};

export default ReelModel;