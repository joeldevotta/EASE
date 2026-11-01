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

export interface LostFoundValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLostFoundSubmission(values: {
  itemName?: string;
  description?: string;
  reportType?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
}): LostFoundValidationResult {
  const errors: Record<string, string> = {};

  const itemName = values.itemName?.trim() || '';
  if (!itemName) {
    errors.itemName = 'Item name is required.';
  } else if (itemName.length > 180) {
    errors.itemName = 'Item name cannot exceed 180 characters.';
  }

  const description = values.description?.trim() || '';
  if (!description) {
    errors.description = 'Description is required.';
  } else if (description.length > 5000) {
    errors.description = 'Description cannot exceed 5000 characters.';
  }

  const reportType = values.reportType?.trim() || '';
  if (!reportType) {
    errors.reportType = 'Please select whether the item was lost or found.';
  } else if (reportType !== 'LOST' && reportType !== 'FOUND') {
    errors.reportType = 'Report type must be either LOST or FOUND.';
  }

  const location = values.location?.trim() || '';
  if (!location) {
    errors.location = 'Location is required.';
  } else if (location.length > 180) {
    errors.location = 'Location cannot exceed 180 characters.';
  }

  const contactName = values.contactName?.trim() || '';
  if (!contactName) {
    errors.contactName = 'Contact name is required for verification.';
  } else if (contactName.length > 100) {
    errors.contactName = 'Contact name cannot exceed 100 characters.';
  }

  const contactEmail = values.contactEmail?.trim() || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!contactEmail) {
    errors.contactEmail = 'Contact email is required for verification.';
  } else if (!emailRegex.test(contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address.';
  } else if (contactEmail.length > 180) {
    errors.contactEmail = 'Contact email cannot exceed 180 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const LOST_FOUND_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const LOST_FOUND_ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type DetectedLostFoundImageType = (typeof LOST_FOUND_ACCEPTED_IMAGE_TYPES)[number];

const BLOCKED_IMAGE_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.msi', '.js', '.mjs', '.html', '.htm',
  '.svg', '.xml', '.php', '.sh', '.ps1', '.dll', '.jar', '.war',
];

export function detectImageTypeFromMagicBytes(
  bytes: ArrayBuffer | Uint8Array | null | undefined
): DetectedLostFoundImageType | null {
  if (!bytes) return null;
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (view.length < 12) return null;

  if (view[0] === 0xff && view[1] === 0xd8 && view[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    view[0] === 0x89 &&
    view[1] === 0x50 &&
    view[2] === 0x4e &&
    view[3] === 0x47 &&
    view[4] === 0x0d &&
    view[5] === 0x0a &&
    view[6] === 0x1a &&
    view[7] === 0x0a
  ) {
    return 'image/png';
  }
  const header = String.fromCharCode(view[0], view[1], view[2], view[3]);
  const webp = String.fromCharCode(view[8], view[9], view[10], view[11]);
  if (header === 'RIFF' && webp === 'WEBP') {
    return 'image/webp';
  }
  return null;
}

export function validateLostFoundImage(file: {
  name?: string;
  size: number;
  type?: string;
  magicBytes?: ArrayBuffer | Uint8Array | null;
} | null | undefined): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: true };
  }

  const name = (file.name || 'upload').replace(/\\/g, '/').split('/').pop() || 'upload';
  if (name.includes('..') || name.includes(':')) {
    return { isValid: false, error: 'Invalid image filename.' };
  }

  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf('.');
  const extension = dot >= 0 ? lower.slice(dot) : '';
  if (BLOCKED_IMAGE_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are accepted.' };
  }

  if (file.size <= 0) {
    return { isValid: false, error: 'The selected image is empty.' };
  }
  if (file.size > LOST_FOUND_MAX_IMAGE_BYTES) {
    return { isValid: false, error: 'Image must be 5 MB or smaller.' };
  }

  if (file.magicBytes) {
    const detected = detectImageTypeFromMagicBytes(file.magicBytes);
    if (!detected) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are accepted.' };
    }
  } else if (file.type && !LOST_FOUND_ACCEPTED_IMAGE_TYPES.includes(file.type as DetectedLostFoundImageType)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are accepted.' };
  }

  return { isValid: true };
}

export async function readFileMagicBytes(file: File, length = 16): Promise<Uint8Array> {
  const slice = file.slice(0, length);
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
}
