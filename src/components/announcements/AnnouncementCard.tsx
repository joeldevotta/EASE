import React from 'react';
import { Link } from 'react-router-dom';
import { AnnouncementItem } from '../../types/announcement';
import { formatDateString } from '../../utils/dateUtils';
import { Pushpin } from '../common/Pushpin';
import { RubberStamp } from '../common/RubberStamp';

interface AnnouncementCardProps {
  announcement: AnnouncementItem;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
}) => {
  const isUrgent = announcement.priority === 'Urgent';
  const isImportant = announcement.priority === 'Important';
  const rotation = announcement.rotation ?? 0;

  return (
    <article
      style={{ transform: `rotate(${rotation}deg)` }}
      className="relative group hover:rotate-0 hover:scale-[1.01] transition-all duration-300"
    >
      <Pushpin
        color={isUrgent ? 'red' : isImportant ? 'brass' : 'navy'}
        className="absolute -top-3 left-6 z-30"
      />

      <div
        className={`relative rounded-sm p-6 pt-7 shadow-[0_10px_25px_-4px_rgba(50,20,5,0.35),0_3px_6px_rgba(0,0,0,0.12)] border ${
          isUrgent
            ? 'bg-[#FFF7F5] border-red-200'
            : isImportant
            ? 'bg-[#FFFBF0] border-amber-200'
            : 'bg-[#FFFEFA] border-amber-900/10'
        }`}
      >
        {/* Red Margin Line for official circulars */}
        {announcement.isStampVerified && (
          <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-red-300/50 pointer-events-none" />
        )}

        <div className="pl-3">
          {/* Top meta row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-label-sm uppercase font-bold ${
                  isUrgent
                    ? 'bg-secondary text-on-secondary animate-pulse'
                    : isImportant
                    ? 'bg-amber-600 text-white'
                    : 'bg-primary-container text-on-primary-container'
                }`}
              >
                {announcement.priority} Dispatch
              </span>
              <span className="font-label-sm text-[10px] text-outline uppercase font-bold">
                {announcement.category}
              </span>
            </div>

            <span className="font-title-md text-xs text-on-surface">
              {formatDateString(announcement.publishDate)}
            </span>
          </div>

          {/* Issuer & Reference Number */}
          <div className="flex items-center justify-between text-[11px] text-outline pb-1 font-body-sm">
            <span className="font-semibold text-primary">{announcement.issuer}</span>
            {announcement.referenceNumber && (
              <code>{announcement.referenceNumber}</code>
            )}
          </div>

          {/* Title */}
          <h3 className="font-headline-sm text-base sm:text-lg text-primary font-serif font-bold mt-1 leading-snug">
            {announcement.title}
          </h3>

          {/* Content */}
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-2.5 whitespace-pre-line leading-relaxed">
            {announcement.content}
          </p>

          {/* Attachment or Linked Event */}
          <div className="mt-4 pt-3 border-t border-amber-900/10 flex flex-wrap items-center justify-between gap-2">
            {announcement.actionUrl ? (
              <Link
                to={announcement.actionUrl}
                className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded font-title-md text-xs transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>{announcement.actionText || 'View Related Notice'}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            ) : announcement.attachmentName ? (
              <span className="text-xs text-primary font-title-md flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">attachment</span>
                <span>{announcement.attachmentName}</span>
              </span>
            ) : (
              <span className="text-xs text-outline italic">Notice verified</span>
            )}

            {announcement.isStampVerified && (
              <RubberStamp
                label="VERIFIED"
                subLabel="OFFICIAL"
                code="EEC COE"
                className="scale-75 origin-right"
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
