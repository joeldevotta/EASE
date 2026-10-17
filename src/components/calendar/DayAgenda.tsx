import React from 'react';
import { EventItem } from '../../types/event';
import { formatDateString } from '../../utils/dateUtils';
import { Pushpin } from '../common/Pushpin';

interface DayAgendaProps {
  selectedDate: string;
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const DayAgenda: React.FC<DayAgendaProps> = ({
  selectedDate,
  events,
  onSelectEvent,
}) => {
  const dayEvents = events.filter((ev) => {
    if (ev.startDate === selectedDate) return true;
    if (ev.endDate && ev.startDate <= selectedDate && ev.endDate >= selectedDate) {
      return true;
    }
    return false;
  });

  return (
    <div className="relative bg-[#FFFDF7] rounded-sm p-4 sm:p-6 pt-7 shadow-[0_12px_28px_rgba(50,20,5,0.35)] border border-amber-900/10">
      <Pushpin color="red" size="md" className="absolute -top-3 left-6" />

      <div className="flex items-center justify-between pb-3 border-b border-surface-container">
        <div>
          <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block font-bold">
            Selected Day Agenda
          </span>
          <h3 className="font-headline-sm text-lg text-primary font-serif font-bold">
            {formatDateString(selectedDate)}
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-xs font-title-md text-on-surface">
          {dayEvents.length} notice{dayEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {dayEvents.length > 0 ? (
          dayEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectEvent(ev);
                }
              }}
              className="p-3 bg-surface-container-low hover:bg-surface-container rounded-sm border border-amber-900/10 transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold">
                  {ev.category}
                </span>
                <span className="font-title-md text-secondary font-bold text-[11px]">
                  {ev.startTime}
                </span>
              </div>

              <h4 className="font-title-md text-sm text-primary group-hover:underline mt-1 font-serif">
                {ev.title}
              </h4>

              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-body-sm">
                <span>📍 {ev.venue.split(',')[0]}</span>
                <span>🏛️ {ev.department.split(' ')[0]}</span>
              </div>

              <div className="mt-2 text-right">
                <span className="text-[11px] font-title-md text-primary flex items-center justify-end gap-1">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 bg-surface-container-low/60 rounded text-center border border-dashed border-amber-900/20">
            <span className="material-symbols-outlined text-outline text-3xl mb-1">
              event_busy
            </span>
            <p className="font-title-md text-sm text-on-surface">
              No notices pinned for this date.
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Select another highlighted date on the calendar grid to inspect scheduled sessions or deadlines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
