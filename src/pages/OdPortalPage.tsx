import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { MaskingTape } from '../components/common/MaskingTape';
import { RubberStamp } from '../components/common/RubberStamp';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { EventItem } from '../types/event';
import { odService, OdApplication } from '../services/odService';

// Re-export so other files that import OdApplication from here still compile
export type { OdApplication };

const STORAGE_KEY_OD = 'ease_campus_od_applications';

export const OdPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefilledEvent = searchParams.get('event') || '';

  const [activeTab, setActiveTab] = useState<'apply' | 'track' | 'rules'>('apply');
  const [approvedEvents, setApprovedEvents] = useState<EventItem[]>([]);

  // Load only THIS student's applications from the shared localStorage store
  const loadMyApplications = () =>
    user?.identifier
      ? odService.getStudentApplications(user.identifier)
      : odService.getAllApplications();

  const [applications, setApplications] = useState<OdApplication[]>(loadMyApplications);

  // Form state
  const [eventTitle, setEventTitle] = useState(prefilledEvent);
  const [category, setCategory] = useState('Technical Hackathon');
  const [startDate, setStartDate] = useState('2025-03-28');
  const [endDate, setEndDate] = useState('2025-03-29');
  const [facultyAdvisor, setFacultyAdvisor] = useState('Dr. K. S. Anand (HOD, CSE)');
  const [attendancePercentage, setAttendancePercentage] = useState('84');
  const [purpose, setPurpose] = useState(
    prefilledEvent ? `Participant in ${prefilledEvent}. Seeking official duty attendance credit.` : ''
  );
  const [proofUrl, setProofUrl] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setApprovedEvents(eventService.getApprovedEvents());
    if (prefilledEvent) {
      setEventTitle(prefilledEvent);
      if (!purpose) {
        setPurpose(`Official student delegate / participant in ${prefilledEvent}.`);
      }
    }
  }, [prefilledEvent]);

  const handleEventSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setEventTitle(val);
    const matched = approvedEvents.find((ev) => ev.title === val);
    if (matched) {
      setStartDate(matched.startDate);
      setEndDate(matched.endDate);
      if (matched.category.includes('Hackathon')) setCategory('Technical Hackathon');
      else if (matched.category.includes('Workshop')) setCategory('Technical Workshop');
      else if (matched.category.includes('Academic')) setCategory('Academic / Conference');
      else setCategory('Campus Event');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!eventTitle.trim()) {
      errors.eventTitle = 'Event title is required.';
    }
    if (!startDate) {
      errors.startDate = 'Start date is required.';
    }
    if (!endDate) {
      errors.endDate = 'End date is required.';
    } else if (endDate < startDate) {
      errors.endDate = 'End date cannot be earlier than start date.';
    }
    if (!facultyAdvisor.trim()) {
      errors.facultyAdvisor = 'Faculty Advisor name is required.';
    }
    const attNum = Number(attendancePercentage);
    if (isNaN(attNum) || attNum < 0 || attNum > 100) {
      errors.attendancePercentage = 'Enter a valid attendance percentage (0 to 100).';
    } else if (attNum < 75) {
      errors.attendancePercentage =
        'Warning: Autonomous regulations mandate minimum 75% attendance to qualify for OD.';
    }
    if (!purpose.trim() || purpose.trim().length < 15) {
      errors.purpose = 'Please provide detailed justification (minimum 15 characters).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOd = odService.submitApplication({
        studentName: user?.name || 'Aravind S (CSE)',
        registerNumber: user?.identifier || '310621104001',
        department: user?.department || 'Computer Science and Engineering',
        eventTitle: eventTitle.trim(),
        category,
        startDate,
        endDate,
        daysCount: startDate === endDate ? 1 : 2,
        facultyAdvisor: facultyAdvisor.trim(),
        purpose: purpose.trim(),
        remarks: 'Submitted via E.A.S.E. Digital OD Dispatch. Forwarded to Class Advisor.',
      });

      // Reload this student's applications from shared store
      setApplications(loadMyApplications());
      setIsSubmitting(false);

      setSuccessMessage(
        `OD Application Reference #${newOd.id} generated successfully! It has been dispatched to your Faculty Advisor for review.`
      );

      // Switch to tracking tab after brief delay
      setTimeout(() => {
        setActiveTab('track');
      }, 1500);
    }, 600);
  };


  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-[calc(100vh-7rem)] py-8">
      <div className="max-w-5xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
        <div
          className="rounded-lg p-4 sm:p-8 min-h-[750px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)] flex flex-col justify-between"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
          }}
        >
          {/* Top Wooden Plaque Header */}
          <div className="relative bg-[#FFFDF7] rounded-sm p-6 sm:p-8 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10 mb-6">
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 right-10" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <img
                  src={appConfig.emblemUrl}
                  alt="Easwari Engineering College Seal"
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold block">
                    {appConfig.collegeName} • Autonomous
                  </span>
                  <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                    On-Duty (OD) Attendance Portal
                  </h1>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Directorate of Student Affairs & Academic Schedule Synchronization
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <RubberStamp
                  label="AUTONOMOUS"
                  subLabel="OD VERIFIED"
                  code="EEC SA-OD"
                  color="emerald"
                  className="scale-[0.65] origin-center -my-2"
                />
              </div>
            </div>

            {/* Active Student Chip & Tab Navigation */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-lg border border-amber-900/10 text-xs font-title-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                    activeTab === 'apply'
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">edit_document</span>
                  <span>New OD Application</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                    activeTab === 'track'
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  <span>Track Requests ({applications.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                    activeTab === 'rules'
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">gavel</span>
                  <span>Autonomous Regulations</span>
                </button>
              </div>

              {/* Logged in User Indicator */}
              {user && (
                <div className="flex items-center gap-2 text-xs text-on-surface bg-surface-container px-3 py-1 rounded border border-amber-900/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Applicant: <strong>{user.name}</strong></span>
                  <span className="text-[10px] text-outline font-mono">({user.identifier})</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab 1: New OD Application Form */}
          {activeTab === 'apply' && (
            <article className="relative bg-[#FFFEFA] rounded-sm p-6 sm:p-8 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10 animate-in fade-in">
              <MaskingTape color="amber" width="w-24" className="absolute -top-3 left-12" />
              <MaskingTape color="amber" width="w-24" className="absolute -top-3 right-12" />

              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div>
                  <h2 className="font-display-lg text-lg sm:text-xl text-primary font-bold font-serif">
                    Student Duty Credit Application Form
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Submit this requisition to obtain academic attendance waiver for inter-college or campus competitions.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-label-sm text-[10px] uppercase font-bold tracking-wider">
                  Academic Form 4A
                </span>
              </div>

              {successMessage && (
                <div className="my-4 p-4 bg-emerald-50 rounded border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5 animate-in fade-in">
                  <span className="material-symbols-outlined text-emerald-700 text-lg mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <div>
                    <span className="font-bold text-emerald-900 block">Application Lodged Successfully</span>
                    <p className="mt-0.5 text-emerald-800 leading-snug">{successMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs font-title-md">
                {/* Event Selection Dropdown or Freeform Input */}
                <div>
                  <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                    Select Target Campus Notice / Event *
                  </label>
                  <select
                    value={eventTitle}
                    onChange={handleEventSelectChange}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  >
                    <option value="">-- Choose from live pinned events or enter manually below --</option>
                    {approvedEvents.map((ev) => (
                      <option key={ev.id} value={ev.title}>
                        {ev.title} ({ev.startDate} • {ev.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Name Manual Field (if not listed or custom) */}
                <div>
                  <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                    Event Title / Activity Name *
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => {
                      setEventTitle(e.target.value);
                      if (formErrors.eventTitle) setFormErrors((prev) => ({ ...prev, eventTitle: '' }));
                    }}
                    placeholder="e.g., HACK EASWARI 2025 or National Autonomous Symposium"
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  />
                  {formErrors.eventTitle && (
                    <p className="text-red-600 font-bold text-[11px] mt-1">{formErrors.eventTitle}</p>
                  )}
                </div>

                {/* 2-column: Category and Attendance % */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                      OD Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    >
                      <option value="Technical Hackathon">Technical Hackathon (36/24h)</option>
                      <option value="Symposium / Conference">Symposium / Paper Presentation</option>
                      <option value="Technical Workshop">Hands-on Technical Workshop</option>
                      <option value="Club Official Duty">Student Club Organizing Lead</option>
                      <option value="Sports / Culturals">Sports Tournament / Cultural Fest</option>
                      <option value="Placement Drive">Corporate Placement Recruitment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                      Current Theory & Lab Attendance % *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={attendancePercentage}
                      onChange={(e) => {
                        setAttendancePercentage(e.target.value);
                        if (formErrors.attendancePercentage)
                          setFormErrors((prev) => ({ ...prev, attendancePercentage: '' }));
                      }}
                      placeholder="e.g., 85"
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                    {formErrors.attendancePercentage && (
                      <p className="text-red-600 font-bold text-[11px] mt-1">
                        {formErrors.attendancePercentage}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2-column: Start Date & End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                      OD Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                    {formErrors.startDate && (
                      <p className="text-red-600 font-bold text-[11px] mt-1">{formErrors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                      OD End Date *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                    {formErrors.endDate && (
                      <p className="text-red-600 font-bold text-[11px] mt-1">{formErrors.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Faculty Advisor */}
                <div>
                  <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                    Faculty Advisor / Class In-charge *
                  </label>
                  <input
                    type="text"
                    value={facultyAdvisor}
                    onChange={(e) => setFacultyAdvisor(e.target.value)}
                    placeholder="e.g., Dr. K. S. Anand (HOD, CSE) or Class In-charge"
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  />
                  {formErrors.facultyAdvisor && (
                    <p className="text-red-600 font-bold text-[11px] mt-1">
                      {formErrors.facultyAdvisor}
                    </p>
                  )}
                </div>

                {/* Justification / Purpose */}
                <div>
                  <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                    Detailed Duty Justification & Role *
                  </label>
                  <textarea
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Explain your specific role, paper track, team designation, or competition schedule..."
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  />
                  {formErrors.purpose && (
                    <p className="text-red-600 font-bold text-[11px] mt-1">{formErrors.purpose}</p>
                  )}
                </div>

                {/* Registration Slip / Proof Link */}
                <div>
                  <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                    Event Registration Confirmation / Acceptance Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://devfolio.co/submissions/... or Google Drive acceptance letter"
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-outline">
                    * Applications are timestamped and digitally routed for faculty endorsement.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2.5 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center gap-2 font-bold disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Dispatching OD Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit OD Application</span>
                        <span className="material-symbols-outlined text-sm">send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </article>
          )}

          {/* Tab 2: Tracking Applications */}
          {activeTab === 'track' && (
            <article className="relative bg-[#FFFEFA] rounded-sm p-6 sm:p-8 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10 animate-in fade-in">
              <Pushpin color="brass" size="md" className="absolute -top-3 left-10" />
              <Pushpin color="brass" size="md" className="absolute -top-3 right-10" />

              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div>
                  <h2 className="font-display-lg text-lg sm:text-xl text-primary font-bold font-serif">
                    My OD Applications Tracker
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Monitor authorization checkpoints, faculty signatures, and ERP attendance synchronization.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className="bg-primary text-on-primary px-3 py-1.5 rounded text-xs font-title-md flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>New Request</span>
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 sm:p-5 rounded bg-surface-container-low border border-amber-900/10 shadow-sm relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-surface-container pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded border border-amber-900/10">
                            {app.id}
                          </span>
                          <span className="text-[11px] text-outline">
                            Submitted: {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded text-[11px] font-title-md font-bold uppercase tracking-wider flex items-center gap-1 ${
                            app.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : app.status === 'Pending Faculty Review'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : app.status === 'Rejected'
                              ? 'bg-red-100 text-red-900 border border-red-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {app.status === 'Approved'
                              ? 'verified'
                              : app.status === 'Rejected'
                              ? 'cancel'
                              : 'pending'}
                          </span>
                          <span>{app.status}</span>
                        </span>
                      </div>

                      <div className="mt-3">
                        <h3 className="font-title-md text-sm text-on-surface font-bold">
                          {app.eventTitle}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-body-sm">
                          <span>🏷️ {app.category}</span>
                          <span>📅 {app.startDate} to {app.endDate} ({app.daysCount} Day{app.daysCount > 1 ? 's' : ''})</span>
                          <span>👨‍🏫 {app.facultyAdvisor}</span>
                        </div>
                        <p className="mt-2 text-xs text-on-surface font-body-sm italic bg-surface-container-lowest p-2 rounded border border-amber-900/5">
                          "{app.purpose}"
                        </p>
                      </div>

                      {/* Staff Feedback (visible to student after review) */}
                      {(app as any).staffComment && (
                        <div className={`mt-3 pt-2 border-t border-surface-container p-3 rounded text-xs font-body-sm ${
                          app.status === 'Approved'
                            ? 'bg-emerald-50 border-l-2 border-l-emerald-500'
                            : 'bg-red-50 border-l-2 border-l-red-500'
                        }`}>
                          <span className="font-bold text-on-surface block mb-0.5">
                            {app.status === 'Approved' ? '✅ Staff Feedback (Approved)' : '❌ Staff Feedback (Rejected)'}
                          </span>
                          <p className="text-on-surface">{(app as any).staffComment}</p>
                          {(app as any).reviewedBy && (
                            <p className="text-[10px] text-outline mt-1">
                              Reviewed by: <span className="font-bold">{(app as any).reviewedBy}</span>
                              {(app as any).reviewedAt ? ` on ${new Date((app as any).reviewedAt).toLocaleDateString()}` : ''}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Legacy remarks / sign-off (for seed data) */}
                      {app.remarks && !(app as any).staffComment && (
                        <div className="mt-3 pt-2 border-t border-surface-container text-[11px] text-outline flex items-center justify-between">
                          <span>Status Note: {app.remarks}</span>
                          {app.approvedBy && (
                            <span className="text-emerald-800 font-bold">Sign-off: {app.approvedBy}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-surface-container-low rounded border border-dashed border-amber-900/20">
                    <span className="material-symbols-outlined text-outline text-3xl">
                      assignment_turned_in
                    </span>
                    <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                      No OD applications found. Click "New OD Application" to lodge a request.
                    </p>
                  </div>
                )}
              </div>
            </article>
          )}

          {/* Tab 3: Regulations & Guidelines */}
          {activeTab === 'rules' && (
            <article className="relative bg-[#FFFDF7] rounded-sm p-6 sm:p-8 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10 animate-in fade-in font-body-sm text-xs leading-relaxed text-on-surface-variant space-y-4">
              <Pushpin color="red" size="md" className="absolute -top-3 left-10" />
              <Pushpin color="red" size="md" className="absolute -top-3 right-10" />

              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <h2 className="font-display-lg text-lg sm:text-xl text-primary font-bold font-serif">
                  Autonomous Attendance Waiver & OD Regulations
                </h2>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] uppercase font-bold">
                  Deanery Bulletin 2025
                </span>
              </div>

              <div className="p-4 bg-amber-50 rounded border border-amber-200/80 text-amber-950 space-y-2">
                <h3 className="font-title-md text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-700">warning</span>
                  <span>Mandatory Thresholds & Timelines</span>
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>
                    <strong>Minimum Attendance:</strong> Students must maintain at least <strong>75%</strong> overall semester attendance. Requests from students falling below 75% require special Deanery clearance.
                  </li>
                  <li>
                    <strong>Submission Horizon:</strong> OD applications must be filed at least <strong>48 hours</strong> prior to the start of the event.
                  </li>
                  <li>
                    <strong>Maximum Quota:</strong> Up to 10 days of authorized On-Duty credit can be availed per academic semester for approved co-curricular and sports achievements.
                  </li>
                </ul>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-title-md text-sm text-primary font-bold">
                  Post-Event Certificate Submission Protocol
                </h4>
                <p>
                  Upon returning to campus, the physical prize certificate or official participation badge must be verified by the student's <strong>Faculty Advisor within 3 working days</strong>. The Class Advisor subsequently submits the digital confirmation to the Controller of Examinations (COE) cell to update biometric registers.
                </p>
                <div className="p-3 bg-surface-container-low rounded border border-amber-900/10">
                  <span className="font-bold text-on-surface block text-[11px]">
                    Helpline & Student Support Desk:
                  </span>
                  <span className="text-[11px]">
                    Main Block Room 104 (Office of Dean of Student Affairs) • Ext: <strong>{appConfig.helplineExt}</strong> • Phone: <strong>{appConfig.helplinePhone}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className="bg-primary text-on-primary px-4 py-2 rounded text-xs font-title-md shadow-sm"
                >
                  Proceed to Apply for OD →
                </button>
              </div>
            </article>
          )}

          {/* Bottom Navigation & Corkboard Return */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-amber-100 hover:text-white font-title-md bg-[#452712]/70 px-4 py-2 rounded-full transition-colors backdrop-blur-sm shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Campus Notice Board</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
