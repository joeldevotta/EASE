import React from 'react';
import { Navigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../services/authService';
import { Pushpin } from './Pushpin';
import { RubberStamp } from './RubberStamp';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Unauthenticated users are redirected immediately to /login
  // Using replace: true ensures the protected URL is replaced in history,
  // preventing back-button exposure of protected content.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 2. Role-based clearance check (e.g. Students attempting to open /admin-review)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="w-full bg-[#84532B] p-3 sm:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-[calc(100vh-14rem)] flex items-center justify-center py-10">
        <div className="max-w-xl w-full mx-auto">
          <article className="relative bg-[#FFF9F3] rounded-sm p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,15,5,0.45)] border-t-4 border-t-red-800 border-x border-b border-amber-900/15">
            {/* Pushpins */}
            <Pushpin color="red" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="red" size="lg" className="absolute -top-3.5 right-10" />

            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-900 font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">gpp_bad</span>
                <span>Restricted Section</span>
              </span>
              <span className="font-label-sm text-[11px] text-outline">
                Clearance: {allowedRoles.join(' / ').toUpperCase()}
              </span>
            </div>

            <div className="text-center pt-5 pb-3">
              <div className="flex justify-center mb-3">
                <RubberStamp
                  label="ACCESS DENIED"
                  subLabel={
                    allowedRoles.includes('student') && !allowedRoles.includes('admin')
                      ? 'STUDENT ONLY'
                      : allowedRoles.includes('admin') && !allowedRoles.includes('staff')
                      ? 'ADMIN ONLY'
                      : 'STAFF & ADMIN ONLY'
                  }
                  code="EEC-SEC-403"
                  color="secondary"
                />
              </div>

              <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold mt-2">
                {allowedRoles.includes('student') && !allowedRoles.includes('admin')
                  ? 'Student Portal Access Only'
                  : allowedRoles.includes('admin') && !allowedRoles.includes('staff')
                  ? 'Administrative Clearance Required'
                  : 'Staff Clearance Required'}
              </h1>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mt-2 leading-relaxed">
                You are currently signed in as <strong className="text-on-surface">{user.name}</strong> ({user.role.toUpperCase()} account).{' '}
                {allowedRoles.includes('student') && !allowedRoles.includes('admin')
                  ? 'The On-Duty (OD) Portal is an exclusive student service reserved for active enrolled students applying for academic attendance exemption.'
                  : allowedRoles.includes('admin') && !allowedRoles.includes('staff')
                  ? 'This administrative review queue is reserved strictly for Deanery, COE, and authorized campus leadership.'
                  : 'Notice submission and event management is restricted to authorized faculty coordinators and staff members.'}
              </p>
            </div>

            <div className="my-4 p-3 bg-amber-50 rounded border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-700 text-base mt-0.5">
                  info
                </span>
                <div>
                  <span className="font-bold block">
                    {allowedRoles.includes('student') && !allowedRoles.includes('admin')
                      ? 'Student On-Duty Portal'
                      : allowedRoles.includes('admin') && !allowedRoles.includes('staff')
                      ? 'Deanery / COE Clearance Required'
                      : 'Faculty / Staff Authorization'}
                  </span>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    {allowedRoles.includes('student') && !allowedRoles.includes('admin')
                      ? 'Staff and administrators review OD requests in their respective portals. To submit student OD requests, sign in with a registered student account.'
                      : allowedRoles.includes('admin') && !allowedRoles.includes('staff')
                      ? 'Staff members may submit events for approval, but final publishing review requires authorized Administrator credentials.'
                      : 'Students can browse and register for published events. To create or manage department notices, sign in with staff or faculty coordinator credentials.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Return to Campus Board</span>
              </Link>
              {allowedRoles.includes('student') && !allowedRoles.includes('admin') ? (
                <Link
                  to="/login/student"
                  className="inline-flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-primary px-4 py-2.5 rounded font-title-md text-xs sm:text-sm border border-amber-900/15 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">switch_account</span>
                  <span>Switch to Student Login</span>
                </Link>
              ) : (
                <Link
                  to="/login/admin"
                  className="inline-flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-primary px-4 py-2.5 rounded font-title-md text-xs sm:text-sm border border-amber-900/15 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">switch_account</span>
                  <span>Switch to Staff/Admin Login</span>
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return <>{children || <Outlet />}</>;
};
