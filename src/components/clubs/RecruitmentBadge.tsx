import React from 'react';
import { RecruitmentStatus } from '../../types/club';

interface RecruitmentBadgeProps {
  status: RecruitmentStatus;
  className?: string;
}

export const RecruitmentBadge: React.FC<RecruitmentBadgeProps> = ({
  status,
  className = '',
}) => {
  const styles = {
    Open: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'Opening Soon': 'bg-amber-100 text-amber-900 border-amber-300',
    Closed: 'bg-stone-200 text-stone-700 border-stone-300',
    'Not Announced': 'bg-surface-container-high text-outline border-outline-variant',
  }[status];

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-title-md border font-bold flex items-center gap-1 ${styles} ${className}`}
    >
      {status === 'Open' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
      )}
      <span>Recruitment: {status}</span>
    </span>
  );
};
