import { appConfig } from '../config/appConfig';
import { initialMockClubs } from '../data/mockClubs';
import { ClubCategory, ClubItem, RecruitmentStatus } from '../types/club';
import { storageService } from './storageService';

export const clubService = {
  getAllClubs(): ClubItem[] {
    const stored = storageService.get<ClubItem[]>(
      appConfig.storageKeys.clubs,
      initialMockClubs
    );
    if (!stored || stored.length === 0) {
      storageService.set(appConfig.storageKeys.clubs, initialMockClubs);
      return initialMockClubs;
    }
    return stored;
  },

  getClubById(id: string): ClubItem | undefined {
    return this.getAllClubs().find((c) => c.id === id);
  },

  filterClubs(filters: {
    searchQuery?: string;
    category?: string;
    recruitmentStatus?: string;
  }): ClubItem[] {
    let list = this.getAllClubs();

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.facultyCoordinator.toLowerCase().includes(q) ||
          (c.wings && c.wings.some((w) => w.title.toLowerCase().includes(q)))
      );
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter(
        (c) => c.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.recruitmentStatus && filters.recruitmentStatus !== 'all') {
      list = list.filter(
        (c) =>
          c.recruitmentStatus.toLowerCase() ===
          filters.recruitmentStatus!.toLowerCase()
      );
    }

    return list;
  },

  resetClubs(): void {
    storageService.set(appConfig.storageKeys.clubs, initialMockClubs);
  },
};
