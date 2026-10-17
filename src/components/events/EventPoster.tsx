import React from 'react';
import { EventItem } from '../../types/event';
import { formatEventDateRange } from '../../utils/dateUtils';
import { Pushpin } from '../common/Pushpin';
import { MaskingTape } from '../common/MaskingTape';
import { BulldogClip } from '../common/BulldogClip';
import { RubberStamp } from '../common/RubberStamp';

interface EventPosterProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onApplyOd?: (event: EventItem) => void;
  className?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (eventId: string) => void;
}

export const EventPoster: React.FC<EventPosterProps> = ({
  event,
  onSelect,
  onApplyOd,
  className = '',
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const rotationDeg = event.rotation ?? 0;

  // 1. HERO Hackathon Poster Layout
  if (event.isHero) {
    return (
      <article
        onClick={() => onSelect(event)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(event);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${event.title}`}
        style={{ transform: `rotate(${rotationDeg}deg)` }}
        className={`notice-card lg:col-span-7 relative group cursor-pointer hover:rotate-0 hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
      >
        {/* Two Realistic Brass Pushpins holding the top corners */}
        <Pushpin color="brass" size="lg" className="absolute -top-3 left-8 z-30" />
        <Pushpin color="brass" size="lg" className="absolute -top-3 right-8 z-30" />

        {/* Center Masking Tape */}
        <MaskingTape
          width="w-28"
          rotation="-rotate-1"
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        />

        {/* Poster Body */}
        <div className="relative bg-surface-container-lowest rounded-sm p-5 sm:p-8 pt-9 shadow-[0_12px_30px_-5px_rgba(50,20,5,0.45),0_4px_8px_rgba(0,0,0,0.18)]">
          {/* Subtle Paper Texture Wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-transparent to-stone-100/50 pointer-events-none rounded-sm" />

          {/* Top Department & Badge Row */}
          <div className="relative flex flex-wrap items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-primary text-on-primary font-label-sm text-[11px] rounded uppercase tracking-wider font-bold">
                {event.department.split(' ')[0]} x {event.organizingClub}
              </span>
              <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] rounded font-bold uppercase">
                National Level
              </span>
            </div>
            <div className="flex items-center gap-1 font-label-md text-xs text-secondary font-bold">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              <span>{event.registrationStatus}</span>
            </div>
          </div>

          {/* Header and Grand Title */}
          <div className="relative mt-1">
            <span className="font-label-sm text-xs uppercase tracking-widest text-outline">
              36-Hour National Flagship Hackathon
            </span>
            <h2 className="font-display-lg text-2xl sm:text-display-lg text-primary tracking-tight mt-1 font-serif">
              {event.title}
            </h2>
            <p className="font-headline-sm text-sm sm:text-headline-sm text-tertiary italic mt-0.5 font-serif">
              "Code for Impact: Autonomous Systems & Scalable Solutions"
            </p>
          </div>

          {/* Feature Banner Graphic Area */}
          <div className="relative mt-4 rounded-lg overflow-hidden bg-primary-container text-on-primary-container shadow-inner">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-primary via-primary-container to-[#1a2d42] relative">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
                <div className="bg-surface-container-lowest/10 backdrop-blur-md p-3 rounded">
                  <span className="font-label-sm text-[10px] text-tertiary-fixed-dim uppercase block">
                    Cash Prize Pool
                  </span>
                  <p className="font-headline-lg text-xl sm:text-headline-lg text-on-primary font-bold">
                    ₹1,50,000
                  </p>
                  <span className="font-body-sm text-xs text-on-primary-container">
                    + Incubation Grants
                  </span>
                </div>
                <div className="bg-surface-container-lowest/10 backdrop-blur-md p-3 rounded">
                  <span className="font-label-sm text-[10px] text-tertiary-fixed-dim uppercase block">
                    Hack Duration
                  </span>
                  <p className="font-headline-lg text-xl sm:text-headline-lg text-on-primary font-bold">
                    36 Hours
                  </p>
                  <span className="font-body-sm text-xs text-on-primary-container">
                    Offline Sprint
                  </span>
                </div>
                <div className="bg-surface-container-lowest/10 backdrop-blur-md p-3 rounded">
                  <span className="font-label-sm text-[10px] text-tertiary-fixed-dim uppercase block">
                    Expected Teams
                  </span>
                  <p className="font-headline-lg text-xl sm:text-headline-lg text-on-primary font-bold">
                    120+ Teams
                  </p>
                  <span className="font-body-sm text-xs text-on-primary-container">
                    Pan-India Sprints
                  </span>
                </div>
              </div>

              {/* Theme Pills */}
              {event.tags && (
                <div className="mt-3 pt-2 flex flex-wrap gap-1.5 text-on-primary">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-container-lowest/20 px-2 py-0.5 rounded text-[11px] font-label-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logistic Specs Bar */}
          <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 py-2.5 bg-surface-container-low px-3.5 rounded text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">event</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline uppercase">
                  Dates
                </span>
                <span className="font-title-md text-on-surface">
                  {formatEventDateRange(event.startDate, event.endDate)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">location_on</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline uppercase">
                  Venue
                </span>
                <span className="font-title-md text-on-surface truncate max-w-[140px]">
                  {event.venue.split(',')[0]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <span className="material-symbols-outlined text-primary text-lg">group</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline uppercase">
                  Team Size
                </span>
                <span className="font-title-md text-on-surface">
                  {event.teamSize || '2 to 4 Members'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="relative flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(event);
                }}
                className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span>Read Full Notice</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              {onApplyOd && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyOd(event);
                  }}
                  className="bg-surface-container-high hover:bg-surface-variant text-on-surface px-3 py-2 rounded font-title-md text-xs transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">assignment_ind</span>
                  <span>OD Form</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-outline">
              <span className="font-label-sm text-xs">#HackEaswari25</span>
              {onToggleBookmark && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(event.id);
                  }}
                  className={`p-1 transition-colors ${
                    isBookmarked ? 'text-secondary' : 'hover:text-primary'
                  }`}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isBookmarked ? 'bookmark_added' : 'bookmark'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Tactile Corner Post-It Note */}
          {event.postIt && (
            <div className="absolute -bottom-5 -right-3 sm:-right-5 z-20 w-48 sm:w-56 bg-[#F4CF65] p-3 rounded shadow-[0_8px_20px_rgba(70,40,10,0.35)] transform rotate-3 hover:rotate-1 transition-transform pointer-events-none">
              <Pushpin color="red" size="sm" className="absolute -top-2 left-1/2 -translate-x-1/2" />
              <div className="flex items-start gap-1.5 text-on-tertiary-fixed pt-1 text-xs">
                <span className="material-symbols-outlined text-amber-900 text-sm mt-0.5">
                  warning
                </span>
                <div>
                  <p className="font-title-md font-bold text-amber-950 uppercase text-[11px]">
                    {event.postIt.title}
                  </p>
                  <p className="font-body-sm text-amber-900 text-[11px] leading-tight mt-0.5">
                    {event.postIt.text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  // 2. OFFICIAL ACADEMIC CIRCULAR LETTERHEAD (COE / Dean Office)
  if (event.isCircularLetterhead) {
    return (
      <article
        onClick={() => onSelect(event)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(event);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View circular: ${event.title}`}
        style={{ transform: `rotate(${rotationDeg}deg)` }}
        className={`notice-card lg:col-span-5 relative group cursor-pointer hover:rotate-0 hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
      >
        <BulldogClip className="absolute -top-5 left-1/2 -translate-x-1/2 z-30" />

        <div className="relative bg-[#FFFBF0] rounded-sm p-5 sm:p-7 pt-8 shadow-[0_10px_25px_-4px_rgba(50,20,5,0.4),0_3px_6px_rgba(0,0,0,0.15)]">
          {/* Red Margin Line */}
          <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-red-300/60 pointer-events-none" />

          {/* Letterhead Top */}
          <div className="text-center pb-2 pl-4">
            <span className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold block">
              Easwari Engineering College
            </span>
            <span className="block font-label-sm text-[9px] tracking-wide text-on-surface-variant uppercase">
              Autonomous Institution • Affiliated to Anna University, Chennai
            </span>
            <div className="mt-1 inline-block bg-primary text-on-primary px-2.5 py-0.5 rounded text-[10px] font-title-md uppercase tracking-wider">
              {event.organizingClub || 'Office of Controller of Examinations'}
            </div>
          </div>

          {/* Reference Meta */}
          <div className="pl-4 flex justify-between items-center text-[11px] font-label-sm text-outline pt-2 pb-1">
            <span>Ref: EEC/COE/EVEN/2024-25/084</span>
            <span className="font-bold text-on-surface">
              {formatEventDateRange(event.startDate)}
            </span>
          </div>

          <div className="pl-4 mt-1">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
              OFFICIAL CIRCULAR / URGENT
            </span>
            <h3 className="font-headline-sm text-base sm:text-headline-sm text-primary font-serif mt-0.5 leading-snug">
              {event.title}
            </h3>
          </div>

          <div className="pl-4 mt-2.5 text-on-surface-variant font-body-sm text-xs leading-relaxed line-clamp-3">
            {event.description}
          </div>

          {/* Rubber Stamp and Signature */}
          <div className="pl-4 mt-4 flex items-end justify-between">
            <RubberStamp label="AUTONOMOUS" subLabel="VERIFIED" code="COE EEC" />
            <div className="text-right">
              <span className="font-serif italic text-xs text-primary block">
                {event.facultyCoordinator}
              </span>
              <span className="font-label-sm text-[9px] text-outline uppercase block">
                Controller of Examinations
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="pl-4 mt-4 pt-2 border-t border-amber-900/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event);
              }}
              className="bg-primary text-on-primary hover:bg-primary-container px-3 py-1.5 rounded font-title-md text-xs shadow-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">visibility</span>
              <span>Open Circular</span>
            </button>
            <span className="text-[11px] font-title-md text-secondary font-bold">
              Important Dispatch
            </span>
          </div>

          {/* Pinned Attached Note */}
          {event.postIt && (
            <div className="mt-3 ml-4 bg-[#E3F2D9] p-2 rounded shadow-sm relative transform -rotate-1">
              <Pushpin color="green" size="sm" className="absolute -top-2 left-3" />
              <p className="font-body-sm text-[11px] text-emerald-950 font-medium pl-2">
                📌 <strong>{event.postIt.title}</strong> {event.postIt.text}
              </p>
            </div>
          )}
        </div>
      </article>
    );
  }

  // 3. STANDARD / WORKSHOP / RECRUITMENT / SEMINAR NOTICE CARDS
  const isGreenTheme = event.category === 'Workshop';
  const isCulturalTheme = event.category === 'Cultural Event';
  const isClubTheme = event.category === 'Club Activity';

  return (
    <article
      onClick={() => onSelect(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(event);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details: ${event.title}`}
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      className={`notice-card lg:col-span-4 relative group cursor-pointer hover:rotate-0 hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    >
      {/* Top Pushpin */}
      {event.pinType && (
        <Pushpin
          color={event.pinType === 'double-brass' ? 'brass' : event.pinType}
          className="absolute -top-3 left-6 z-30"
        />
      )}

      {/* Top Washi Tape if applicable */}
      {event.hasTape && (
        <MaskingTape
          color={isClubTheme ? 'rose' : 'amber'}
          className="absolute -top-3 right-6 z-20"
        />
      )}

      {/* Body cardstock */}
      <div
        className={`relative rounded-sm p-5 pt-7 shadow-[0_10px_25px_-4px_rgba(50,20,5,0.35),0_3px_6px_rgba(0,0,0,0.12)] border border-amber-900/5 ${
          isCulturalTheme
            ? 'bg-gradient-to-b from-[#FFF2DE] to-[#FFE7CD]'
            : isGreenTheme
            ? 'bg-[#F4EFE6]'
            : isClubTheme
            ? 'bg-[#FFF7F2]'
            : 'bg-[#FAF6EE]'
        }`}
      >
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between pb-1.5 text-xs">
          <span
            className={`px-2 py-0.5 rounded font-label-sm text-[10px] uppercase font-bold ${
              isGreenTheme
                ? 'bg-[#2D4A34] text-white'
                : isClubTheme
                ? 'bg-secondary text-on-secondary'
                : isCulturalTheme
                ? 'bg-tertiary-container text-tertiary-fixed'
                : 'bg-primary-container text-on-primary-container'
            }`}
          >
            {event.category}
          </span>
          <span className="font-label-sm text-[11px] text-secondary font-bold">
            {event.registrationStatus}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-headline-md text-base sm:text-headline-md text-primary font-serif mt-1 leading-snug">
          {event.title}
        </h3>

        {/* Speaker Profile for Alumni Talk */}
        {event.speaker && (
          <div className="mt-2.5 flex items-center gap-2.5 p-2 bg-surface-container-high/60 rounded">
            {event.speaker.avatar && (
              <img
                src={event.speaker.avatar}
                alt={event.speaker.name}
                className="w-10 h-10 rounded-full object-cover border border-amber-900/20"
              />
            )}
            <div>
              <h4 className="font-title-md text-xs text-on-surface font-bold">
                {event.speaker.name}
              </h4>
              <p className="font-body-sm text-[10px] text-on-surface-variant">
                {event.speaker.role}
              </p>
              <p className="font-label-sm text-[9px] text-outline">
                {event.speaker.batch}
              </p>
            </div>
          </div>
        )}

        {/* Description snippet */}
        <p className="font-body-sm text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Key logistics */}
        <div className="mt-3 space-y-1 bg-surface-container-low/80 p-2.5 rounded text-xs">
          <div className="flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-sm text-primary">
              calendar_month
            </span>
            <span>
              <strong>Date:</strong> {formatEventDateRange(event.startDate, event.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-sm text-primary">
              location_on
            </span>
            <span className="truncate">
              <strong>Venue:</strong> {event.venue.split('(')[0]}
            </span>
          </div>
        </div>

        {/* Tags / prizes badge */}
        {event.prizes && (
          <div className="mt-2 text-[11px] text-secondary font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">emoji_events</span>
            <span>{event.prizes}</span>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-4 pt-2 border-t border-amber-900/10 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event);
            }}
            className="font-title-md text-primary hover:underline flex items-center gap-1"
          >
            <span>Notice Specs</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
          <span className="font-label-sm text-[10px] text-outline">
            {event.department.split(' ')[0]}
          </span>
        </div>
      </div>
    </article>
  );
};
