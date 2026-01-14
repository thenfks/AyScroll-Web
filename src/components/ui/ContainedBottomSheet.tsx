import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';

interface ContainedBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const MIN_HEIGHT = 60; // Minimum height in pixels
const MAX_HEIGHT_PERCENT = 80; // Maximum height as a percentage of parent
const CLOSE_THRESHOLD_PERCENT = 10; // Close if dragged below 10% of parent height

const ContainedBottomSheet: React.FC<ContainedBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const [initialHeight, setInitialHeight] = useState<number>(MIN_HEIGHT * 4);
  const [currentHeight, setCurrentHeight] = useState<number>(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const parentHeight = sheetRef.current?.parentElement?.offsetHeight || window.innerHeight;
      const calculatedHeight = Math.min(
        contentHeight + 80, // Add some padding and handle height
        (parentHeight * MAX_HEIGHT_PERCENT) / 100
      );
      const newInitialHeight = Math.max(calculatedHeight, MIN_HEIGHT);
      setInitialHeight(newInitialHeight);
      setCurrentHeight(newInitialHeight);
    }
  }, [isOpen, children]);

  // Reset height when sheet opens
  useEffect(() => {
    if (isOpen) {
      setCurrentHeight(initialHeight);
    }
  }, [isOpen, initialHeight]);

  const handleDragStart = useCallback(
    (clientY: number) => {
      setIsDragging(true);
      startY.current = clientY;
      startHeight.current = sheetRef.current?.offsetHeight || currentHeight;
    },
    [currentHeight],
  );

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging || !sheetRef.current) return;

      const deltaY = startY.current - clientY; // Dragging up increases height
      const parentHeight =
        sheetRef.current.parentElement?.offsetHeight || window.innerHeight;
      const newHeight = Math.max(
        MIN_HEIGHT,
        Math.min(
          startHeight.current + deltaY,
          (parentHeight * MAX_HEIGHT_PERCENT) / 100,
        ),
      );

      setCurrentHeight(newHeight);
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (!sheetRef.current) return;

    const parentHeight =
      sheetRef.current.parentElement?.offsetHeight || window.innerHeight;
    const currentHeightPercent = (currentHeight / parentHeight) * 100;

    if (currentHeightPercent < CLOSE_THRESHOLD_PERCENT) {
      onClose();
    } else {
      // Save the current height as the new initial height for the next open
      setInitialHeight(currentHeight);
    }
  }, [currentHeight, onClose]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientY);
    e.preventDefault();
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientY);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd]);


  if (!isOpen) return null;

  return (
    <div
      ref={sheetRef}
      className={cn(
        "absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl bg-popover/95 backdrop-blur-xl border-t border-border",
        "transition-all duration-300 ease-out", // Changed to transition-all
        isOpen ? "translate-y-0" : "translate-y-full",
        className
      )}
      style={{ height: isOpen ? `${currentHeight}px` : '0px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="mx-auto mt-4 h-1.5 w-[40px] rounded-full bg-muted-foreground/30 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
      <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default ContainedBottomSheet;
