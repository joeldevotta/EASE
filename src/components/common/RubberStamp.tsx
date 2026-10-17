import React from 'react';

interface RubberStampProps {
  label?: string;
  subLabel?: string;
  code?: string;
  color?: 'secondary' | 'emerald' | 'primary';
  className?: string;
}

export const RubberStamp: React.FC<RubberStampProps> = ({
  label = 'AUTONOMOUS',
  subLabel = 'VERIFIED',
  code = 'COE EEC',
  color = 'secondary',
  className = '',
}) => {
  const colorStyles = {
    secondary: 'border-secondary/70 text-secondary',
    emerald: 'border-emerald-700/70 text-emerald-800',
    primary: 'border-primary/70 text-primary',
  }[color];

  return (
    <div
      className={`relative w-20 h-20 rounded-full border-2 p-1 flex items-center justify-center transform -rotate-12 select-none opacity-85 pointer-events-none ${colorStyles} ${className}`}
      aria-hidden="true"
    >
      <div className="w-full h-full rounded-full border border-dashed flex flex-col items-center justify-center text-center">
        <span className="text-[7.5px] font-bold uppercase tracking-tight">
          {label}
        </span>
        <span className="text-[10px] font-black uppercase leading-none my-0.5">
          {subLabel}
        </span>
        <span className="text-[7px] font-semibold">{code}</span>
      </div>
    </div>
  );
};
