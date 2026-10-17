export type ClubCategory =
  | 'Technical'
  | 'Cultural'
  | 'Social & Service'
  | 'Literary & Media'
  | 'Sports & Adventure'
  | 'Innovation'
  | 'Entrepreneurship';

export type RecruitmentStatus =
  | 'Open'
  | 'Closed'
  | 'Opening Soon'
  | 'Not Announced';

export interface ClubWing {
  title: string;
  description: string;
  icon?: string;
}

export interface ClubItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ClubCategory;
  logo?: string;
  facultyCoordinator: string;
  coordinatorContact?: string;
  studentLead?: string;
  studentContact?: string;
  currentActivities: string[];
  wings?: ClubWing[];
  recruitmentStatus: RecruitmentStatus;
  auditionDates?: string;
  auditionVenue?: string;
  applicationDeadline?: string;
  applicationUrl?: string;
  socialHandle?: string;
  memberCount?: number;
  rotation?: number;
  pinType?: 'brass' | 'red' | 'navy' | 'green';
  hasTape?: boolean;
}
