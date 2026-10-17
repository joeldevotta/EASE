/**
 * odService.ts
 * Centralised OD Application data layer.
 * All reads/writes go through this module so both the Student Portal
 * and the Staff Review Desk see the same localStorage array.
 *
 * NOTE (Frontend-Only Demo): Because this is a client-side demo, all OD
 * requests on this device are shared via localStorage. In a real deployment
 * each request would be persisted server-side and filtered per department.
 */

import { storageService } from './storageService';

export type OdStatus = 'Pending Faculty Review' | 'HOD Endorsement' | 'Approved' | 'Rejected';

export interface OdApplication {
  id: string;
  /** Student who submitted the request */
  studentName: string;
  registerNumber: string;
  department: string;
  /** Event details */
  eventTitle: string;
  category: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  facultyAdvisor: string;
  purpose: string;
  /** Workflow */
  status: OdStatus;
  appliedAt: string;
  /** Legacy fields kept for backward-compat */
  approvedBy?: string;
  remarks?: string;
  /** Staff review fields (new) */
  staffComment?: string;
  reviewedBy?: string;   // staff identifier / name
  reviewedAt?: string;   // ISO timestamp
}

const STORAGE_KEY = 'ease_campus_od_applications';

// ---------------------------------------------------------------------------
// Seed / demo data (shown until user submits real requests)
// ---------------------------------------------------------------------------
const INITIAL_DEMO: OdApplication[] = [
  {
    id: 'EEC-OD-2025-0142',
    studentName: 'Aravind S (CSE - Final Year)',
    registerNumber: '310621104001',
    department: 'Computer Science and Engineering (CSE)',
    eventTitle: 'HACK EASWARI 2025 (36-Hour Flagship Hackathon)',
    category: 'Technical Hackathon',
    startDate: '2025-03-28',
    endDate: '2025-03-29',
    daysCount: 2,
    facultyAdvisor: 'Dr. K. S. Anand (HOD, CSE)',
    purpose: 'Lead Organizer & Student Technical Lead for Autonomous Hackathon Systems.',
    status: 'Approved',
    appliedAt: '2025-03-12T10:30:00Z',
    approvedBy: 'Dr. K. Ramanathan (Dean of Student Affairs)',
    remarks: 'Attendance synced with Autonomous ERP Examination Cell.',
    staffComment: 'Excellent initiative. Approved with full attendance credit.',
    reviewedBy: 'EEC-FAC-1042',
    reviewedAt: '2025-03-13T09:00:00Z',
  },
  {
    id: 'EEC-OD-2025-0188',
    studentName: 'Priya K (ECE - 3rd Year)',
    registerNumber: '310622106042',
    department: 'Electronics & Communication Engineering (ECE)',
    eventTitle: 'National Level Paper Presentation (ELECTROFEST)',
    category: 'Symposium / Conference',
    startDate: '2025-03-19',
    endDate: '2025-03-19',
    daysCount: 1,
    facultyAdvisor: 'Dr. S. Nagarajan, Ph.D.',
    purpose: 'Presenting research paper on Edge AI microcontrollers in TRP Auditorium.',
    status: 'Pending Faculty Review',
    appliedAt: '2025-03-14T14:15:00Z',
    remarks: 'Awaiting Faculty Advisor recommendation review.',
  },
];

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------
export const odService = {
  /** Return all OD applications (shared across students on this device). */
  getAllApplications(): OdApplication[] {
    return storageService.get<OdApplication[]>(STORAGE_KEY, INITIAL_DEMO);
  },

  /**
   * Return only OD applications submitted by a specific student.
   * Matches on registerNumber (primary) or studentName (fallback).
   */
  getStudentApplications(identifier: string): OdApplication[] {
    if (!identifier) return [];
    const all = odService.getAllApplications();
    return all.filter(
      (app) =>
        app.registerNumber === identifier ||
        app.studentName?.toLowerCase().includes(identifier.toLowerCase())
    );
  },

  /**
   * Submit a new OD application.
   * Returns the saved application.
   */
  submitApplication(data: Omit<OdApplication, 'id' | 'appliedAt' | 'status'>): OdApplication {
    const all = odService.getAllApplications();
    const newApp: OdApplication = {
      ...data,
      id: `EEC-OD-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending Faculty Review',
      appliedAt: new Date().toISOString(),
    };
    const updated = [newApp, ...all];
    storageService.set(STORAGE_KEY, updated);
    return newApp;
  },

  /**
   * Staff approves or rejects an OD application.
   * Updates status, staffComment, reviewedBy, and reviewedAt in-place.
   */
  updateApplicationStatus(
    id: string,
    status: 'Approved' | 'Rejected',
    staffComment: string,
    reviewedBy: string
  ): boolean {
    const all = odService.getAllApplications();
    const index = all.findIndex((app) => app.id === id);
    if (index === -1) return false;

    all[index] = {
      ...all[index],
      status,
      staffComment: staffComment.trim() || undefined,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      // Keep legacy approvedBy field in sync for Approved state
      approvedBy: status === 'Approved' ? reviewedBy : all[index].approvedBy,
    };

    return storageService.set(STORAGE_KEY, all);
  },

  /**
   * Clear all OD data and reset to initial demo data.
   * Used by tests only.
   */
  resetToDemo(): void {
    storageService.set(STORAGE_KEY, INITIAL_DEMO);
  },
};
