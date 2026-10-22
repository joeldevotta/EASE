import { appConfig } from '../config/appConfig';
import { initialMockEvents } from '../data/mockEvents';
import { EventFilterState, EventItem, PublicationStatus } from '../types/event';
import { storageService } from './storageService';

// In-memory subscribers for real-time reactivity across components
type EventChangeListener = (events: EventItem[]) => void;
const listeners = new Set<EventChangeListener>();

function notifyListeners(events: EventItem[]) {
  listeners.forEach((listener) => {
    try {
      listener(events);
    } catch (err) {
      console.error('Error notifying event listener:', err);
    }
  });
}

export const eventService = {
  subscribe(listener: EventChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getAllEvents(): EventItem[] {
    const stored = storageService.get<EventItem[]>(
      appConfig.storageKeys.events,
      initialMockEvents
    );
    // Ensure all initial demo events exist if stored was empty
    if (!stored || stored.length === 0) {
      storageService.set(appConfig.storageKeys.events, initialMockEvents);
      return initialMockEvents;
    }
    return stored;
  },

  getApprovedEvents(): EventItem[] {
    return this.getAllEvents().filter((ev) => ev.publicationStatus === 'Approved');
  },

  getPendingEvents(): EventItem[] {
    return this.getAllEvents().filter((ev) => ev.publicationStatus === 'Pending');
  },

  getEventById(id: string): EventItem | undefined {
    const all = this.getAllEvents();
    return all.find((ev) => ev.id === id || ev.slug === id);
  },

  async filterEvents(
    filters: Partial<EventFilterState>,
    includeUnapproved = false
  ): Promise<EventItem[]> {
    let list: EventItem[];
    if (appConfig.apiBaseUrl && !includeUnapproved) {
      const response = await fetch(appConfig.apiBaseUrl.replace(/\/$/, '') + '/events');
      if (!response.ok) {
        throw new Error('Could not load events from the backend (HTTP ' + response.status + ').');
      }
      list = (await response.json()) as EventItem[];
    } else {
      list = includeUnapproved ? this.getAllEvents() : this.getApprovedEvents();
    }

    // 1. Search Query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q) ||
          ev.category.toLowerCase().includes(q) ||
          ev.department.toLowerCase().includes(q) ||
          ev.organizingClub.toLowerCase().includes(q) ||
          ev.venue.toLowerCase().includes(q) ||
          (ev.tags && ev.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }

    // 2. Category
    if (filters.category && filters.category !== 'all') {
      list = list.filter(
        (ev) => ev.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // 3. Department
    if (filters.department && filters.department !== 'all') {
      const deptQuery = filters.department.toLowerCase();
      list = list.filter((ev) => ev.department.toLowerCase().includes(deptQuery));
    }

    // 4. Registration Status
    if (filters.registrationStatus && filters.registrationStatus !== 'all') {
      list = list.filter(
        (ev) =>
          ev.registrationStatus.toLowerCase() ===
          filters.registrationStatus!.toLowerCase()
      );
    }

    // 5. Date Range
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      
      if (filters.dateRange === 'today') {
        list = list.filter((ev) => ev.startDate === todayStr);
      } else if (filters.dateRange === 'this-week') {
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        list = list.filter((ev) => ev.startDate >= todayStr && ev.startDate <= nextWeekStr);
      } else if (filters.dateRange === 'this-month') {
        const currentMonth = todayStr.substring(0, 7);
        list = list.filter((ev) => ev.startDate.startsWith(currentMonth));
      } else if (filters.dateRange === 'upcoming') {
        list = list.filter((ev) => ev.startDate >= todayStr);
      }
    }

    // 6. Sorting
    if (filters.sortBy) {
      if (filters.sortBy === 'urgency') {
        list.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
      } else if (filters.sortBy === 'recently-added') {
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } else if (filters.sortBy === 'deadline') {
        list.sort((a, b) =>
          (a.registrationDeadline || '9999').localeCompare(b.registrationDeadline || '9999')
        );
      } else if (filters.sortBy === 'title') {
        list.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return list;
  },

  async submitEvent(
    data: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'publicationStatus'>
  ): Promise<{ success: boolean; event: EventItem; message: string }> {
    if (appConfig.apiBaseUrl) {
      const response = await fetch(appConfig.apiBaseUrl.replace(/\/$/, '') + '/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          registrationDeadline: data.registrationDeadline || data.startDate,
          registrationUrl: data.registrationUrl || null,
          posterImage: data.posterImage || null,
          publicationStatus: 'Pending',
        }),
      });

      if (!response.ok) {
        let detail = 'Backend returned HTTP ' + response.status + '.';
        try {
          const body = await response.json();
          if (body.message) detail = body.message;
          else if (body.detail) detail = body.detail;
        } catch {
          // Keep the HTTP status message when the server does not return JSON.
        }
        throw new Error(detail);
      }

      const created = (await response.json()) as EventItem;
      return {
        success: true,
        event: created,
        message: 'Event "' + created.title + '" submitted successfully for review. Ref #' + created.id + '.',
      };
    }

    const all = this.getAllEvents();
    const newId = 'eec-ev-' + Date.now().toString().slice(-6);
    const nowIso = new Date().toISOString();

    const newEvent: EventItem = {
      ...data,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
      publicationStatus: 'Pending',
      rotation: Number(((Math.random() * 2.4) - 1.2).toFixed(1)),
      pinType: (['brass', 'red', 'navy', 'green'] as const)[
        Math.floor(Math.random() * 4)
      ],
      colSpan: 4,
    };

    const updated = [newEvent, ...all];
    storageService.set(appConfig.storageKeys.events, updated);
    notifyListeners(updated);

    return {
      success: true,
      event: newEvent,
      message: 'Event "' + newEvent.title + '" submitted successfully for Dean / COE review. Ref #' + newId + '.',
    };
  },

  updateEventStatus(
    id: string,
    status: PublicationStatus,
    rejectionReason?: string
  ): boolean {
    const all = this.getAllEvents();
    const index = all.findIndex((ev) => ev.id === id);
    if (index === -1) return false;

    const updatedItem: EventItem = {
      ...all[index],
      publicationStatus: status,
      rejectionReason: rejectionReason || (status === 'Approved' ? undefined : all[index].rejectionReason),
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedItem;
    storageService.set(appConfig.storageKeys.events, all);
    notifyListeners(all);
    return true;
  },

  resetToDefaultDemo(): void {
    storageService.set(appConfig.storageKeys.events, initialMockEvents);
    notifyListeners(initialMockEvents);
  },
};
