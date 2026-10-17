export type AnnouncementCategory =
  | 'Academic'
  | 'Event Deadlines'
  | 'Workshops'
  | 'Club Recruitment'
  | 'Schedule Changes'
  | 'Venue Changes'
  | 'General Notices'
  | 'Emergency & Advisory';

export type AnnouncementPriority = 'Urgent' | 'Important' | 'Normal';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  publishDate: string; // ISO date 'YYYY-MM-DD'
  priority: AnnouncementPriority;
  relatedEventId?: string;
  publicationStatus: 'Published' | 'Archived' | 'Draft';
  issuer: string; // e.g. 'Office of Controller of Examinations'
  referenceNumber?: string;
  actionUrl?: string;
  actionText?: string;
  attachmentName?: string;
  rotation?: number;
  pinType?: 'brass' | 'red' | 'navy' | 'green';
  isStampVerified?: boolean;
}
