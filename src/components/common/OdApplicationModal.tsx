import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pushpin } from './Pushpin';

interface OdApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string;
  department?: string;
  eventDates?: string;
}

export const OdApplicationModal: React.FC<OdApplicationModalProps> = ({
  isOpen,
  onClose,
  eventTitle = 'Campus Event / Symposium',
  department = 'Department',
  eventDates = 'Upcoming Date',
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOpenOdPortal = () => {
    onClose();
    navigate(`/od-portal?event=${encodeURIComponent(eventTitle)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="od-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF7] rounded-lg shadow-2xl p-6 border border-amber-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative pushpins */}
        <Pushpin color="navy" className="absolute -top-3 left-6" />
        <Pushpin color="brass" className="absolute -top-3 right-6" />

        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              assignment_ind
            </span>
            <div>
              <h3
                id="od-modal-title"
                className="font-headline-sm text-headline-sm text-primary font-serif font-bold"
              >
                On-Duty (OD) Student Application
              </h3>
              <p className="font-label-sm text-xs text-outline">
                Easwari Autonomous Attendance Regulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="bg-surface-container-low p-3.5 rounded border-l-4 border-primary">
            <span className="font-label-sm text-[11px] uppercase text-outline font-bold">
              Target Activity for OD
            </span>
            <p className="font-title-md text-sm text-on-surface mt-0.5 font-bold">
              {eventTitle}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant font-body-sm">
              <span>🏛️ {department}</span>
              <span>📅 {eventDates}</span>
            </div>
          </div>

          <div className="bg-amber-50 p-3.5 rounded border border-amber-200/60 text-xs text-amber-950 space-y-2">
            <p className="font-title-md text-amber-900 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-amber-700">
                info
              </span>
              Standard OD Guidelines:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-on-surface-variant leading-relaxed">
              <li>
                OD applications must be submitted at least <strong>48 hours</strong> prior to event commencement.
              </li>
              <li>
                Maintain an existing attendance threshold of at least <strong>75%</strong> in all registered theory and lab courses.
              </li>
              <li>
                Participation or prize certificates must be produced to your Faculty Advisor within 3 days post-event to confirm biometric attendance credit.
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
            <span className="font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-700">verified</span>
              <span>E.A.S.E. Digital OD Portal Active</span>
            </span>
            <p className="mt-0.5 text-[11px] text-emerald-800 leading-snug">
              Launch the integrated student OD portal to lodge your application, track endorsements, and generate your reference ID with prefilled event details.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-surface-container flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded font-title-md text-body-sm text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleOpenOdPortal}
            className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded font-title-md text-body-sm shadow-[0_2px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center gap-1.5 font-bold"
          >
            <span>Launch OD Portal</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
