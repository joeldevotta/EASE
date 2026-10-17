import React from 'react';

interface MaskingTapeProps {
  className?: string;
  width?: string;
  rotation?: string;
  color?: 'amber' | 'cream' | 'rose';
}

export const MaskingTape: React.FC<MaskingTapeProps> = ({
  className = '',
  width = 'w-24',
  rotation = '-rotate-1',
  color = 'amber',
}) => {
  const colorClasses = {
    amber: 'bg-amber-100/75 shadow-[0_2px_4px_rgba(80,40,10,0.2)]',
    cream: 'bg-[#FFF8E9]/80 shadow-[0_2px_4px_rgba(70,30,10,0.18)]',
    rose: 'bg-red-200/80 shadow-[0_2px_4px_rgba(90,20,10,0.2)]',
  }[color];

  return (
    <div
      className={`pointer-events-none h-6 ${width} ${colorClasses} backdrop-blur-[1px] transform ${rotation} select-none ${className}`}
      style={{
        clipPath:
          'polygon(0% 4%, 2% 0%, 98% 2%, 100% 6%, 99% 94%, 97% 100%, 3% 98%, 0% 92%)',
      }}
      aria-hidden="true"
    />
  );
};
