export const appConfig = {
  appName: 'E.A.S.E.',
  appFullName: 'Easwari Academic Schedule and Events',
  tagline: 'Your Campus. Your Events. All in One Place.',
  collegeName: 'Easwari Engineering College (Autonomous)',
  affiliation: 'Affiliated to Anna University, Chennai • Approved by AICTE, New Delhi',
  emblemUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCINnyFztwzs9YztrnFlEIgesi6Fuf2dOTTJRRep9_cPnsU1k4OTf7PRhWJ9b2UJLMTMzdul_ntsK_5Id_PC5AdnTs8vRn1kD6rfKkCZaIzNSa3_HF0FXSTQXshNN_SCScsMzZXoDWn6ZpXHdY_NvYSQDYBtD91q76DLJyfzKHTNXO_bygQknjsOjJEtnKqt32ovHLzWlCUzVdRtSEU4oSm82kpkUir0Hh6vD8SzJYYdY-7IiPy38IqBk1wa7Le8sh2IA',
  
  // Service endpoints (environment-configurable for future Spring Boot backend)
  apiBaseUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '',
  odPortalUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OD_PORTAL_URL) || 'https://odportal.srmeaswari.ac.in',

  lostFound: {
    maxImageBytes: 5 * 1024 * 1024,
    acceptedImageLabel: 'JPEG, PNG, or WebP',
  },

  // Campus Contact Coordinates
  helplinePhone: '044 - 43923041',
  helplineExt: '204',
  campusAddress: 'Bharathi Salai, Ramapuram, Chennai, Tamil Nadu 600089',
  examCellEmail: 'coe@eec.srmrmp.edu.in',
  studentAffairsEmail: 'studentaffairs@eec.srmrmp.edu.in',

  departments: [
    'Computer Science and Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics and Communication (ECE)',
    'Electrical and Electronics (EEE)',
    'Mechanical Engineering (Mech)',
    'Civil Engineering (Civil)',
    'Robotics and Automation (R&A)',
    'Biomedical Engineering (BME)',
    'Artificial Intelligence and Data Science (AI&DS)',
    'Master of Business Administration (MBA)','Computer Science and Engineering - Artificial Intelligence and Machine Learning (AI&ML)',
    'Cyber Security (CS)','Computer Science and Business Systems (CSBS)'],

  storageKeys: {
    events: 'ease_campus_events_v1',
    clubs: 'ease_campus_clubs_v1',
    announcements: 'ease_campus_announcements_v1',
    bookmarks: 'ease_campus_bookmarks_v1',
  },
};
