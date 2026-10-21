import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { eventService } from '../services/eventService';
import { EventCategory, EventItem, EventSortOption } from '../types/event';
import { EventPoster } from '../components/events/EventPoster';
import { EventDetailsModal } from '../components/events/EventDetailsModal';
import { OdApplicationModal } from '../components/common/OdApplicationModal';
import { Pushpin } from '../components/common/Pushpin';

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States from URL or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [department, setDepartment] = useState(searchParams.get('department') || 'all');
  const [registrationStatus, setRegistrationStatus] = useState(
    searchParams.get('status') || 'all'
  );
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'this-week' | 'this-month' | 'upcoming'>(
    (searchParams.get('range') as any) || 'all'
  );
  const [sortBy, setSortBy] = useState<EventSortOption>(
    (searchParams.get('sort') as any) || 'urgency'
  );

  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [odEvent, setOdEvent] = useState<EventItem | null>(null);

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (category !== 'all') params.category = category;
    if (department !== 'all') params.department = department;
    if (registrationStatus !== 'all') params.status = registrationStatus;
    if (dateRange !== 'all') params.range = dateRange;
    if (sortBy !== 'urgency') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [searchQuery, category, department, registrationStatus, dateRange, sortBy]);

  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Execute the filter pipeline and show backend failures instead of an unhandled rejection.
  useEffect(() => {
    let active = true;
    const fetchFiltered = async () => {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const results = await eventService.filterEvents({
          searchQuery,
          category: category === 'all' ? undefined : category,
          department: department === 'all' ? undefined : department,
          registrationStatus: registrationStatus === 'all' ? undefined : registrationStatus,
          dateRange,
          sortBy,
        });
        if (active) setFilteredEvents(results);
      } catch (error) {
        if (active) {
          setEventsError(error instanceof Error ? error.message : 'Could not load campus events.');
          setFilteredEvents([]);
        }
      } finally {
        if (active) setEventsLoading(false);
      }
    };

    void fetchFiltered();
    const unsubscribe = eventService.subscribe(() => { void fetchFiltered(); });
    return () => { active = false; unsubscribe(); };
  }, [searchQuery, category, department, registrationStatus, dateRange, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setDepartment('all');
    setRegistrationStatus('all');
    setDateRange('all');
    setSortBy('urgency');
  };

  const categories: string[] = [
    'all',
    'Hackathon',
    'Workshop',
    'Technical Competition',
    'Cultural Event',
    'Club Activity',
    'Academic',
    'Seminar',
  ];

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen">
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
          {/* Pinned Search & Filter Desk Plaque */}
          <div className="relative bg-surface-container-low/95 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-[0_12px_28px_rgba(60,30,10,0.45)] mb-8 border border-amber-900/10">
            <Pushpin color="brass" size="md" className="absolute -top-3 left-6" />
            <Pushpin color="brass" size="md" className="absolute -top-3 right-6" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-surface-container">
              <div>
                <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                  All Campus Notices & Event Discovery
                </h1>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-0.5">
                  Vetted by Autonomous Examination Cell & Directorate of Student Affairs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-surface-container-highest rounded text-xs font-title-md text-on-surface">
                  {filteredEvents.length} notice{filteredEvents.length !== 1 ? 's' : ''} matched
                </span>
                {(searchQuery ||
                  category !== 'all' ||
                  department !== 'all' ||
                  registrationStatus !== 'all' ||
                  dateRange !== 'all') && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-secondary hover:underline font-title-md flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="mt-4">
              <div className="relative flex items-center bg-surface-container-lowest rounded-lg px-3.5 py-2 shadow-inner border border-amber-900/15 focus-within:border-primary">
                <span className="material-symbols-outlined text-outline text-lg mr-2">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword (e.g., 'hackathon', 'robotics', 'exam timetable', 'CSE', 'auditions')..."
                  className="w-full bg-transparent font-body-sm text-sm text-on-surface placeholder:text-outline focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Combined Filter Controls Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-title-md">
              {/* Category */}
              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
                >
                  <option value="all">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Robotics">Robotics & AI</option>
                  <option value="Examination Cell">Exam Cell</option>
                  <option value="Student Affairs">Student Affairs</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Registration
                </label>
                <select
                  value={registrationStatus}
                  onChange={(e) => setRegistrationStatus(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
                >
                  <option value="all">Any Status</option>
                  <option value="Open">Open</option>
                  <option value="Closing Soon">Closing Soon</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as EventSortOption)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
                >
                  <option value="urgency">Urgency / Date</option>
                  <option value="recently-added">Recently Added</option>
                  <option value="deadline">Earliest Deadline</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Masonry Grid of Notices */}
          {eventsLoading ? (
            <div role="status" className="max-w-lg mx-auto rounded-lg bg-[#FFFDF7] p-10 text-center shadow-md">
              <p className="font-title-md text-primary">Loading campus notices…</p>
              <p className="mt-2 text-sm text-on-surface-variant">Getting the latest approved events.</p>
            </div>
          ) : eventsError ? (
            <div role="alert" className="max-w-lg mx-auto rounded-lg border border-red-900/15 bg-[#FFFDF7] p-10 text-center shadow-md">
              <h3 className="font-headline-sm text-lg text-primary font-bold">We couldn’t load campus notices</h3>
              <p className="mt-2 text-sm text-on-surface-variant">{eventsError}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded bg-primary px-4 py-2 text-xs font-title-md text-on-primary shadow-sm">
                Try again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
              {filteredEvents.map((event) => (
                <EventPoster
                  key={event.id}
                  event={event}
                  onSelect={(ev) => setSelectedEvent(ev)}
                  onApplyOd={(ev) => setOdEvent(ev)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 bg-[#FFFDF7] rounded-sm text-center border-2 border-dashed border-amber-900/20 shadow-md max-w-lg mx-auto">
              <span className="material-symbols-outlined text-outline text-4xl mb-2">
                find_in_page
              </span>
              <h3 className="font-headline-sm text-lg text-primary font-bold">
                No notices found. Try another search.
              </h3>
              <p className="text-xs text-on-surface-variant font-body-sm mt-1">
                No active notices matched your combination of keywords and filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 bg-primary text-on-primary px-4 py-2 rounded text-xs font-title-md shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Zoom Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* OD Modal */}
      {odEvent && (
        <OdApplicationModal
          isOpen={Boolean(odEvent)}
          onClose={() => setOdEvent(null)}
          eventTitle={odEvent.title}
          department={odEvent.department}
          eventDates={odEvent.startDate}
        />
      )}
    </div>
  );
};
