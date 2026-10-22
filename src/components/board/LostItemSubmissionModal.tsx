import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { LostFoundReportType, LostFoundSubmissionInput } from '../../types/lostFound';
import { lostFoundService } from '../../services/lostFoundService';
import {
  LOST_FOUND_MAX_IMAGE_BYTES,
  readFileMagicBytes,
  validateLostFoundImage,
  validateLostFoundSubmission,
} from '../../utils/validation';
import { Pushpin } from '../common/Pushpin';

interface LostItemSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const LostItemSubmissionModal: React.FC<LostItemSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const [reportType, setReportType] = useState<LostFoundReportType>('LOST');
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDragging, setImageDragging] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<{ id: string; itemName: string } | null>(null);

  const clearImagePreview = useCallback(() => {
    setImagePreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }, []);

  const resetForm = useCallback(() => {
    setItemName('');
    setLocation('');
    setDescription('');
    setContactName('');
    setContactEmail('');
    setImageFile(null);
    clearImagePreview();
    setErrors({});
    setApiError(null);
    setSubmittedRef(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [clearImagePreview]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const applySelectedImage = useCallback(async (file: File | null) => {
    if (!file) {
      setImageFile(null);
      clearImagePreview();
      setErrors((current) => {
        const next = { ...current };
        delete next.image;
        return next;
      });
      return;
    }

    const magicBytes = await readFileMagicBytes(file);
    const imageValidation = validateLostFoundImage({
      name: file.name,
      size: file.size,
      type: file.type,
      magicBytes,
    });
    if (!imageValidation.isValid) {
      setImageFile(null);
      clearImagePreview();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setErrors((current) => ({
        ...current,
        image: imageValidation.error || 'The selected image is not valid.',
      }));
      return;
    }

    setImageFile(file);
    setImagePreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
    setErrors((current) => {
      const next = { ...current };
      delete next.image;
      return next;
    });
  }, [clearImagePreview]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!submitting) {
          handleClose();
        }
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [handleClose, isOpen, submitting]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const payload: LostFoundSubmissionInput = {
      itemName,
      description,
      reportType,
      location,
      contactName,
      contactEmail,
    };

    const validation = validateLostFoundSubmission(payload);
    const nextErrors = { ...validation.errors };

    if (imageFile) {
      const magicBytes = await readFileMagicBytes(imageFile);
      const imageValidation = validateLostFoundImage({
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
        magicBytes,
      });
      if (!imageValidation.isValid && imageValidation.error) {
        nextErrors.image = imageValidation.error;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const result = await lostFoundService.submitItem(payload, imageFile);
      setSubmittedRef({
        id: result.item.id,
        itemName: result.item.itemName,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const maxMb = Math.round(LOST_FOUND_MAX_IMAGE_BYTES / (1024 * 1024));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          handleClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative flex max-h-[min(92vh,880px)] w-full max-w-xl flex-col overflow-hidden rounded-sm border border-amber-900/15 bg-[#FFFDF7] shadow-[0_20px_50px_rgba(40,15,5,0.45)]"
      >
        <Pushpin color="navy" size="md" className="absolute -top-3 left-8 z-30" />
        <Pushpin color="red" size="md" className="absolute -top-3 right-8 z-30" />

        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-surface-container px-5 pb-3 pt-6 sm:px-7">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-label-sm font-bold uppercase text-secondary">
              <span className="material-symbols-outlined text-sm">search_check</span>
              <span>Student Affairs Property Desk</span>
            </div>
            <h3
              id={titleId}
              className="mt-0.5 font-serif text-lg font-headline-sm font-bold text-primary sm:text-xl"
            >
              Post Item to Lost & Found Corkboard
            </h3>
            <p id={descriptionId} className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
              Reports stay pending until Student Affairs verifies them. Contact details are never shown on the public corkboard.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="shrink-0 rounded p-1.5 text-outline transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7">
          {submittedRef ? (
            <div className="space-y-4">
              <div className="space-y-2 rounded border-2 border-emerald-300 bg-emerald-50 p-4 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <span className="material-symbols-outlined text-xl text-emerald-700">check_circle</span>
                  <span>Report Submitted for Review</span>
                </div>
                <p className="text-xs leading-relaxed sm:text-sm">
                  Your report for <strong>"{submittedRef.itemName}"</strong> has been logged under{' '}
                  <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-xs font-bold text-emerald-900">
                    Ref #{submittedRef.id}
                  </code>
                  .
                </p>
              </div>

              <div className="space-y-2 rounded border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
                <div className="flex items-center gap-1.5 font-bold uppercase text-amber-900">
                  <span className="material-symbols-outlined text-base text-amber-700">security</span>
                  <span>Pending Verification Protocol</span>
                </div>
                <p>
                  To prevent fraudulent claims and safeguard possessions, all physical items must be
                  deposited or claimed in person at{' '}
                  <strong>Main Block Room 104 (Directorate of Student Affairs)</strong>.
                </p>
                <p>
                  Your report is currently <strong>Pending Review</strong> by the desk officer. Once verified,
                  it will be published to the public corkboard.
                </p>
              </div>
            </div>
          ) : (
            <form id="lost-found-submission-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
              {apiError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-900"
                >
                  <span className="material-symbols-outlined shrink-0 text-sm text-red-700">error</span>
                  <span>{apiError}</span>
                </div>
              )}

              <div>
                <span id="lost-found-report-type-label" className="mb-1 block text-xs font-bold text-primary">
                  Report Type <span className="text-secondary">*</span>
                </span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="lost-found-report-type-label">
                  <button
                    type="button"
                    aria-pressed={reportType === 'LOST'}
                    onClick={() => setReportType('LOST')}
                    className={`flex items-center justify-center gap-1.5 rounded border px-3 py-2 text-xs font-title-md font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      reportType === 'LOST'
                        ? 'border-rose-300 bg-rose-100 text-rose-950 shadow-sm ring-1 ring-rose-400'
                        : 'border-surface-container bg-white text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">🔴</span>
                    <span>I Lost an Item</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={reportType === 'FOUND'}
                    onClick={() => setReportType('FOUND')}
                    className={`flex items-center justify-center gap-1.5 rounded border px-3 py-2 text-xs font-title-md font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      reportType === 'FOUND'
                        ? 'border-emerald-300 bg-emerald-100 text-emerald-950 shadow-sm ring-1 ring-emerald-400'
                        : 'border-surface-container bg-white text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">🟢</span>
                    <span>I Found an Item</span>
                  </button>
                </div>
                {errors.reportType && (
                  <p className="mt-1 text-[11px] text-red-700" role="alert">{errors.reportType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="lost-found-item-name" className="mb-1 block text-xs font-bold text-primary">
                    Item Name <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="lost-found-item-name"
                    type="text"
                    maxLength={180}
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Casio Scientific Calculator fx-991EX"
                    className={`w-full rounded border bg-white p-2.5 text-xs focus:outline-none focus:ring-1 ${
                      errors.itemName ? 'border-red-400 focus:ring-red-400' : 'border-amber-900/20 focus:ring-primary'
                    }`}
                    required
                  />
                  {errors.itemName && (
                    <p className="mt-0.5 text-[11px] text-red-700" role="alert">{errors.itemName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lost-found-location" className="mb-1 block text-xs font-bold text-primary">
                    Location <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="lost-found-location"
                    type="text"
                    maxLength={180}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. ECE Analog Lab 2, Table 4"
                    className={`w-full rounded border bg-white p-2.5 text-xs focus:outline-none focus:ring-1 ${
                      errors.location ? 'border-red-400 focus:ring-red-400' : 'border-amber-900/20 focus:ring-primary'
                    }`}
                    required
                  />
                  {errors.location && (
                    <p className="mt-0.5 text-[11px] text-red-700" role="alert">{errors.location}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lost-found-description" className="mb-1 block text-xs font-bold text-primary">
                  Detailed Description <span className="text-secondary">*</span>
                </label>
                <textarea
                  id="lost-found-description"
                  rows={3}
                  maxLength={5000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe markings, color, brand, condition, or identifiers..."
                  className={`w-full rounded border bg-white p-2.5 text-xs focus:outline-none focus:ring-1 ${
                    errors.description ? 'border-red-400 focus:ring-red-400' : 'border-amber-900/20 focus:ring-primary'
                  }`}
                  required
                />
                <div className="mt-0.5 flex items-center justify-between text-[10px] text-outline">
                  <span>
                    {errors.description ? (
                      <span className="text-red-700" role="alert">{errors.description}</span>
                    ) : (
                      'Provide distinguishing details'
                    )}
                  </span>
                  <span>{description.length}/5000</span>
                </div>
              </div>

              <div>
                <label htmlFor="lost-found-image" className="mb-1 block text-xs font-bold text-primary">
                  Item Photo <span className="font-medium text-outline">(optional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  id="lost-found-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    void applySelectedImage(file);
                  }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-describedby="lost-found-image-help"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setImageDragging(true);
                  }}
                  onDragLeave={() => setImageDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setImageDragging(false);
                    const file = event.dataTransfer.files?.[0] || null;
                    void applySelectedImage(file);
                  }}
                  className={`rounded border-2 border-dashed p-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    errors.image
                      ? 'border-red-400 bg-red-50'
                      : imageDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-amber-900/25 bg-white hover:bg-surface-container-low'
                  }`}
                >
                  {imagePreviewUrl && imageFile ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <img
                        src={imagePreviewUrl}
                        alt="Selected item preview"
                        className="h-28 w-full max-w-[9rem] rounded object-cover sm:h-24"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-primary">{imageFile.name}</p>
                        <p className="mt-0.5 text-[11px] text-on-surface-variant">
                          {formatFileSize(imageFile.size)} · JPEG, PNG, or WebP
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded bg-surface-container px-2 py-1 text-[11px] font-bold text-primary">
                            Replace photo
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void applySelectedImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="rounded px-2 py-1 text-[11px] font-bold text-red-800 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            Remove photo
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-2xl text-secondary" aria-hidden="true">
                        add_photo_alternate
                      </span>
                      <div>
                        <p className="text-xs font-bold text-primary">Click to choose a photo or drag it here</p>
                        <p id="lost-found-image-help" className="mt-0.5 text-[11px]">
                          JPEG, PNG, or WebP up to {maxMb} MB. Photos help the desk match items; they are optional.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1 text-[11px] text-red-700" role="alert">{errors.image}</p>
                )}
              </div>

              <div className="space-y-3 rounded border border-amber-200/80 bg-amber-50/70 p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-sm text-secondary">verified_user</span>
                  <span>Reporter Contact (Required for Student Affairs Verification)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-on-surface-variant">
                  Privacy assurance: contact name and email are used solely by Student Affairs
                  to verify physical ownership. They are never displayed on the public corkboard.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="lost-found-contact-name" className="mb-1 block text-xs font-bold text-primary">
                      Your Name <span className="text-secondary">*</span>
                    </label>
                    <input
                      id="lost-found-contact-name"
                      type="text"
                      maxLength={100}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Rahul K. / Prof. Anitha"
                      className={`w-full rounded border bg-white p-2 text-xs focus:outline-none focus:ring-1 ${
                        errors.contactName ? 'border-red-400 focus:ring-red-400' : 'border-amber-900/20 focus:ring-primary'
                      }`}
                      required
                    />
                    {errors.contactName && (
                      <p className="mt-0.5 text-[11px] text-red-700" role="alert">{errors.contactName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lost-found-contact-email" className="mb-1 block text-xs font-bold text-primary">
                      Contact Email <span className="text-secondary">*</span>
                    </label>
                    <input
                      id="lost-found-contact-email"
                      type="email"
                      maxLength={180}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. rahul.k@easwari.ac.in"
                      className={`w-full rounded border bg-white p-2 text-xs focus:outline-none focus:ring-1 ${
                        errors.contactEmail ? 'border-red-400 focus:ring-red-400' : 'border-amber-900/20 focus:ring-primary'
                      }`}
                      required
                    />
                    {errors.contactEmail && (
                      <p className="mt-0.5 text-[11px] text-red-700" role="alert">{errors.contactEmail}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-surface-container px-5 py-3 sm:px-7">
          {submittedRef ? (
            <>
              <button
                type="button"
                onClick={resetForm}
                className="rounded px-4 py-2 text-xs font-title-md text-primary transition-colors hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Submit Another Item
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded bg-primary px-5 py-2 text-xs font-title-md font-bold text-on-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="rounded px-4 py-2 text-xs font-title-md text-on-surface-variant transition-colors hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="lost-found-submission-form"
                disabled={submitting}
                className="flex items-center gap-1.5 rounded bg-primary px-5 py-2 text-xs font-title-md font-bold text-on-primary shadow-sm transition-all hover:bg-primary/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    <span>Submitting for Review…</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
