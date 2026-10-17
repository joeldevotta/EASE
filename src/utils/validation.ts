/**
 * Form and URL validation utilities
 */

export function isValidHttpUrl(string: string): boolean {
  if (!string || string.trim() === '') return false;
  try {
    const url = new URL(string.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface EventSubmissionValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEventSubmission(values: {
  title: string;
  category: string;
  department: string;
  venue: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  organizingClub: string;
  facultyCoordinator: string;
  facultyCoordinatorEmpId?: string;
  registrationUrl?: string;
  registrationDeadline?: string;
  description: string;
}): EventSubmissionValidationResult {
  const errors: Record<string, string> = {};

  if (!values.title || values.title.trim().length < 4) {
    errors.title = 'Title must be at least 4 characters long.';
  }

  if (!values.category || values.category.trim() === '') {
    errors.category = 'Please select a valid event category.';
  }

  if (!values.department || values.department.trim() === '') {
    errors.department = 'Department is required.';
  }

  if (!values.venue || values.venue.trim().length < 3) {
    errors.venue = 'Please specify the campus venue or room.';
  }

  if (!values.startDate) {
    errors.startDate = 'Event start date is required.';
  }

  if (!values.endDate) {
    errors.endDate = 'Event end date is required.';
  }

  if (values.startDate && values.endDate) {
    if (values.endDate < values.startDate) {
      errors.endDate = 'End date cannot be earlier than start date.';
    }
  }

  if (values.registrationDeadline && values.startDate) {
    if (values.registrationDeadline > values.startDate) {
      errors.registrationDeadline =
        'Registration deadline cannot be after the event start date.';
    }
  }

  if (!values.facultyCoordinator || values.facultyCoordinator.trim().length < 3) {
    errors.facultyCoordinator = 'Faculty coordinator name is required.';
  }

  if (values.registrationUrl && values.registrationUrl.trim() !== '') {
    if (!isValidHttpUrl(values.registrationUrl)) {
      errors.registrationUrl = 'Please enter a valid URL (starting with https:// or http://).';
    }
  }

  if (!values.description || values.description.trim().length < 15) {
    errors.description = 'Please provide a clear description (at least 15 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface LoginValidationResult {
  isValid: boolean;
  errors: { identifier?: string; password?: string };
}

export function validateStudentLogin(
  identifier: string,
  password?: string
): LoginValidationResult {
  const errors: { identifier?: string; password?: string } = {};
  const clean = identifier ? identifier.trim() : '';

  if (!clean) {
    errors.identifier = 'Please enter your Student Register Number or College Email.';
  } else if (clean.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      errors.identifier = 'Please enter a valid college email address (e.g., student@easwari.ac.in).';
    }
  } else if (clean.length < 6) {
    errors.identifier = 'Register Number must be at least 6 alphanumeric characters.';
  }

  if (!password) {
    errors.password = 'Please enter your student password.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateAdminLogin(
  adminIdentifier: string,
  password?: string
): LoginValidationResult {
  const errors: { identifier?: string; password?: string } = {};
  const clean = adminIdentifier ? adminIdentifier.trim() : '';

  if (!clean) {
    errors.identifier = 'Please enter your Admin Email or Employee ID.';
  } else if (clean.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      errors.identifier = 'Please enter a valid official email address.';
    }
  } else if (clean.length < 5) {
    errors.identifier = 'Employee ID must be at least 5 characters (e.g., EEC-FAC-1042).';
  }

  if (!password) {
    errors.password = 'Please enter your administrative password.';
  } else if (password.length < 6) {
    errors.password = 'Administrative password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
