/**
 * E.A.S.E. Authentication & Session Service
 * 
 * Manages demo student & administrator sessions using browser sessionStorage.
 * Prepares the frontend contract for future Java Spring Boot Spring Security / JWT endpoints.
 */

export type UserRole = 'student' | 'staff' | 'admin';

export interface AuthUser {
  identifier: string;
  role: UserRole;
  name: string;
  department: string;
  email: string;
  loggedInAt: string;
}

export interface DemoAccount {
  identifier: string;
  alternateIdentifier: string;
  password: string;
  name: string;
  department: string;
  email: string;
  role: UserRole;
  notes: string;
}

export const DEMO_STUDENT_ACCOUNTS: DemoAccount[] = [];

export const DEMO_STAFF_ACCOUNTS: DemoAccount[] = [
  {
    identifier: 'EEC-FAC-1042',
    alternateIdentifier: 'faculty@easwari.ac.in',
    password: 'staff123',
    name: 'Dr. K. Ramanathan',
    department: 'Computer Science and Engineering (CSE)',
    email: 'faculty@easwari.ac.in',
    role: 'staff',
    notes: 'Staff Event Coordinator & Faculty Advisor',
  },
  {
    identifier: 'EEC-STAFF-208',
    alternateIdentifier: 'staff@easwari.ac.in',
    password: 'staff123',
    name: 'Prof. M. Malini',
    department: 'Information Technology (IT)',
    email: 'staff@easwari.ac.in',
    role: 'staff',
    notes: 'Assistant Professor & Hackathon Faculty Lead',
  },
];

export const DEMO_ADMIN_ACCOUNTS: DemoAccount[] = [
  {
    identifier: 'EEC-DEAN-001',
    alternateIdentifier: 'dean@easwari.ac.in',
    password: 'admin123',
    name: 'Dr. S. Balamurugan',
    department: 'Deanery of Student Affairs & Academic Oversight',
    email: 'dean@easwari.ac.in',
    role: 'admin',
    notes: 'Authorized Approver for College Events & Dispatches',
  },
  {
    identifier: 'EEC-ADMIN-001',
    alternateIdentifier: 'admin@easwari.ac.in',
    password: 'admin123',
    name: 'Central IT & COE Administration',
    department: 'Office of the Controller of Examinations',
    email: 'admin@easwari.ac.in',
    role: 'admin',
    notes: 'Publisher for Academic Circulars & End-Sem Notices',
  },
];

const SESSION_KEY = 'ease_campus_auth_session';

