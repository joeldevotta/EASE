import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { EventItem } from '../types/event';
import { formatEventDateRange, getDaysRemaining } from '../utils/dateUtils';
import { openExternalUrl } from '../utils/externalLinks';
import { Pushpin } from '../components/common/Pushpin';
import { RubberStamp } from '../components/common/RubberStamp';
import { OdApplicationModal } from '../components/common/OdApplicationModal';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOdModal, setShowOdModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (id) {
      const found = eventService.getEventById(id);
      setEvent(found || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#84532B] flex items-center justify-center p-4">
        <div className="bg-[#FFFDF7] p-8 rounded shadow-lg text-center font-title-md text-primary">
          Locating notice on corkboard...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#84532B] p-4 flex items-center justify-center">
        <div className="relative bg-[#FFFDF7] max-w-md w-full p-8 rounded-sm shadow-2xl border border-amber-900/15 text-center">
          <Pushpin color="red" size="md" className="absolute -top-3 left-1/2 -translate-x-1/2" />
          <span className="material-symbols-outlined text-outline text-4xl mb-2">
            description
          </span>
          <h2 className="font-headline-sm text-lg text-primary font-bold">
            Notice Not Found
          </h2>
          <p className="text-xs text-on-surface-variant font-body-sm mt-2">
            The notice ID <code className="bg-surface-container px-1 py-0.5 rounded text-primary">{id}</code> may have been archived, moved, or is pending review.
          </p>
          <div className="mt-5">
            <Link
              to="/events"
              className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded text-xs font-title-md transition-colors inline-block"
            >
              Browse All Active Notices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = event.registrationDeadline
    ? getDaysRemaining(event.registrationDeadline)
    : null;

  const isRegistrationOpen =
    event.registrationStatus === 'Open' ||
    event.registrationStatus === 'Closing Soon';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs text-amber-100 hover:text-white font-title-md bg-[#452712]/80 px-3 py-1.5 rounded transition-colors backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Previous View</span>
          </button>
        </div>

        {/* Paper Notice Sheet */}
        <div className="relative bg-[#FFFEFA] rounded-sm shadow-[0_25px_60px_-15px_rgba(40,15,5,0.7)] p-6 sm:p-12 pt-12 border border-amber-900/10">
          <Pushpin color="brass" size="lg" className="absolute -top-3.5 left-10" />
          <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-10" />

          {/* Header */}
          <div className="pb-5 border-b border-surface-container">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-primary text-on-primary font-label-sm text-xs rounded uppercase font-bold tracking-wider">
                  {event.category}
                </span>
                <span className="px-2.5 py-1 bg-surface-container-high text-on-surface font-label-sm text-xs rounded font-medium">
                  {event.department}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full font-label-sm text-xs font-bold ${
                  event.registrationStatus === 'Open'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-secondary-fixed text-on-secondary-fixed'
                }`}
              >
                Status: {event.registrationStatus}
              </span>
            </div>

            <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold tracking-tight mt-3 leading-tight">
              {event.title}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-body-sm">
              <span>Organized by: <strong>{event.organizingClub}</strong></span>
              <span>•</span>
              <span>Ref ID: <code className="bg-surface-container px-1 py-0.5 rounded text-primary">{event.id}</code></span>
            </div>
          </div>

          {/* Logistics Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 bg-surface-container-low p-4 sm:p-6 rounded-lg border border-amber-900/5">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                  calendar_today
                </span>
                <div>
                  <span className="font-label-sm text-[10px] text-outline uppercase block font-bold">
                    Event Schedule
                  </span>
                  <p className="font-title-md text-sm text-on-surface">
                    {formatEventDateRange(event.startDate, event.endDate)}
                  </p>
                  <p className="text-on-surface-variant">
                    {event.startTime} – {event.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                  pin_drop
                </span>
                <div>
                  <span className="font-label-sm text-[10px] text-outline uppercase block font-bold">
                    Campus Location & Room
                  </span>
                  <p className="font-title-md text-sm text-on-surface">
                    {event.venue}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                  hourglass_top
                </span>
                <div>
                  <span className="font-label-sm text-[10px] text-outline uppercase block font-bold">
                    Registration Deadline
                  </span>
                  <p className="font-title-md text-sm text-on-surface">
                    {event.registrationDeadline
                      ? formatEventDateRange(event.registrationDeadline)
                      : 'Not specified'}
                  </p>
                  {daysLeft !== null && daysLeft >= 0 && (
                    <span className="text-secondary font-bold">
                      {daysLeft === 0
                        ? 'Closing today!'
                        : `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                  school
                </span>
                <div>
                  <span className="font-label-sm text-[10px] text-outline uppercase block font-bold">
                    Faculty Coordinator In-Charge
                  </span>
                  <p className="font-title-md text-sm text-on-surface">
                    {event.facultyCoordinator}
                  </p>
                  {event.coordinatorContact && (
                    <p className="text-primary hover:underline">
                      {event.coordinatorContact}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 text-xs sm:text-sm text-on-surface-variant font-body-sm leading-relaxed">
            <div>
              <h3 className="font-title-md text-sm text-primary font-bold mb-1">
                Notice & Event Description
              </h3>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>

            <div className="p-3.5 bg-surface-container rounded border-l-4 border-primary">
              <h4 className="font-title-md text-xs text-primary font-bold uppercase mb-0.5">
                Eligibility & Prerequisites
              </h4>
              <p className="text-xs">{event.eligibility}</p>
            </div>

            {event.prizes && (
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-base">
                  emoji_events
                </span>
                <span>
                  <strong>Awards & Recognition:</strong> {event.prizes}
                </span>
              </div>
            )}
          </div>

          {/* Stamp & Verification */}
          <div className="mt-8 pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RubberStamp label="AUTONOMOUS" subLabel="APPROVED" code="EEC 2025" />
              <div className="text-xs text-outline">
                <span className="block font-medium text-on-surface">
                  Vetted by Student Affairs
                </span>
                <span>Official Campus Notice</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-xs transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                {copiedLink ? 'done' : 'share'}
              </span>
              <span>{copiedLink ? 'Link Copied!' : 'Share Notice'}</span>
            </button>
          </div>

          {/* Primary Action Buttons Bar */}
          <div className="mt-6 pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowOdModal(true)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-4 py-2.5 rounded font-title-md text-xs sm:text-sm border border-amber-300 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-amber-800">
                assignment_ind
              </span>
              <span>Apply for OD (On-Duty)</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                to="/events"
                className="px-4 py-2.5 rounded font-title-md text-xs sm:text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                All Notices
              </Link>

              {isRegistrationOpen && event.registrationUrl ? (
                <button
                  type="button"
                  onClick={() => openExternalUrl(event.registrationUrl)}
                  className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center gap-1.5 font-bold"
                >
                  <span>Official Registration Portal</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="bg-surface-container-high text-outline px-4 py-2.5 rounded font-title-md text-xs sm:text-sm cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <OdApplicationModal
        isOpen={showOdModal}
        onClose={() => setShowOdModal(false)}
        eventTitle={event.title}
        department={event.department}
        eventDates={formatEventDateRange(event.startDate, event.endDate)}
      />
    </div>
  );
};
