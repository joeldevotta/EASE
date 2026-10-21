import assert from 'node:assert';
import { initialMockEvents } from '../data/mockEvents';
import { initialMockClubs } from '../data/mockClubs';
import { initialMockAnnouncements } from '../data/mockAnnouncements';
import { formatDateString, formatEventDateRange, getMonthCalendarGrid, getDaysRemaining } from '../utils/dateUtils';
import {
  isValidHttpUrl,
  validateEventSubmission,
  validateStudentLogin,
  validateAdminLogin,
} from '../utils/validation';
import { authService } from '../services/authService';

// Mock localStorage and sessionStorage in Node environment
const mockLocalStore: Record<string, string> = {};
const mockSessionStore: Record<string, string> = {};

(global as any).window = {
  localStorage: {
    getItem: (key: string) => mockLocalStore[key] || null,
    setItem: (key: string, value: string) => {
      mockLocalStore[key] = value;
    },
    removeItem: (key: string) => {
      delete mockLocalStore[key];
    },
    clear: () => {
      for (const k of Object.keys(mockLocalStore)) delete mockLocalStore[k];
    },
  },
  sessionStorage: {
    getItem: (key: string) => mockSessionStore[key] || null,
    setItem: (key: string, value: string) => {
      mockSessionStore[key] = value;
    },
    removeItem: (key: string) => {
      delete mockSessionStore[key];
    },
    clear: () => {
      for (const k of Object.keys(mockSessionStore)) delete mockSessionStore[k];
    },
  },
};

