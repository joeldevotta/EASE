import React from 'react';

interface BulldogClipProps {
  className?: string;
}

export const BulldogClip: React.FC<BulldogClipProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none w-16 h-8 flex flex-col items-center select-none ${className}`}
      aria-hidden="true"
    >
      <div className="w-12 h-3.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-t shadow-[0_2px_5px_rgba(0,0,0,0.45)]" />
      <div className="w-8 h-4 bg-stone-500 rounded-b shadow-[0_3px_6px_rgba(0,0,0,0.5)]" />
    </div>
  );
};
