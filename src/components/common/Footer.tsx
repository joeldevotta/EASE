import React from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../../config/appConfig';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  stats?: {
    totalEvents: number;
    hackathons: number;
    clubs: number;
    verifiedPercentage: string;
  };
}

export const Footer: React.FC<FooterProps> = ({
  stats = {
    totalEvents: 24,
    hackathons: 4,
    clubs: 22,
    verifiedPercentage: '100%',
  },
}) => {
  const { user, isAuthenticated } = useAuth();
  return (
    <footer className="w-full bg-surface-container text-on-surface pt-8 pb-12 shadow-[inset_0_4px_12px_rgba(92,56,32,0.06)] border-t border-amber-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-gutter">
        {/* Pinned Stats Strip */}
        <div className="relative mb-12 bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg p-5 sm:p-6 shadow-[0_10px_25px_rgba(40,15,5,0.15)] border border-amber-900/10">
          {/* Decorative Corner Pins */}
          <div className="absolute -top-3 left-6 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-200 shadow-md" />
          <div className="absolute -top-3 right-6 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-200 shadow-md" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-surface-container-low rounded border border-amber-900/5">
              <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider block">
                Active Notices
              </span>
              <p className="font-display-lg text-2xl sm:text-headline-lg text-primary font-bold mt-1 font-serif">
                {stats.totalEvents}
              </p>
              <span className="font-body-sm text-[11px] text-secondary font-medium">
                Live on Board
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded border border-amber-900/5">
              <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider block">
                Flagship Sprints
              </span>
              <p className="font-display-lg text-2xl sm:text-headline-lg text-primary font-bold mt-1 font-serif">
                {stats.hackathons.toString().padStart(2, '0')}
              </p>
              <span className="font-body-sm text-[11px] text-on-surface-variant font-medium">
                Cash Awards & Grants
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded border border-amber-900/5">
              <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider block">
                Registered Clubs
              </span>
              <p className="font-display-lg text-2xl sm:text-headline-lg text-primary font-bold mt-1 font-serif">
                {stats.clubs}
              </p>
              <span className="font-body-sm text-[11px] text-on-surface-variant font-medium">
                Auditions Ongoing
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded border border-amber-900/5">
              <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider block">
                Vetted Notices
              </span>
              <p className="font-display-lg text-2xl sm:text-headline-lg text-primary font-bold mt-1 font-serif">
                {stats.verifiedPercentage}
              </p>
              <span className="font-body-sm text-[11px] text-emerald-700 font-medium">
                COE & Dean Verified
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">
                info
              </span>
              <span>
                Faculty Coordinator or Student Club Lead? Notices require Dean of Student Affairs approval before digital pinning.
              </span>
            </div>
            {isAuthenticated && (user?.role === 'staff' || user?.role === 'admin') && (
              <Link
                to="/submit"
                className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded font-title-md text-xs transition-colors shrink-0 shadow-sm"
              >
                Submit Notice for Approval
              </Link>
            )}
          </div>
        </div>

        {/* Multi-column collegiate directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
          {/* Col 1 */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Easwari Engineering College Logo"
                className="h-10 w-auto object-contain"
                src={appConfig.emblemUrl}
              />
              <div className="flex flex-col pl-1">
                <span className="font-headline-sm text-base text-primary leading-tight font-serif font-bold">
                  E.A.S.E. Bulletin
                </span>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline">
                  Easwari Engineering College
                </span>
              </div>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Official centralized campus discovery portal. Built for students, faculty coordinators, and administrative dispatches across all engineering departments.
            </p>
            <div className="flex items-center gap-1.5 font-label-sm text-xs text-secondary mt-1">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Autonomous Notice Board</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2">
            <span className="font-title-md text-sm text-primary font-bold">
              Quick Portals
            </span>
            <div className="flex flex-col gap-1.5 font-body-sm text-xs text-on-surface-variant">
              <Link to="/events" className="hover:text-primary transition-colors">
                Today's Pinned Notices
              </Link>
              <Link to="/calendar" className="hover:text-primary transition-colors">
                Academic Calendar
              </Link>
              <Link to="/events?category=Hackathon" className="hover:text-primary transition-colors">
                Hackathons & Sprints
              </Link>
              <Link to="/events?category=Workshop" className="hover:text-primary transition-colors">
                Technical Workshops
              </Link>
              <Link to="/clubs" className="hover:text-primary transition-colors">
                Student Clubs & Wings
              </Link>
              <Link to="/announcements" className="hover:text-primary transition-colors">
                Official COE Circulars
              </Link>
              {isAuthenticated && user?.role === 'student' && (
                <Link to="/od-portal" className="hover:text-primary transition-colors text-amber-900 font-bold">
                  Student OD Portal
                </Link>
              )}
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2">
            <span className="font-title-md text-sm text-primary font-bold">
              Department Hubs
            </span>
            <div className="grid grid-cols-2 gap-1.5 font-body-sm text-xs text-on-surface-variant">
              <Link to="/events?department=CSE" className="hover:text-primary transition-colors">
                CSE Portal
              </Link>
              <Link to="/events?department=IT" className="hover:text-primary transition-colors">
                IT Portal
              </Link>
              <Link to="/events?department=ECE" className="hover:text-primary transition-colors">
                ECE Portal
              </Link>
              <Link to="/events?department=EEE" className="hover:text-primary transition-colors">
                EEE Portal
              </Link>
              <Link to="/events?department=Mechanical" className="hover:text-primary transition-colors">
                Mech Engg
              </Link>
              <Link to="/events?department=Civil" className="hover:text-primary transition-colors">
                Civil Engg
              </Link>
              <Link to="/events?department=Robotics" className="hover:text-primary transition-colors">
                Robotics & AI
              </Link>
              <Link to="/events?department=MBA" className="hover:text-primary transition-colors">
                MBA Studies
              </Link>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-2">
            <span className="font-title-md text-sm text-primary font-bold">
              Campus Support
            </span>
            <div className="flex flex-col gap-1.5 font-body-sm text-xs text-on-surface-variant">
              {isAuthenticated && (user?.role === 'staff' || user?.role === 'admin') && (
                <Link to="/submit" className="hover:text-primary transition-colors font-medium text-amber-900">
                  Staff Event Submission Desk
                </Link>
              )}
              {isAuthenticated && user?.role === 'staff' && (
                <Link to="/staff-od-review" className="hover:text-primary transition-colors font-medium text-blue-800">
                  OD Request Approval Desk
                </Link>
              )}
              <Link to="/about" className="hover:text-primary transition-colors">
                About E.A.S.E. Guidelines
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Campus Directory & Helplines
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin-review" className="hover:text-primary transition-colors font-medium text-[#1c3551]">
                  Local Admin Review (Deanery)
                </Link>
              )}
              <div className="mt-2 pt-2 border-t border-surface-container-high text-[11px] text-outline">
                <span className="block font-semibold text-on-surface">Helpline: {appConfig.helplinePhone}</span>
                <span>Room 104, Main Block • Ramapuram</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution */}
        <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 font-body-sm text-xs text-on-surface-variant">
          <p>© 2025 {appConfig.collegeName}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/about" className="hover:text-primary transition-colors">
              Disclaimer
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              Administrative Guidelines
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Tech Support Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
