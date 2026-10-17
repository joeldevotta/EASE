import React, { useState } from 'react';
import { EventItem } from '../../types/event';
import { getMonthCalendarGrid } from '../../utils/dateUtils';
import { Pushpin } from '../common/Pushpin';

interface MonthCalendarProps {
  events: EventItem[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onSelectEvent: (event: EventItem) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  events,
  selectedDate,
  onSelectDate,
  onSelectEvent,
}) => {
  // Current viewing month state (e.g. March 2025 by default)
  const [currentYear, setCurrentYear] = useState<number>(() => {
    if (selectedDate) {
      const y = Number(selectedDate.split('-')[0]);
      if (!isNaN(y)) return y;
    }
    return 2025;
  });

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    if (selectedDate) {
      const m = Number(selectedDate.split('-')[1]);
      if (!isNaN(m)) return m - 1; // 0-indexed
    }
    return 2; // March (0 = Jan, 1 = Feb, 2 = Mar)
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    onSelectDate(todayStr);
  };

  const { days, monthName, year } = getMonthCalendarGrid(
    currentYear,
    currentMonth
  );

  // Map dates to events
  const getEventsForDate = (dateStr: string) => {
    return events.filter((ev) => {
      if (ev.startDate === dateStr) return true;
      if (ev.endDate && ev.startDate <= dateStr && ev.endDate >= dateStr) {
        return true;
      }
      return false;
    });
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative bg-[#FFFDF7] rounded-sm p-4 sm:p-6 pt-7 shadow-[0_12px_28px_rgba(50,20,5,0.35)] border border-amber-900/10">
      <Pushpin color="navy" size="md" className="absolute -top-3 left-6" />
      <Pushpin color="brass" size="md" className="absolute -top-3 right-6" />

      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-container">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            calendar_month
          </span>
          <div>
            <h2 className="font-display-lg text-xl sm:text-2xl text-primary font-serif font-bold">
              {monthName} {year}
            </h2>
            <p className="font-label-sm text-[10px] text-outline uppercase tracking-wider">
              Autonomous Academic Calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={handleToday}
            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-xs font-title-md text-on-surface transition-colors"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            aria-label="Previous Month"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            aria-label="Next Month"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 mt-3 mb-1 text-center font-label-md text-xs text-outline font-bold">
        {weekdays.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map(({ day, dateString, isCurrentMonth }, idx) => {
          const dayEvents = getEventsForDate(dateString);
          const isSelected = selectedDate === dateString;
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={`${dateString}-${idx}`}
              type="button"
              onClick={() => onSelectDate(dateString)}
              className={`min-h-[50px] sm:min-h-[68px] p-1 sm:p-1.5 rounded-sm flex flex-col justify-between text-left transition-all relative border ${
                isSelected
                  ? 'bg-amber-100 border-primary ring-2 ring-primary/40 font-bold shadow-sm'
                  : hasEvents
                  ? 'bg-surface-container-low hover:bg-amber-50/80 border-amber-900/15'
                  : isCurrentMonth
                  ? 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
                  : 'bg-surface-container/30 border-transparent text-outline/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs sm:text-sm font-title-md ${
                    isSelected ? 'text-primary' : isCurrentMonth ? 'text-on-surface' : 'text-outline'
                  }`}
                >
                  {day}
                </span>

                {hasEvents && (
                  <span className="hidden sm:inline-block px-1 py-0.2 bg-primary text-on-primary rounded-full text-[9px] font-bold">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event indicators dots/strip */}
              {hasEvents && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {dayEvents.slice(0, 3).map((ev) => {
                    const dotColor =
                      ev.category === 'Hackathon'
                        ? 'bg-primary'
                        : ev.category === 'Academic'
                        ? 'bg-secondary'
                        : ev.category === 'Workshop'
                        ? 'bg-emerald-700'
                        : ev.category === 'Cultural Event'
                        ? 'bg-amber-600'
                        : 'bg-indigo-600';

                    return (
                      <span
                        key={ev.id}
                        title={ev.title}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${dotColor} shadow-xs`}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] text-outline leading-none">+</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Legend */}
      <div className="mt-4 pt-3 border-t border-surface-container flex flex-wrap items-center gap-3 text-[11px] text-on-surface-variant font-label-md">
        <span className="font-bold text-outline uppercase">Legend:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary" /> Hackathons
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-secondary" /> Exam & Circulars
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-700" /> Workshops
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-600" /> Culturals
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-600" /> Club Activity
        </span>
      </div>
    </div>
  );
};