export const authService = {
  /**
   * Retrieves current active user session from sessionStorage.
   * Returns null if unauthenticated or running in an SSR/test environment without storage.
   */
  getSession(): AuthUser | null {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        return null;
      }
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch (err) {
      console.error('[authService] Error reading auth session from sessionStorage:', err);
      return null;
    }
  },

  /**
   * Saves user session into sessionStorage.
   */
  setSession(user: AuthUser): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    } catch (err) {
      console.error('[authService] Error saving auth session to sessionStorage:', err);
    }
  },

  /**
   * Clears user session from sessionStorage (logout).
   */
  clearSession(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(SESSION_KEY);
      }
    } catch (err) {
      console.error('[authService] Error clearing auth session from sessionStorage:', err);
    }
  },

  /**
   * Validates student demo credentials.
   * Rejects invalid or unregistered credentials with a clear error message.
   */
  loginStudent(_identifier: string, _password: string): { success: boolean; user?: AuthUser; error?: string } {
    return { success: false, error: 'Student sign-in requires the E.A.S.E. backend. Please configure VITE_API_BASE_URL and register an account.' };
  },

  /**
   * Validates admin demo credentials.
   * Rejects unauthorized or invalid faculty credentials.
   */
  loginAdmin(
    identifier: string,
    password: string
  ): { success: boolean; user?: AuthUser; error?: string } {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    const matchedAccount = DEMO_ADMIN_ACCOUNTS.find(
      (acc) =>
        acc.identifier.toLowerCase() === trimmedId ||
        acc.alternateIdentifier.toLowerCase() === trimmedId
    );

    if (!matchedAccount) {
      return {
        success: false,
        error:
          'Administrator account not recognized. Please provide an authorized Employee ID or Official Faculty Email from the demo roster below.',
      };
    }

    // Allow account password or standard fallback demo password
    if (matchedAccount.password !== trimmedPass && trimmedPass !== 'easwari@admin') {
      return {
        success: false,
        error:
          'Incorrect administrative password. Please enter the valid security password (admin123) displayed in the demo clearance panel.',
      };
    }

    const user: AuthUser = {
      identifier: matchedAccount.identifier,
      email: matchedAccount.email,
      name: matchedAccount.name,
      department: matchedAccount.department,
      role: 'admin',
      loggedInAt: new Date().toISOString(),
    };

    this.setSession(user);
    return { success: true, user };
  },

  /**
   * Validates staff demo credentials.
   * Authenticates faculty coordinators and departmental event managers.
   */
  loginStaff(
    identifier: string,
    password: string
  ): { success: boolean; user?: AuthUser; error?: string } {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    const matchedAccount = DEMO_STAFF_ACCOUNTS.find(
      (acc) =>
        acc.identifier.toLowerCase() === trimmedId ||
        acc.alternateIdentifier.toLowerCase() === trimmedId
    );

    if (!matchedAccount) {
      return {
        success: false,
        error:
          'Staff account not recognized. Please provide an authorized Faculty Coordinator ID or Email from the demo roster.',
      };
    }

    if (matchedAccount.password !== trimmedPass && trimmedPass !== 'easwari@staff') {
      return {
        success: false,
        error:
          'Incorrect staff password. Please enter the valid credentials password (staff123) displayed in the demo clearance panel.',
      };
    }

    const user: AuthUser = {
      identifier: matchedAccount.identifier,
      email: matchedAccount.email,
      name: matchedAccount.name,
      department: matchedAccount.department,
      role: 'staff',
      loggedInAt: new Date().toISOString(),
    };

    this.setSession(user);
    return { success: true, user };
  },

  /**
   * Unified official login (Staff or Admin) used by the Admin/Staff login page.
   * Matches against Staff and Admin rosters and assigns the exact role from the account record.
   */
  loginOfficial(
    identifier: string,
    password: string
  ): { success: boolean; user?: AuthUser; error?: string } {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Check Admin roster first
    const adminMatch = DEMO_ADMIN_ACCOUNTS.find(
      (acc) =>
        acc.identifier.toLowerCase() === trimmedId ||
        acc.alternateIdentifier.toLowerCase() === trimmedId
    );

    if (adminMatch) {
      if (adminMatch.password !== trimmedPass && trimmedPass !== 'easwari@admin') {
        return {
          success: false,
          error:
            'Incorrect administrative password. Please enter the valid security password (admin123).',
        };
      }
      const user: AuthUser = {
        identifier: adminMatch.identifier,
        email: adminMatch.email,
        name: adminMatch.name,
        department: adminMatch.department,
        role: 'admin',
        loggedInAt: new Date().toISOString(),
      };
      this.setSession(user);
      return { success: true, user };
    }

    // Check Staff roster
    const staffMatch = DEMO_STAFF_ACCOUNTS.find(
      (acc) =>
        acc.identifier.toLowerCase() === trimmedId ||
        acc.alternateIdentifier.toLowerCase() === trimmedId
    );

    if (staffMatch) {
      if (staffMatch.password !== trimmedPass && trimmedPass !== 'easwari@staff') {
        return {
          success: false,
          error:
            'Incorrect staff password. Please enter the valid credentials password (staff123).',
        };
      }
      const user: AuthUser = {
        identifier: staffMatch.identifier,
        email: staffMatch.email,
        name: staffMatch.name,
        department: staffMatch.department,
        role: 'staff',
        loggedInAt: new Date().toISOString(),
      };
      this.setSession(user);
      return { success: true, user };
    }

    return {
      success: false,
      error:
        'Official account not recognized. Please provide an authorized Employee ID or Official Faculty Email from the demo roster.',
    };
  },

  getDemoStaffAccounts(): DemoAccount[] {
    return DEMO_STAFF_ACCOUNTS;
  },

  getDemoAdminAccounts(): DemoAccount[] {
    return DEMO_ADMIN_ACCOUNTS;
  },
};
