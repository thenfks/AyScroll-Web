import React from 'react';

interface FlashcardsIconProps {
  className?: string;
  color?: string;
  size?: string; // Reintroducing the size prop
}

const FlashcardIcon: React.FC<FlashcardsIconProps> = ({ 
  className, // Remove default here, handle it with combinedClassName
  color = "white",
  size = "w-12 h-12" // Default size
}) => {
  const combinedClassName = className ? `${className} ${size}` : size;

  return (
    <svg 
      className={combinedClassName} // Use combinedClassName
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Capsule */}
      <rect x="4" y="4" width="10" height="24" rx="5" fill={color} fillOpacity="0.3" />
      
      {/* Internal shapes in the capsule */}
      <rect x="6.5" y="7" width="5" height="5" rx="1.5" fill={color} />
      <rect x="6.5" y="14.5" width="5" height="5" rx="1.5" fill={color} />
      <circle cx="9" cy="24" r="2.5" fill={color} />
      
      {/* Right Top Leaf/Oval Shape */}
      <path 
        d="M17 12.5C17 7.5 21 4 25.5 4C30 4 29 13 25.5 16.5C22 20 17 17.5 17 12.5Z" 
        fill={color} 
      />
      
      {/* Right Bottom Small Pill */}
      <rect x="17" y="21" width="11" height="7" rx="3.5" fill={color} fillOpacity="0.5" />
      <rect x="20" y="23" width="5" height="3" rx="1.5" fill={color} />
    </svg>
  );
};

export { FlashcardIcon };