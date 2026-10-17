import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { MaskingTape } from '../components/common/MaskingTape';
import { useAuth } from '../context/AuthContext';

export const LoginSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
        <div
          className="rounded-lg p-4 sm:p-8 min-h-[600px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)] flex flex-col justify-between"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
          }}
        >
          {/* Top Wooden Board Plaque Header */}
          <div className="relative bg-surface-container-low/95 backdrop-blur-sm rounded-lg p-5 sm:p-6 shadow-[0_12px_28px_rgba(60,30,10,0.45)] mb-6 border border-amber-900/10 text-center">
            <Pushpin color="brass" size="md" className="absolute -top-3 left-6" />
            <Pushpin color="brass" size="md" className="absolute -top-3 right-6" />

            <div className="flex flex-col items-center">
              <img
                src={appConfig.emblemUrl}
                alt="Easwari Engineering College Seal"
                className="h-12 w-auto object-contain mb-2"
              />
              <span className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold">
                {appConfig.collegeName}
              </span>
              <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold mt-1">
                E.A.S.E. Portal Gateway
              </h1>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant max-w-lg mt-1">
                Authorized digital gateway for Easwari Engineering College notices, events, and approvals.
              </p>
            </div>
          </div>

          {/* Active Session Notification (if already logged in) */}
          {isAuthenticated && user && (
            <div className="max-w-2xl mx-auto w-full mb-6 p-4 bg-amber-50/95 border border-amber-300 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">
                  account_circle
                </span>
                <div>
                  <span className="text-xs font-bold text-primary block">
                    Active Session: {user.name} ({user.role.toUpperCase()})
                  </span>
                  <span className="text-[11px] text-amber-900">
                    You are already authenticated. You can enter the board or switch accounts.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/"
                  className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded font-title-md text-xs shadow-sm transition-colors"
                >
                  Enter Notice Board →
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-surface-container hover:bg-surface-container-high text-rose-900 border border-rose-300 px-3 py-1.5 rounded font-title-md text-xs transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}

          {/* Two Separate Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-3xl mx-auto w-full my-auto">
            {/* 1. Student Portal Card */}
            <div
              className="relative group bg-[#FFFDF7] rounded-sm p-6 sm:p-7 pt-8 shadow-[0_12px_30px_-5px_rgba(50,20,5,0.4),0_4px_8px_rgba(0,0,0,0.15)] border border-amber-900/10 transform md:-rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
            >
              <Pushpin color="brass" size="md" className="absolute -top-3 left-6 z-20" />
              <MaskingTape color="amber" width="w-20" className="absolute -top-3 right-6 z-10" />

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-label-sm text-[10px] uppercase font-bold tracking-wider">
                    Student Access
                  </span>
                  <span className="material-symbols-outlined text-emerald-700 text-2xl">
                    school
                  </span>
                </div>

                <h2 className="font-display-lg text-xl sm:text-2xl text-primary font-serif font-bold mt-3">
                  Student Portal
                </h2>
                <p className="font-title-md text-xs text-secondary italic font-serif mt-0.5">
                  Discover campus events and manage your registrations.
                </p>

                <p className="font-body-sm text-xs text-on-surface-variant mt-3 leading-relaxed">
                  Sign in with your student registration number or college email to access symposiums, hackathons, and OD forms.
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-on-surface-variant font-body-sm">
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-700 text-sm">
                      check_circle
                    </span>
                    <span>Browse and register for campus events</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-700 text-sm">
                      check_circle
                    </span>
                    <span>Apply for On-Duty (OD) attendance credit</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-700 text-sm">
                      check_circle
                    </span>
                    <span>Follow club recruitment and auditions</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => navigate('/login/student')}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary py-2.5 px-4 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <span>Student Login</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* 2. Admin Portal Card */}
            <div
              className="relative group bg-[#FFF9F3] rounded-sm p-6 sm:p-7 pt-8 shadow-[0_12px_30px_-5px_rgba(50,20,5,0.4),0_4px_8px_rgba(0,0,0,0.15)] border-t-4 border-t-primary border-x border-b border-amber-900/10 transform md:rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
            >
              <Pushpin color="navy" size="md" className="absolute -top-3 right-6 z-20" />
              <MaskingTape color="rose" width="w-20" className="absolute -top-3 left-6 z-10" />

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold tracking-wider">
                    Staff & Admin
                  </span>
                  <span className="material-symbols-outlined text-primary text-2xl">
                    admin_panel_settings
                  </span>
                </div>

                <h2 className="font-display-lg text-xl sm:text-2xl text-primary font-serif font-bold mt-3">
                  Admin Portal
                </h2>
                <p className="font-title-md text-xs text-primary italic font-serif mt-0.5">
                  For faculty, staff coordinators & administrators.
                </p>

                <p className="font-body-sm text-xs text-on-surface-variant mt-3 leading-relaxed">
                  Sign in with faculty or staff credentials to publish circulars, manage event submissions, approve OD requests, and oversee notice board dispatches.
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-on-surface-variant font-body-sm">
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">
                      verified
                    </span>
                    <span>Review & approve pending event posters</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">
                      verified
                    </span>
                    <span>Publish COE circulars and timetables</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-700 text-sm">
                      assignment_ind
                    </span>
                    <span>
                      <span className="font-semibold text-blue-900">Staff:</span> Review & approve student OD attendance requests
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">
                      verified
                    </span>
                    <span>Manage club registrations & advisories</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => navigate('/login/admin')}
                  className="w-full bg-[#1c3551] hover:bg-[#28496e] text-white py-2.5 px-4 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <span>Admin Login</span>
                  <span className="material-symbols-outlined text-base">lock</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Security / Return Action */}
          <div className="mt-8 text-center">
            {isAuthenticated ? (
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-amber-100 hover:text-white font-title-md bg-[#452712]/70 px-4 py-2 rounded-full transition-colors backdrop-blur-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Return to Campus Notice Board</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-100/90 font-title-md bg-[#452712]/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-amber-800/30">
                <span className="material-symbols-outlined text-sm text-amber-300">lock</span>
                <span>Authentication Required to Access Internal Campus Notices</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
