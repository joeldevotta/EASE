import React, { useState } from 'react';
import { appConfig } from '../../config/appConfig';
import { eventService } from '../../services/eventService';
import { EventCategory, EventItem } from '../../types/event';
import { validateEventSubmission } from '../../utils/validation';
import { Pushpin } from '../common/Pushpin';
import { useAuth } from '../../context/AuthContext';

interface EventSubmissionFormProps {
  onSuccess?: (event: EventItem) => void;
}

export const EventSubmissionForm: React.FC<EventSubmissionFormProps> = ({
  onSuccess,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon' as EventCategory,
    department: 'Computer Science and Engineering (CSE)',
    venue: '',
    startDate: '',
    startTime: '09:00 AM',
    endDate: '',
    endTime: '05:00 PM',
    organizingClub: '',
    facultyCoordinator: '',
    facultyCoordinatorEmpId: '',
    coordinatorContact: '',
    eligibility: 'Open to all engineering students.',
    registrationDeadline: '',
    registrationUrl: '',
    registrationStatus: 'Open' as const,
    description: '',
    prizes: '',
    teamSize: 'Individual / Teams of 2-4',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedEvent, setSubmittedEvent] = useState<EventItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: EventCategory[] = [
    'Hackathon',
    'Workshop',
    'Technical Competition',
    'Cultural Event',
    'Club Activity',
    'Academic',
    'Seminar',
    'Other',
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error on change
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateEventSubmission(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await eventService.submitEvent({
        title: formData.title.trim(),
        category: formData.category,
        department: formData.department,
        venue: formData.venue.trim(),
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        organizingClub: formData.organizingClub.trim() || 'Department Association',
        facultyCoordinator: formData.facultyCoordinator.trim(),
        facultyCoordinatorEmpId: formData.facultyCoordinatorEmpId.trim(),
        coordinatorContact: formData.coordinatorContact.trim(),
        eligibility: formData.eligibility.trim(),
        registrationDeadline: formData.registrationDeadline || formData.startDate,
        registrationUrl: formData.registrationUrl.trim(),
        registrationStatus: formData.registrationStatus,
        description: formData.description.trim(),
        prizes: formData.prizes.trim(),
        teamSize: formData.teamSize.trim(),
      });

      setSubmittedEvent(result.event);
      if (onSuccess) onSuccess(result.event);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrors({ form: err instanceof Error ? err.message : 'An unexpected error occurred while submitting the event.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedEvent(null);
    setFormData({
      title: '',
      category: 'Hackathon',
      department: 'Computer Science and Engineering (CSE)',
      venue: '',
      startDate: '',
      startTime: '09:00 AM',
      endDate: '',
      endTime: '05:00 PM',
      organizingClub: '',
      facultyCoordinator: '',
      facultyCoordinatorEmpId: '',
      coordinatorContact: '',
      eligibility: 'Open to all engineering students.',
      registrationDeadline: '',
      registrationUrl: '',
      registrationStatus: 'Open',
      description: '',
      prizes: '',
      teamSize: 'Individual / Teams of 2-4',
    });
    setErrors({});
  };

  return (
    <div className="relative bg-[#FFFDF7] rounded-sm p-6 sm:p-10 shadow-[0_15px_35px_-5px_rgba(40,15,5,0.4)] border border-amber-900/10 max-w-3xl mx-auto">
      <Pushpin color="brass" size="lg" className="absolute -top-3.5 left-8" />
      <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-8" />

      {/* Header */}
      <div className="pb-4 border-b border-surface-container">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            push_pin
          </span>
          <div>
            <h2 className="font-display-lg text-2xl text-primary font-serif font-bold">
              Pin Notice Request & Event Submission Desk
            </h2>
            <p className="font-label-sm text-xs text-outline uppercase tracking-wider">
              Faculty Coordinators & Student Club Leads • Directorate of Student Affairs
            </p>
          </div>
        </div>
      </div>

      {/* Development Transparency Banner */}
      <div className="my-4 p-3.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-950 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <span className="material-symbols-outlined text-base">info</span>
          <span>Local Demo Storage & Approval Architecture:</span>
        </div>
        <p className="leading-relaxed">
          Submissions are validated and stored in your browser's persistent demo repository with status <strong className="text-secondary uppercase">Pending</strong>. They remain accessible after page refreshes and can be inspected in the <a href="/admin-review" className="underline font-bold text-primary">Demo Admin Review Desk</a>. They are hidden from the public board until approved.
        </p>
      </div>

      {/* Success Notification */}
      {submittedEvent && (
        <div className="my-6 p-5 bg-emerald-50 rounded border-2 border-emerald-300 text-emerald-950 animate-in fade-in">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-700 text-2xl mt-0.5">
              check_circle
            </span>
            <div className="flex-1">
              <h3 className="font-headline-sm text-base font-bold text-emerald-900">
                Notice Saved Locally as Pending Review!
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Notice <strong>"{submittedEvent.title}"</strong> has been assigned demo ID{' '}
                <code className="bg-emerald-200/60 px-1 py-0.5 rounded font-bold">
                  {submittedEvent.id}
                </code>.
              </p>
              <p className="text-xs text-emerald-800 mt-1">
                Per institution protocol, notices remain in the pending review queue until verified. You can simulate approval or rejection right now in the review portal.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {user?.role === 'admin' ? (
                  <a
                    href="/admin-review"
                    className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded text-xs font-title-md transition-colors"
                  >
                    Open Admin Review Desk →
                  </a>
                ) : (
                  <a
                    href="/events"
                    className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded text-xs font-title-md transition-colors"
                  >
                    View Campus Board →
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded text-xs font-title-md"
                >
                  Submit Another Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {!submittedEvent && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errors.form && (
            <div className="p-3 bg-red-100 text-red-900 rounded text-xs font-bold">
              {errors.form}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
              Notice / Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., National Hackathon on Autonomous Robotics"
              className={`w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.title ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
              }`}
            />
            {errors.title && (
              <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                {errors.title}
              </span>
            )}
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border border-amber-900/15 shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Host Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border border-amber-900/15 shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {appConfig.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full bg-surface-container-low px-3 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.startDate ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
                }`}
              />
              {errors.startDate && (
                <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                  {errors.startDate}
                </span>
              )}
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full bg-surface-container-low px-3 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.endDate ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
                }`}
              />
              {errors.endDate && (
                <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                  {errors.endDate}
                </span>
              )}
            </div>
          </div>

          {/* Venue & Organizing Club */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Campus Venue & Lab *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., TRP Auditorium Hall B"
                className={`w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.venue ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
                }`}
              />
              {errors.venue && (
                <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                  {errors.venue}
                </span>
              )}
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Organizing Club / Society
              </label>
              <input
                type="text"
                name="organizingClub"
                value={formData.organizingClub}
                onChange={handleChange}
                placeholder="e.g., IEEE Student Branch, Coding Club"
                className="w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border border-amber-900/15 shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Faculty In-Charge & Emp ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Faculty Coordinator Name *
              </label>
              <input
                type="text"
                name="facultyCoordinator"
                value={formData.facultyCoordinator}
                onChange={handleChange}
                placeholder="e.g., Dr. K. S. Anand"
                className={`w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.facultyCoordinator ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
                }`}
              />
              {errors.facultyCoordinator && (
                <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                  {errors.facultyCoordinator}
                </span>
              )}
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Faculty Employee ID
              </label>
              <input
                type="text"
                name="facultyCoordinatorEmpId"
                value={formData.facultyCoordinatorEmpId}
                onChange={handleChange}
                placeholder="EEC-FAC-XXXX"
                className="w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border border-amber-900/15 shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Registration URL & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Registration Portal URL (Devfolio, Google Form, etc.)
              </label>
              <input
                type="url"
                name="registrationUrl"
                value={formData.registrationUrl}
                onChange={handleChange}
                placeholder="https://devfolio.co or https://forms.gle/..."
                className={`w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.registrationUrl ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
                }`}
              />
              {errors.registrationUrl && (
                <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                  {errors.registrationUrl}
                </span>
              )}
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Registration Deadline
              </label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className={`w-full bg-surface-container-low px-3 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.registrationDeadline ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
                }`}
              />
              {errors.registrationDeadline && (
                <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                  {errors.registrationDeadline}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
              Notice Full Description & Objectives *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide event overview, rounds, judging criteria, and key highlights..."
              className={`w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border shadow-inner focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.description ? 'border-red-500 bg-red-50/50' : 'border-amber-900/15'
              }`}
            />
            {errors.description && (
              <span className="text-[11px] text-red-600 font-bold block mt-0.5">
                {errors.description}
              </span>
            )}
          </div>

          {/* Eligibility & Prizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Eligibility & Year Restrictions
              </label>
              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="e.g., Open to 2nd & 3rd Years across Tamil Nadu"
                className="w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border border-amber-900/15 shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface font-bold mb-1">
                Prizes / Certificates
              </label>
              <input
                type="text"
                name="prizes"
                value={formData.prizes}
                onChange={handleChange}
                placeholder="e.g., ₹50,000 Cash Pool + IEEE Points"
                className="w-full bg-surface-container-low px-3.5 py-2 rounded text-body-sm text-on-surface border border-amber-900/15 shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded font-title-md text-xs sm:text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Reset Fields
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2.5 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center gap-1.5 font-bold disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>{isSubmitting ? 'Validating...' : 'Submit Notice for Dean Approval'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
