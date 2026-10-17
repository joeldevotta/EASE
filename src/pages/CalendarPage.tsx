import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { EventItem } from '../types/event';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import { DayAgenda } from '../components/calendar/DayAgenda';
import { EventDetailsModal } from '../components/events/EventDetailsModal';
import { Pushpin } from '../components/common/Pushpin';

export const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  // Default selected date to March 20, 2025 where multiple key activities are happening
  const [selectedDate, setSelectedDate] = useState<string>('2025-03-20');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const list = eventService.getApprovedEvents();
    setEvents(list);

    const unsubscribe = eventService.subscribe(() => {
      setEvents(eventService.getApprovedEvents());
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
        <div
          className="rounded-lg p-4 sm:p-6 lg:p-8 min-h-[850px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)]"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
          }}
        >
          {/* Top Banner Plaque */}
          <div className="relative bg-surface-container-low/95 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-[0_12px_28px_rgba(60,30,10,0.45)] mb-8 border border-amber-900/10">
            <Pushpin color="brass" size="md" className="absolute -top-3 left-6" />
            <Pushpin color="brass" size="md" className="absolute -top-3 right-6" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                  Interactive Campus Academic Calendar
                </h1>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-0.5">
                  Synchronized with Autonomous COE Exam Schedules & Club Milestones
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-title-md">
                  Even Semester 2024-2025
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Responsive Layout: Month Calendar + Day Agenda */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-8">
              <MonthCalendar
                events={events}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onSelectEvent={(ev) => setSelectedEvent(ev)}
              />
            </div>

            <div className="lg:col-span-4">
              <DayAgenda
                selectedDate={selectedDate}
                events={events}
                onSelectEvent={(ev) => setSelectedEvent(ev)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signature Paper Zoom Detail Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};
