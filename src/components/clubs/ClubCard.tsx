import React, { useState } from 'react';
import { ClubItem } from '../../types/club';
import { openExternalUrl } from '../../utils/externalLinks';
import { Pushpin } from '../common/Pushpin';
import { MaskingTape } from '../common/MaskingTape';
import { RecruitmentBadge } from './RecruitmentBadge';

interface ClubCardProps {
  club: ClubItem;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const rotation = club.rotation ?? 0;

  const handleApply = () => {
    if (club.applicationUrl) {
      openExternalUrl(club.applicationUrl);
    } else {
      setShowApplyModal(true);
    }
  };

  return (
    <>
      <article
        style={{ transform: `rotate(${rotation}deg)` }}
        className="relative group hover:rotate-0 hover:scale-[1.01] transition-all duration-300 focus-within:rotate-0"
      >
        {club.pinType && (
          <Pushpin color={club.pinType} className="absolute -top-3 left-6 z-30" />
        )}
        {club.hasTape && (
          <MaskingTape
            color="rose"
            className="absolute -top-3 right-6 z-20"
          />
        )}

        <div className="relative bg-[#FFF9F3] rounded-sm p-6 pt-8 shadow-[0_10px_25px_-4px_rgba(50,20,5,0.35),0_3px_6px_rgba(0,0,0,0.12)] border border-amber-900/10">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
            <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold">
              {club.category}
            </span>
            <RecruitmentBadge status={club.recruitmentStatus} />
          </div>

          <h3 className="font-headline-md text-xl text-primary font-serif font-bold mt-1">
            {club.name}
          </h3>
          <p className="font-title-md text-xs text-secondary italic font-serif mt-0.5">
            "{club.tagline}"
          </p>

          <p className="font-body-sm text-xs text-on-surface-variant mt-3 leading-relaxed">
            {club.description}
          </p>

          {/* Sub-Wings Grid */}
          {club.wings && club.wings.length > 0 && (
            <div className="mt-4">
              <span className="font-label-sm text-[10px] uppercase text-outline font-bold block mb-1.5">
                Recruitment Wings & Teams
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {club.wings.map((wing, i) => (
                  <div
                    key={i}
                    className="p-2 bg-secondary-fixed/40 rounded text-on-secondary-fixed border border-secondary-fixed/60"
                  >
                    <span className="font-title-md block text-[11px] font-bold">
                      {wing.title}
                    </span>
                    <span className="text-[10px] opacity-80 line-clamp-1">
                      {wing.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audition Details Box */}
          {club.auditionDates && (
            <div className="mt-4 p-3 bg-surface-container rounded text-xs text-on-surface border border-amber-900/5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block font-title-md text-primary font-bold">
                    Audition Sessions
                  </span>
                  <span className="text-on-surface-variant text-[11px]">
                    {club.auditionDates}
                  </span>
                  {club.auditionVenue && (
                    <span className="block text-outline text-[10px] mt-0.5">
                      📍 {club.auditionVenue}
                    </span>
                  )}
                </div>
                {club.recruitmentStatus === 'Open' && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase shrink-0">
                    Walk-in
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Faculty In-charge & Student Lead info */}
          <div className="mt-3.5 pt-3 border-t border-surface-container grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
            <div>
              <span className="text-outline block text-[9px] uppercase font-bold">
                Faculty Advisor
              </span>
              <span className="font-title-md text-on-surface truncate block">
                {club.facultyCoordinator}
              </span>
            </div>
            {club.studentLead && (
              <div>
                <span className="text-outline block text-[9px] uppercase font-bold">
                  Student Lead
                </span>
                <span className="font-title-md text-on-surface truncate block">
                  {club.studentLead}
                </span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-5 pt-2 border-t border-amber-900/10 flex items-center justify-between gap-2">
            {club.recruitmentStatus === 'Open' ? (
              <button
                type="button"
                onClick={handleApply}
                className="bg-secondary hover:bg-secondary/90 text-on-secondary px-3.5 py-1.5 rounded font-title-md text-xs shadow-sm flex items-center gap-1 transition-all"
              >
                <span>Register for Auditions</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </button>
            ) : (
              <span className="text-xs text-outline font-title-md">
                Recruitment Inactive
              </span>
            )}

            {club.socialHandle && (
              <span className="font-label-sm text-xs text-primary font-bold">
                {club.socialHandle}
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Notice Dialog if URL not configured */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl border border-amber-900/10">
            <h4 className="font-headline-sm text-base text-primary font-bold">
              Audition Registration Notice
            </h4>
            <p className="mt-2 text-xs text-on-surface-variant font-body-sm leading-relaxed">
              Online registration form for <strong>{club.name}</strong> is currently open for direct walk-in auditions at {club.auditionVenue}. Please report directly during audition hours or reach out to {club.studentLead || club.facultyCoordinator}.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="bg-primary text-on-primary px-4 py-1.5 rounded text-xs font-title-md"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
