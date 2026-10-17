import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Corkboard } from '../components/board/Corkboard';
import { CorkboardAccessories } from '../components/board/CorkboardAccessories';
import { EventPoster } from '../components/events/EventPoster';
import { EventDetailsModal } from '../components/events/EventDetailsModal';
import { OdApplicationModal } from '../components/common/OdApplicationModal';
import { eventService } from '../../src/services/eventService';
import { EventItem } from '../types/event';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('urgency');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [odEvent, setOdEvent] = useState<EventItem | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Load and subscribe to live changes from eventService
  useEffect(() => {
    const loadEvents = async () => {
      const list = await eventService.filterEvents({
        category: activeFilter === 'all' ? undefined : activeFilter,
        sortBy: sortOption as any,
      });
      setEvents(list);
    };

    loadEvents();
    const unsubscribe = eventService.subscribe(() => {
      loadEvents();
    });

    return () => unsubscribe();
  }, [activeFilter, sortOption]);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categoriesWithCounts = [
    { key: 'all', label: 'All Notices', count: 24 },
    { key: 'Hackathon', label: '🚀 Hackathons', count: 4 },
    { key: 'Workshop', label: '🛠️ Workshops', count: 6 },
    { key: 'Academic', label: '📜 Exam & Circulars', count: 5 },
    { key: 'Club Activity', label: '🎭 Club Recruitment', count: 5 },
    { key: 'Cultural Event', label: '🏆 Culturals', count: 4 },
  ];

  return (
    <div className="w-full">
      <Corkboard
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        categoriesWithCounts={categoriesWithCounts}
        sortValue={sortOption}
        onSortChange={setSortOption}
        onQuickPinClick={
          user?.role === 'staff' || user?.role === 'admin'
            ? () => navigate('/submit')
            : undefined
        }
        urgentCount={8}
      >
        {/* Tactile Masonry Grid of Pinned Notices */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-7 items-start"
          id="notice-grid"
        >
          {events.length > 0 ? (
            events.map((event) => (
              <EventPoster
                key={event.id}
                event={event}
                onSelect={(ev) => setSelectedEvent(ev)}
                onApplyOd={(ev) => setOdEvent(ev)}
                isBookmarked={bookmarkedIds.has(event.id)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))
          ) : (
            <div className="lg:col-span-12 p-12 bg-surface-container-low/90 rounded-sm text-center border-2 border-dashed border-amber-900/20 shadow-md">
              <span className="material-symbols-outlined text-outline text-4xl mb-2">
                filter_alt_off
              </span>
              <h3 className="font-headline-sm text-lg text-primary font-bold">
                No notices found under "{activeFilter}"
              </h3>
              <p className="text-xs text-on-surface-variant font-body-sm mt-1">
                Try switching categories or view all active campus notices.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="mt-4 bg-primary text-on-primary px-4 py-2 rounded text-xs font-title-md shadow-sm"
              >
                Reset to All Notices
              </button>
            </div>
          )}

          {/* Persistent corkboard accessories (Calendar tear-off, Lost & Found stickies, Advisory) */}
          <CorkboardAccessories
            onSelectEvent={(ev) => setSelectedEvent(ev)}
          />
        </div>
      </Corkboard>

      {/* Signature Paper Zoom Detail View */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* On-Duty (OD) Application Modal */}
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
