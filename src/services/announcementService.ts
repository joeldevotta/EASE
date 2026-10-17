import { appConfig } from '../config/appConfig';
import { initialMockAnnouncements } from '../data/mockAnnouncements';
import { AnnouncementCategory, AnnouncementItem } from '../types/announcement';
import { storageService } from './storageService';

export const announcementService = {
  getAllAnnouncements(): AnnouncementItem[] {
    const stored = storageService.get<AnnouncementItem[]>(
      appConfig.storageKeys.announcements,
      initialMockAnnouncements
    );
    if (!stored || stored.length === 0) {
      storageService.set(
        appConfig.storageKeys.announcements,
        initialMockAnnouncements
      );
      return initialMockAnnouncements;
    }
    return stored;
  },

  getAnnouncementById(id: string): AnnouncementItem | undefined {
    return this.getAllAnnouncements().find((a) => a.id === id);
  },

  filterAnnouncements(filters: {
    category?: string;
    priority?: string;
    searchQuery?: string;
  }): AnnouncementItem[] {
    let list = this.getAllAnnouncements();

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.issuer.toLowerCase().includes(q) ||
          (a.referenceNumber && a.referenceNumber.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter(
        (a) => a.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.priority && filters.priority !== 'all') {
      list = list.filter(
        (a) => a.priority.toLowerCase() === filters.priority!.toLowerCase()
      );
    }

    return list;
  },

  resetAnnouncements(): void {
    storageService.set(
      appConfig.storageKeys.announcements,
      initialMockAnnouncements
    );
  },
};
