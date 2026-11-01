export type LostFoundReportType = 'LOST' | 'FOUND';

export type LostFoundPublicationStatus = 'Pending' | 'Approved' | 'Rejected';

/**
 * Public Lost & Found item returned by GET /api/lost-found.
 * Stripped of reporter contact details to protect student privacy.
 */
export interface LostFoundPublicItem {
  id: string;
  itemName: string;
  description: string;
  reportType: LostFoundReportType;
  location: string;
  createdAt: string; // ISO-8601 instant string
  hasImage?: boolean;
  /** Server-backed URL for approved public photos. Never a blob: URL. */
  imageUrl?: string | null;
}

/**
 * Payload sent to POST /api/lost-found.
 * Contact fields are required by backend for administrative verification.
 */
export interface LostFoundSubmissionInput {
  itemName: string;
  description: string;
  reportType: LostFoundReportType;
  location: string;
  contactName: string;
  contactEmail: string;
}

/**
 * Administrative Lost & Found item returned by GET /api/admin/lost-found.
 * Contains contact information and review audit status.
 */
export interface LostFoundAdminItem {
  id: string;
  itemName: string;
  description: string;
  reportType: LostFoundReportType;
  location: string;
  contactName: string;
  contactEmail: string;
  publicationStatus: LostFoundPublicationStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  hasImage?: boolean;
  imageOriginalName?: string | null;
  /** Admin-only image endpoint. Loaded with Authorization, never stored as blob: permanently. */
  imageUrl?: string | null;
}

export interface LostFoundStatusRequest {
  status: 'Approved' | 'Rejected';
  rejectionReason?: string;
}

export interface LostFoundSubmissionResult {
  success: boolean;
  item: LostFoundPublicItem;
  message: string;
}
