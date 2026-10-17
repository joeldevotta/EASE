import React from 'react';

interface PushpinProps {
  color?: 'brass' | 'red' | 'navy' | 'green';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Pushpin: React.FC<PushpinProps> = ({
  color = 'brass',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  }[size];

  const colorGradients = {
    brass: 'from-amber-700 via-yellow-400 to-yellow-100 shadow-[3px_5px_8px_rgba(40,15,5,0.6),inset_0_2px_3px_rgba(255,255,255,0.9)]',
    red: 'from-red-800 via-red-500 to-red-300 shadow-[3px_5px_8px_rgba(40,15,5,0.6),inset_0_2px_3px_rgba(255,255,255,0.8)]',
    navy: 'from-sky-950 via-primary to-sky-300 shadow-[3px_5px_8px_rgba(40,15,5,0.6),inset_0_2px_3px_rgba(255,255,255,0.8)]',
    green: 'from-emerald-800 via-emerald-500 to-emerald-200 shadow-[3px_5px_8px_rgba(40,15,5,0.6),inset_0_2px_3px_rgba(255,255,255,0.8)]',
  }[color];

  return (
    <div
      className={`pointer-events-none flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-tr ${colorGradients} flex items-center justify-center`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-inner" />
      </div>
    </div>
  );
};