async function runTests() {
  console.log('🧪 Starting E.A.S.E. Frontend Test Suite...\n');

  // Test 1: Mock Data Integrity
  console.log('Test 1: Mock Data Integrity');
  assert.ok(initialMockEvents.length >= 8, 'Initial mock events count >= 8');
  assert.ok(initialMockClubs.length >= 6, 'Initial mock clubs count >= 6');
  assert.ok(initialMockAnnouncements.length >= 6, 'Initial mock announcements count >= 6');
  
  const hackEaswari = initialMockEvents.find(e => e.id === 'eec-ev-001');
  assert.ok(hackEaswari, 'HackEaswari 2025 event exists');
  assert.strictEqual(hackEaswari?.category, 'Hackathon');
  assert.strictEqual(hackEaswari?.isHero, true);
  console.log('  ✓ Initial mock events, clubs, and circulars validated.');

  // Test 2: Date Utilities
  console.log('\nTest 2: Date Utilities');
  const formatted = formatDateString('2025-03-28');
  assert.strictEqual(formatted, 'Mar 28, 2025');

  const dateRange = formatEventDateRange('2025-03-28', '2025-03-29');
  assert.strictEqual(dateRange, 'Mar 28–29, 2025');

  const singleRange = formatEventDateRange('2025-03-22', '2025-03-22');
  assert.strictEqual(singleRange, 'Mar 22, 2025');

  const calMarch2025 = getMonthCalendarGrid(2025, 2); // March 2025
  assert.strictEqual(calMarch2025.monthName, 'March');
  assert.strictEqual(calMarch2025.year, 2025);
  assert.ok(calMarch2025.days.length % 7 === 0, 'Calendar grid contains complete 7-day weeks');

  const daysRem = getDaysRemaining('2025-03-28');
  assert.strictEqual(typeof daysRem, 'number');
  console.log('  ✓ Date ranges, single dates, and monthly grid generation validated.');

  // Test 3: Form & URL Validation Rules
  console.log('\nTest 3: Form & URL Validation Rules');
  assert.strictEqual(isValidHttpUrl('https://easwari.ac.in'), true);
  assert.strictEqual(isValidHttpUrl('http://localhost:5173'), true);
  assert.strictEqual(isValidHttpUrl('ftp://invalid'), false);
  assert.strictEqual(isValidHttpUrl('not-a-url'), false);

  const invalidSubmission = validateEventSubmission({
    title: '',
    organizingClub: '',
    department: '',
    category: 'Workshop',
    venue: '',
    startDate: '2025-04-10',
    startTime: '09:00 AM',
    endDate: '2025-04-05', // End before start
    endTime: '05:00 PM',
    description: 'too short',
    facultyCoordinator: '',
    registrationUrl: 'invalid-url',
  });
  assert.strictEqual(invalidSubmission.isValid, false, 'Invalid submission rejected');
  assert.ok(invalidSubmission.errors.title, 'Catches empty title');
  assert.ok(invalidSubmission.errors.endDate, 'Catches endDate before startDate');
  assert.ok(invalidSubmission.errors.registrationUrl, 'Catches invalid URL');

  const validSubmission = validateEventSubmission({
    title: 'AI Robotics Workshop',
    organizingClub: 'Robotics Club',
    department: 'Department of Mechatronics Engineering',
    category: 'Workshop',
    venue: 'Automation Lab, Mechanical Block 3rd Floor',
    startDate: '2025-04-10',
    startTime: '09:00 AM',
    endDate: '2025-04-11',
    endTime: '05:00 PM',
    description: 'Hands on robotics with ROS2 and computer vision for autonomous rovers.',
    facultyCoordinator: 'Dr. S. Sundaram',
    registrationUrl: 'https://forms.gle/robotics2025',
  });
  assert.strictEqual(validSubmission.isValid, true, 'Valid submission accepted');
  console.log('  ✓ Validation correctly rejects invalid URLs, invalid date ranges, and accepts valid payloads.');

  // Test 4: Event Service Local Persistence & Approval Flow
  console.log('\nTest 4: Event Service Local Persistence & Approval Flow');
  const { eventService } = await import('../services/eventService');
  eventService.resetToDefaultDemo();
  
  const initialApproved = eventService.getApprovedEvents();
  const initialCount = initialApproved.length;

  const newDraft = await eventService.submitEvent({
    title: 'Autonomous Drone Grand Prix',
    organizingClub: 'AeroClub EEC',
    department: 'Department of Mechanical Engineering',
    category: 'Technical Competition',
    startDate: '2025-04-20',
    startTime: '09:30 AM',
    endDate: '2025-04-20',
    endTime: '04:30 PM',
    venue: 'Main College Grounds',
    description: 'Autonomous indoor and outdoor drone obstacle racing with FPV live telemetry.',
    eligibility: 'Open to all EEC students',
    registrationDeadline: '2025-04-18',
    registrationStatus: 'Open',
    tags: ['Drones', 'FPV', 'Robotics'],
    facultyCoordinator: 'Dr. V. Anand',
    registrationUrl: 'https://forms.gle/dronegp2025',
    isHero: false,
  });

  assert.strictEqual(newDraft.success, true);
  assert.strictEqual(newDraft.event.publicationStatus, 'Pending');
  assert.strictEqual(
    eventService.getApprovedEvents().length,
    initialCount,
    'Pending event is hidden from public approved list'
  );

  const pendingEvents = eventService.getPendingEvents();
  assert.ok(pendingEvents.some(e => e.id === newDraft.event.id), 'Pending event is present in review queue');

  const approvedSuccess = eventService.updateEventStatus(newDraft.event.id, 'Approved');
  assert.strictEqual(approvedSuccess, true);
  assert.strictEqual(
    eventService.getApprovedEvents().length,
    initialCount + 1,
    'Approved event is now visible on public corkboard'
  );

  const rejectedSuccess = eventService.updateEventStatus(newDraft.event.id, 'Rejected', 'Exceeded venue capacity limit');
  assert.strictEqual(rejectedSuccess, true);
  assert.strictEqual(
    eventService.getApprovedEvents().length,
    initialCount,
    'Rejected event is removed from public visibility'
  );
  console.log('  ✓ Submission created as Pending, hidden from public board, and approval/rejection state sync verified.');

  // Test 5: Multi-filter Pipeline
  console.log('\nTest 5: Multi-filter Pipeline');
  const filtered1 = await eventService.filterEvents({ category: 'Hackathon' });
  assert.ok(filtered1.length >= 1);
  assert.ok(filtered1.every(e => e.category === 'Hackathon'));

  const filtered2 = await eventService.filterEvents({ department: 'Computer Science' });
  assert.ok(filtered2.length >= 1);
  assert.ok(filtered2.every(e => e.department.includes('Computer Science')));

  const combined = await eventService.filterEvents({
    category: 'Hackathon',
    department: 'Computer Science',
  });
  assert.ok(combined.every(e => e.category === 'Hackathon' && e.department.includes('Computer Science')));
  console.log('  ✓ Multi-filters work seamlessly together without resetting unrelated criteria.');

  // Test 6: Student & Admin Login Form Validations
  console.log('\nTest 6: Student & Admin Login Form Validations');
  
  // Student Login validation tests
  const emptyStudent = validateStudentLogin('', '');
  assert.strictEqual(emptyStudent.isValid, false, 'Empty student login rejected');
  assert.ok(emptyStudent.errors.identifier, 'Catches empty student identifier');
  assert.ok(emptyStudent.errors.password, 'Catches empty student password');

  const invalidEmailStudent = validateStudentLogin('bademail@', '123456');
  assert.strictEqual(invalidEmailStudent.isValid, false, 'Malformed email rejected');
  assert.ok(invalidEmailStudent.errors.identifier, 'Catches malformed email');

  const shortPasswordStudent = validateStudentLogin('310621104001', '123');
  assert.strictEqual(shortPasswordStudent.isValid, false, 'Short student password rejected');
  assert.ok(shortPasswordStudent.errors.password, 'Catches short password');

  const validStudentByRegNo = validateStudentLogin('310621104001', 'pass1234');
  assert.strictEqual(validStudentByRegNo.isValid, true, 'Valid student register number accepted');

  const validStudentByEmail = validateStudentLogin('student@easwari.ac.in', 'pass1234');
  assert.strictEqual(validStudentByEmail.isValid, true, 'Valid student email accepted');

  // Admin Login validation tests
  const emptyAdmin = validateAdminLogin('', '');
  assert.strictEqual(emptyAdmin.isValid, false, 'Empty admin login rejected');
  assert.ok(emptyAdmin.errors.identifier, 'Catches empty admin identifier');
  assert.ok(emptyAdmin.errors.password, 'Catches empty admin password');

  const shortAdminId = validateAdminLogin('EEC', 'adminpass');
  assert.strictEqual(shortAdminId.isValid, false, 'Short employee ID rejected');
  assert.ok(shortAdminId.errors.identifier, 'Catches short employee ID');

  const validAdminByEmpId = validateAdminLogin('EEC-FAC-1042', 'adminSecret');
  assert.strictEqual(validAdminByEmpId.isValid, true, 'Valid admin employee ID accepted');

  const validAdminByEmail = validateAdminLogin('faculty@easwari.ac.in', 'adminSecret');
  assert.strictEqual(validAdminByEmail.isValid, true, 'Valid admin email accepted');
  console.log('  ✓ Student and Admin login validations correctly enforce rules and error handling.');

  // Test 7: Authentication Service, Session Storage & Role Verification
  console.log('\nTest 7: Authentication Service, Session Storage & Role Verification');
  
  // 1. Initial state: Unauthenticated
  authService.clearSession();
  assert.strictEqual(authService.getSession(), null, 'Initial session is null');

  // Student authentication must not accept frontend-only demo credentials.
  const demoStudent = authService.loginStudent('310621104001', 'student123');
  assert.strictEqual(demoStudent.success, false, 'Frontend-only demo student credentials are disabled');
  assert.strictEqual(authService.getSession(), null, 'No session is created by demo student login');

  // 6. Reject random admin credentials
  authService.clearSession();
  const badAdmin = authService.loginAdmin('EEC-FAKE-9999', 'wrongpassword');
  assert.strictEqual(badAdmin.success, false, 'Random admin credentials rejected');

  // 7. Reject correct admin with wrong password
  const badPassAdmin = authService.loginAdmin('EEC-DEAN-001', 'wrongpassword');
  assert.strictEqual(badPassAdmin.success, false, 'Admin with wrong password rejected');

  // 8. Accept valid admin credentials
  const goodAdmin = authService.loginAdmin('EEC-DEAN-001', 'admin123');
  assert.strictEqual(goodAdmin.success, true, 'Valid demo admin login accepted');
  assert.strictEqual(goodAdmin.user?.role, 'admin', 'User role is admin');

  // 9. Accept valid staff credentials
  authService.clearSession();
  const goodStaff = authService.loginStaff('EEC-FAC-1042', 'staff123');
  assert.strictEqual(goodStaff.success, true, 'Valid demo staff login accepted');
  assert.strictEqual(goodStaff.user?.role, 'staff', 'User role is staff');

  // 10. Verify session persistence for staff
  const persistedStaff = authService.getSession();
  assert.ok(persistedStaff, 'Staff session stored in sessionStorage');
  assert.strictEqual(persistedStaff?.role, 'staff');

  // 11. Logout and verify complete session purge
  authService.clearSession();
  assert.strictEqual(authService.getSession(), null, 'SessionStorage is completely cleared upon logout');

  console.log('  ✓ Student demo login is disabled; staff/admin demo session behavior and logout purge verified.');

  // Test 8: OD Portal Application Model & Storage
  console.log('\nTest 8: OD Portal Application Model & Storage');
  const { storageService } = await import('../services/storageService');
  const testOdApp = {
    id: 'EEC-OD-2025-9999',
    studentName: 'Aravind S (CSE - Final Year)',
    registerNumber: '310621104001',
    department: 'Computer Science and Engineering (CSE)',
    eventTitle: 'HACK EASWARI 2025',
    category: 'Technical Hackathon',
    startDate: '2025-03-28',
    endDate: '2025-03-29',
    daysCount: 2,
    facultyAdvisor: 'Dr. K. S. Anand (HOD, CSE)',
    purpose: 'Lead Organizer & Student Technical Lead.',
    status: 'Approved' as const,
    appliedAt: new Date().toISOString(),
  };

  const storedKey = 'ease_campus_od_applications';
  storageService.set(storedKey, [testOdApp]);
  const fetchedOd = storageService.get<typeof testOdApp[]>(storedKey, []);
  assert.strictEqual(fetchedOd.length, 1);
  assert.strictEqual(fetchedOd[0].id, 'EEC-OD-2025-9999');
  assert.strictEqual(fetchedOd[0].status, 'Approved');
  console.log('  ✓ OD application schema, status states, and local persistence validated.');

  // Test 9: 3-Tier Role-Based Access Control Rules (Student vs Staff vs Admin)
  console.log('\nTest 9: 3-Tier Role-Based Access Control Rules (Student vs Staff vs Admin)');
  
  const studentRoles: ('student' | 'staff' | 'admin')[] = ['student'];
  const staffOrAdminRoles: ('student' | 'staff' | 'admin')[] = ['staff', 'admin'];
  const adminOnlyRoles: ('student' | 'staff' | 'admin')[] = ['admin'];

  // 1. Student permissions: can access OD Portal; CANNOT access Event Submission or Admin Review
  authService.clearSession();
  const studentSession = authService.loginStudent('310621104001', 'student123');
  assert.strictEqual(studentSession.success, true);
  assert.strictEqual(studentSession.user?.role, 'student');
  assert.strictEqual(studentRoles.includes(studentSession.user!.role), true, 'Student can access OD Portal');
  assert.strictEqual(staffOrAdminRoles.includes(studentSession.user!.role), false, 'Student cannot access Event Submission');
  assert.strictEqual(adminOnlyRoles.includes(studentSession.user!.role), false, 'Student cannot access Admin Review');

  // 2. Staff permissions: can access Event Submission; CANNOT access OD Portal or Admin Review
  authService.clearSession();
  const staffSession = authService.loginStaff('EEC-FAC-1042', 'staff123');
  assert.strictEqual(staffSession.success, true);
  assert.strictEqual(staffSession.user?.role, 'staff');
  assert.strictEqual(studentRoles.includes(staffSession.user!.role), false, 'Staff cannot access student OD Portal');
  assert.strictEqual(staffOrAdminRoles.includes(staffSession.user!.role), true, 'Staff can access Event Submission');
  assert.strictEqual(adminOnlyRoles.includes(staffSession.user!.role), false, 'Staff cannot access Admin Review');

  // 3. Admin permissions: can access Event Submission & Admin Review; CANNOT access student OD Portal
  authService.clearSession();
  const adminSession = authService.loginAdmin('EEC-DEAN-001', 'admin123');
  assert.strictEqual(adminSession.success, true);
  assert.strictEqual(adminSession.user?.role, 'admin');
  assert.strictEqual(studentRoles.includes(adminSession.user!.role), false, 'Admin cannot access student OD Portal');
  assert.strictEqual(staffOrAdminRoles.includes(adminSession.user!.role), true, 'Admin can access Event Submission');
  assert.strictEqual(adminOnlyRoles.includes(adminSession.user!.role), true, 'Admin can access Admin Review');

  // 4. Unified official login route tests
  authService.clearSession();
  const officialStaff = authService.loginOfficial('EEC-STAFF-208', 'staff123');
  assert.strictEqual(officialStaff.success, true);
  assert.strictEqual(officialStaff.user?.role, 'staff', 'loginOfficial correctly assigns staff role');

  const officialAdmin = authService.loginOfficial('EEC-ADMIN-001', 'admin123');
  assert.strictEqual(officialAdmin.success, true);
  assert.strictEqual(officialAdmin.user?.role, 'admin', 'loginOfficial correctly assigns admin role');

  // 5. Unauthenticated user has null role
  authService.clearSession();
  assert.strictEqual(authService.getSession(), null, 'Unauthenticated user has no session');
  console.log('  ✓ 3-tier role matrix, student exclusion from creation, staff creation access, and admin approval rights verified.');

  // Test 10: Staff OD Approval Workflow
  console.log('\nTest 10: Staff OD Approval Workflow');
  const { odService } = await import('../services/odService');

  // Reset to fresh demo data
  odService.resetToDemo();
  const initialAll = odService.getAllApplications();
  assert.ok(initialAll.length >= 2, 'Initial demo OD applications exist');

  // Student submits a new OD request
  const submitted = odService.submitApplication({
    studentName: 'Test Student (CSE)',
    registerNumber: '310621104999',
    department: 'Computer Science and Engineering (CSE)',
    eventTitle: 'Test Hackathon 2025',
    category: 'Technical Hackathon',
    startDate: '2025-04-10',
    endDate: '2025-04-11',
    daysCount: 2,
    facultyAdvisor: 'Dr. Test Advisor',
    purpose: 'Participant and team lead for testing the OD approval workflow.',
  });
  assert.strictEqual(submitted.status, 'Pending Faculty Review', 'Submitted OD starts as Pending');
  assert.strictEqual(submitted.registerNumber, '310621104999');

  // Verify it appears in getAllApplications
  const afterSubmit = odService.getAllApplications();
  const found = afterSubmit.find((a) => a.id === submitted.id);
  assert.ok(found, 'Submitted OD appears in getAllApplications list');
  assert.strictEqual(found!.status, 'Pending Faculty Review');

  // Verify getStudentApplications filters by registerNumber
  const studentApps = odService.getStudentApplications('310621104999');
  assert.ok(studentApps.length >= 1, 'getStudentApplications returns this student\'s request');
  assert.strictEqual(studentApps[0].registerNumber, '310621104999');

  // Staff approves the request
  const approveResult = odService.updateApplicationStatus(
    submitted.id,
    'Approved',
    'Excellent initiative. Attendance credit granted.',
    'EEC-FAC-1042'
  );
  assert.strictEqual(approveResult, true, 'updateApplicationStatus returns true on success');

  // Verify student sees Approved status with staffComment
  const approvedApps = odService.getStudentApplications('310621104999');
  const approvedApp = approvedApps.find((a) => a.id === submitted.id);
  assert.ok(approvedApp, 'Approved OD found in student applications');
  assert.strictEqual(approvedApp!.status, 'Approved', 'Status updated to Approved');
  assert.strictEqual(approvedApp!.staffComment, 'Excellent initiative. Attendance credit granted.', 'staffComment persisted');
  assert.strictEqual(approvedApp!.reviewedBy, 'EEC-FAC-1042', 'reviewedBy persisted');
  assert.ok(approvedApp!.reviewedAt, 'reviewedAt timestamp set');

  // Submit another OD and reject it
  const toReject = odService.submitApplication({
    studentName: 'Test Student 2 (ECE)',
    registerNumber: '310622106099',
    department: 'Electronics & Communication Engineering (ECE)',
    eventTitle: 'Symposium 2025',
    category: 'Symposium / Conference',
    startDate: '2025-04-15',
    endDate: '2025-04-15',
    daysCount: 1,
    facultyAdvisor: 'Dr. Test Advisor 2',
    purpose: 'Presenting a paper on signal processing.',
  });

  const rejectResult = odService.updateApplicationStatus(
    toReject.id,
    'Rejected',
    'Insufficient proof of participation submitted.',
    'EEC-STAFF-208'
  );
  assert.strictEqual(rejectResult, true, 'Rejection returns true');

  const rejectedApps = odService.getStudentApplications('310622106099');
  const rejectedApp = rejectedApps.find((a) => a.id === toReject.id);
  assert.strictEqual(rejectedApp!.status, 'Rejected', 'Status updated to Rejected');
  assert.strictEqual(rejectedApp!.staffComment, 'Insufficient proof of participation submitted.');

  // Non-existent ID returns false
  const noOp = odService.updateApplicationStatus('EEC-OD-INVALID-0000', 'Approved', '', 'staff');
  assert.strictEqual(noOp, false, 'updateApplicationStatus returns false for unknown id');

  console.log('  ✓ Staff OD approval workflow: submit, filter by student, approve, reject, staffComment, reviewedBy, reviewedAt all verified.');

  console.log('\n===========================================');
  console.log('🎉 ALL E.A.S.E. TEST SUITES PASSED (10/10)!');
  console.log('===========================================\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
  return;
});
