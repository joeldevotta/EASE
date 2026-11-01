import { appConfig } from '../config/appConfig';
import { initialMockLostFoundItems } from '../data/mockLostFound';
import {
  LostFoundAdminItem,
  LostFoundPublicItem,
  LostFoundSubmissionInput,
  LostFoundSubmissionResult,
} from '../types/lostFound';
import { readFileMagicBytes, validateLostFoundImage, validateLostFoundSubmission } from '../utils/validation';
import { storageService } from './storageService';

type LostFoundChangeListener = () => void;
const listeners = new Set<LostFoundChangeListener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Error notifying Lost & Found listener:', err);
    }
  });
}

function getApiBase(): string {
  if (!appConfig.apiBaseUrl) return '';
  const base = appConfig.apiBaseUrl.trim().replace(/\/$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

const STORAGE_KEY = 'ease_campus_lost_found_v1';

export const lostFoundService = {
  subscribe(listener: LostFoundChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Fetches approved public Lost & Found items.
   * If apiBaseUrl is configured, calls GET /api/lost-found.
   * Note: Throws an error on server failure without silent fallback to mock data.
   */
  async getApprovedItems(): Promise<LostFoundPublicItem[]> {
    const apiBase = getApiBase();
    if (apiBase) {
      const response = await fetch(`${apiBase}/lost-found`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        let message = `Could not load Lost & Found items from the backend (HTTP ${response.status}).`;
        try {
          const body = await response.json();
          if (body.message) message = body.message;
          else if (body.detail) message = body.detail;
        } catch {
          // Keep default message if not JSON
        }
        throw new Error(message);
      }

      const items = (await response.json()) as LostFoundPublicItem[];
      return items.map((item) => attachPublicImageUrl(item, apiBase));
    }

    // Local / offline demo mode
    const all = storageService.get<LostFoundAdminItem[]>(
      STORAGE_KEY,
      initialMockLostFoundItems
    );
    return all
      .filter((item) => item.publicationStatus === 'Approved')
      .map(({ id, itemName, description, reportType, location, createdAt, hasImage }) => ({
        id,
        itemName,
        description,
        reportType,
        location,
        createdAt,
        hasImage: Boolean(hasImage),
        imageUrl: null,
      }));
  },

  /**
   * Submits a new Lost or Found item report for review.
   * All reports start as Pending. Only approved items are visible publicly.
   */
  async submitItem(
    data: LostFoundSubmissionInput,
    image?: File | null
  ): Promise<LostFoundSubmissionResult> {
    const validation = validateLostFoundSubmission(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] || 'Invalid submission payload.';
      throw new Error(firstError);
    }

    if (image) {
      const magicBytes = await readFileMagicBytes(image);
      const imageValidation = validateLostFoundImage({
        name: image.name,
        size: image.size,
        type: image.type,
        magicBytes,
      });
      if (!imageValidation.isValid) {
        throw new Error(imageValidation.error || 'The selected image is not valid.');
      }
    }

    const payload: LostFoundSubmissionInput = {
      itemName: data.itemName.trim(),
      description: data.description.trim(),
      reportType: data.reportType,
      location: data.location.trim(),
      contactName: data.contactName.trim(),
      contactEmail: data.contactEmail.trim(),
    };

    const apiBase = getApiBase();
    if (apiBase) {
      const body = new FormData();
      body.append('itemName', payload.itemName);
      body.append('description', payload.description);
      body.append('reportType', payload.reportType);
      body.append('location', payload.location);
      body.append('contactName', payload.contactName);
      body.append('contactEmail', payload.contactEmail);
      if (image) {
        body.append('image', image);
      }

      const response = await fetch(`${apiBase}/lost-found`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body,
      });

      if (!response.ok) {
        let detail = `Backend returned HTTP ${response.status}.`;
        try {
          const body = await response.json();
          if (body.message) detail = body.message;
          else if (body.detail) detail = body.detail;
        } catch {
          // Keep HTTP status detail
        }
        throw new Error(detail);
      }

      const created = attachPublicImageUrl(
        (await response.json()) as LostFoundPublicItem,
        apiBase
      );
      notifyListeners();
      return {
        success: true,
        item: created,
        message: `Report for "${created.itemName}" submitted successfully. Ref #${created.id}. It is currently pending review by Student Affairs (Rm 104) and will appear once approved.`,
      };
    }

    // Offline / Demo mode
    const nowIso = new Date().toISOString();
    const newId = `eec-lf-${Date.now().toString().slice(-6)}`;
    const newItem: LostFoundAdminItem = {
      ...payload,
      id: newId,
      publicationStatus: 'Pending',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const all = storageService.get<LostFoundAdminItem[]>(
      STORAGE_KEY,
      initialMockLostFoundItems
    );
    const updated = [newItem, ...all];
    storageService.set(STORAGE_KEY, updated);
    notifyListeners();

    const publicItem: LostFoundPublicItem = {
      id: newItem.id,
      itemName: newItem.itemName,
      description: newItem.description,
      reportType: newItem.reportType,
      location: newItem.location,
      createdAt: newItem.createdAt,
      hasImage: false,
      imageUrl: null,
    };

    return {
      success: true,
      item: publicItem,
      message: `Report for "${publicItem.itemName}" submitted successfully. Ref #${newId}. It is currently pending review by Student Affairs (Rm 104) and will appear once approved.`,
    };
  },

  /**
   * Admin: fetch items by publication status.
   */
  async getAdminItems(
    authHeader?: string,
    status: 'Pending' | 'Approved' | 'Rejected' | 'all' = 'Pending'
  ): Promise<LostFoundAdminItem[]> {
    const apiBase = getApiBase();
    if (apiBase) {
      const query = status === 'all' ? '' : `?status=${encodeURIComponent(status)}`;
      const response = await fetch(`${apiBase}/admin/lost-found${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Backend admin authentication failed. Valid EASE_ADMIN_USERNAME and EASE_ADMIN_PASSWORD credentials are required.');
        }
        let message = `Request failed (HTTP ${response.status}).`;
        try {
          const body = await response.json();
          if (body.message) message = body.message;
          else if (body.detail) message = body.detail;
        } catch {}
        throw new Error(message);
      }

      const items = (await response.json()) as LostFoundAdminItem[];
      return items.map((item) => attachAdminImageUrl(item, apiBase));
    }

    // Offline / Demo mode
    const all = storageService.get<LostFoundAdminItem[]>(
      STORAGE_KEY,
      initialMockLostFoundItems
    );
    if (status === 'all') return all;
    return all.filter((item) => item.publicationStatus === status);
  },

  /**
   * Admin: review status change.
   */
  async updateStatus(
    id: string,
    status: 'Approved' | 'Rejected',
    rejectionReason?: string,
    authHeader?: string
  ): Promise<boolean> {
    const apiBase = getApiBase();
    if (apiBase) {
      const response = await fetch(
        `${apiBase}/admin/lost-found/${encodeURIComponent(id)}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: JSON.stringify({
            status,
            ...(status === 'Rejected' ? { rejectionReason } : {}),
          }),
        }
      );

      if (!response.ok) {
        let message = `Could not update report status (HTTP ${response.status}).`;
        try {
          const body = await response.json();
          if (body.message) message = body.message;
        } catch {}
        throw new Error(message);
      }

      notifyListeners();
      return true;
    }

    // Offline / Demo mode
    const all = storageService.get<LostFoundAdminItem[]>(
      STORAGE_KEY,
      initialMockLostFoundItems
    );
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) return false;

    all[index] = {
      ...all[index],
      publicationStatus: status,
      rejectionReason: status === 'Rejected' ? rejectionReason : null,
      updatedAt: new Date().toISOString(),
    };
    storageService.set(STORAGE_KEY, all);
    notifyListeners();
    return true;
  },

  resetToDefaultDemo(): void {
    storageService.set(STORAGE_KEY, initialMockLostFoundItems);
    notifyListeners();
  },
};

function attachPublicImageUrl(item: LostFoundPublicItem, apiBase: string): LostFoundPublicItem {
  return {
    ...item,
    hasImage: Boolean(item.hasImage),
    imageUrl: item.hasImage
      ? `${apiBase}/lost-found/${encodeURIComponent(item.id)}/image`
      : null,
  };
}

function attachAdminImageUrl(item: LostFoundAdminItem, apiBase: string): LostFoundAdminItem {
  return {
    ...item,
    hasImage: Boolean(item.hasImage),
    imageUrl: item.hasImage
      ? `${apiBase}/admin/lost-found/${encodeURIComponent(item.id)}/image`
      : null,
  };
}
