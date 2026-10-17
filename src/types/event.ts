export type EventCategory =
  | 'Hackathon'
  | 'Workshop'
  | 'Technical Competition'
  | 'Cultural Event'
  | 'Club Activity'
  | 'Academic'
  | 'Seminar'
  | 'Other';

export type RegistrationStatus =
  | 'Open'
  | 'Closing Soon'
  | 'Closed'
  | 'Not Yet Open'
  | 'Link Unavailable';

export type PublicationStatus =
  | 'Draft'
  | 'Pending'
  | 'Approved'
  | 'Rejected';

export interface PostItNote {
  title: string;
  text: string;
  type?: 'warning' | 'info' | 'highlight';
}

export interface EventItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string; // ISO date 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm'
  startTime: string; // e.g. '09:00 AM'
  endDate: string;
  endTime: string;
  venue: string;
  department: string;
  organizingClub: string;
  facultyCoordinator: string;
  facultyCoordinatorEmpId?: string;
  coordinatorContact?: string;
  eligibility: string;
  registrationDeadline: string;
  registrationUrl?: string;
  registrationStatus: RegistrationStatus;
  posterImage?: string;
  createdAt: string;
  updatedAt: string;
  publicationStatus: PublicationStatus;

  // Notice board styling & metadata
  isHero?: boolean;
  colSpan?: number; // 4, 5, 7, 8, 12 in 12-col grid
  rotation?: number; // degree e.g. -1.2, 0.8
  pinType?: 'brass' | 'red' | 'navy' | 'green' | 'double-brass';
  hasTape?: boolean;
  hasClip?: boolean;
  isCircularLetterhead?: boolean;
  prizes?: string;
  teamSize?: string;
  tags?: string[];
  postIt?: PostItNote;
  speaker?: {
    name: string;
    role: string;
    avatar?: string;
    batch?: string;
  };
  rejectionReason?: string;
}

export type EventSortOption =
  | 'urgency'
  | 'recently-added'
  | 'deadline'
  | 'title';

export interface EventFilterState {
  searchQuery: string;
  category: string; // 'all' or EventCategory
  department: string; // 'all' or specific
  club: string; // 'all' or specific
  registrationStatus: string; // 'all' or RegistrationStatus
  dateRange: 'all' | 'today' | 'this-week' | 'this-month' | 'upcoming';
  sortBy: EventSortOption;
}
