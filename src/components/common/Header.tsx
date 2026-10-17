import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { appConfig } from '../../config/appConfig';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    } else {
      navigate(`/events?q=${encodeURIComponent(localSearch)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const baseNavLinks = [
    { label: 'Notice Board', path: '/' },
    { label: 'All Notices & Events', path: '/events' },
    { label: 'Campus Calendar', path: '/calendar' },
    { label: 'Club Fair', path: '/clubs' },
    { label: 'Academic Circulars', path: '/announcements' },
    { label: 'OD Portal', path: '/od-portal', studentOnly: true },
    { label: 'OD Approval Desk', path: '/staff-od-review', staffOnly: true },
    { label: 'Staff Event Management', path: '/submit', staffOnly: true },
    { label: 'About E.A.S.E.', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Role-based navigation visibility
  const navLinks = baseNavLinks.filter((link) => {
    if (link.studentOnly) {
      return isAuthenticated && user?.role === 'student';
    }
    if (link.staffOnly) {
      return isAuthenticated && (user?.role === 'staff' || user?.role === 'admin');
    }
    return true;
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-[0_4px_20px_rgba(92,56,32,0.08)]">
      {/* 1. Urgent Dispatch Notification Marquee */}
      <div className="bg-primary text-on-primary px-3 sm:px-gutter py-1">
        <div className="w-full flex items-center justify-between gap-gutter">
          <div className="flex items-center gap-space-sm overflow-hidden whitespace-nowrap">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg shrink-0">
              campaign
            </span>
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-tertiary-fixed-dim font-bold shrink-0">
              Urgent Dispatch:
            </span>
            <div className="overflow-hidden relative w-full text-xs">
              <span className="font-body-sm text-[12px] text-on-primary truncate inline-block">
                🏛️ Odd Semester End Exam Schedule Published • 🚀 HackEaswari 2025 Registrations Open until Friday • 📌 Department of CSE National Symposium Paper Submission Closes Tomorrow
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-space-md font-label-sm text-[11px] shrink-0">
            <span className="text-primary-fixed-dim">
              Autonomous Institution • Anna University Affiliated
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Identity & Search Bar */}
      <div className="h-16 sm:h-20 w-full px-3 sm:px-gutter flex items-center justify-between gap-3 sm:gap-gutter bg-surface-container-low border-b border-surface-container">
        <Link to="/" className="flex items-center gap-2 sm:gap-space-md shrink-0 group">
          <img
            alt="Easwari Engineering College Emblem"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            src={appConfig.emblemUrl}
          />
          <div className="w-[1px] h-7 sm:h-8 bg-outline-variant/60 mx-0.5 sm:mx-1" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-lg sm:text-headline-sm tracking-tight text-primary leading-none font-serif font-bold">
              E.A.S.E.
            </span>
            <span className="font-label-sm text-[9px] sm:text-[10px] tracking-wider uppercase text-tertiary font-bold mt-0.5">
              Notice Board • Easwari Engineering College (Autonomous)
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center bg-surface-container-lowest rounded-lg px-space-md py-1.5 shadow-[inset_0_2px_4px_rgba(117,74,47,0.08)] border border-amber-900/10 focus-within:border-primary"
          >
            <span className="material-symbols-outlined text-outline text-lg mr-space-sm">
              search
            </span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
              placeholder="Search notices, clubs, hackathons..."
              aria-label="Search notice board"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  if (onSearch) onSearch('');
                }}
                className="text-outline hover:text-on-surface p-0.5"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </form>
        </div>

        {/* Right CTA and Session State */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <>
              {/* User Identity Chip */}
              <div
                className="hidden md:flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded font-label-md text-xs border border-amber-900/10 text-on-surface shadow-inner"
                title={`Signed in as ${user.name} (${user.department})`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-amber-600'
                      : user.role === 'staff'
                      ? 'bg-blue-600'
                      : 'bg-emerald-600 animate-pulse'
                  }`}
                />
                <span className="font-bold text-primary capitalize">{user.role}:</span>
                <span className="truncate max-w-[110px] text-on-surface-variant font-medium">
                  {user.name.split(' ')[0]}
                </span>
              </div>

              {/* OD Portal Quick Action (Students Only) */}
              {user.role === 'student' && (
                <Link
                  to="/od-portal"
                  className="hidden lg:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 px-2.5 sm:px-3 py-1.5 rounded font-title-md text-xs sm:text-body-sm transition-all"
                  title="Student Duty Attendance Portal"
                >
                  <span className="material-symbols-outlined text-base text-amber-800">
                    assignment_ind
                  </span>
                  <span>OD Portal</span>
                </Link>
              )}

              {/* Pin Request Link (Staff & Admin Only - Hidden from Students) */}
              {(user.role === 'staff' || user.role === 'admin') && (
                <Link
                  to="/submit"
                  className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3 sm:px-3.5 py-1.5 rounded font-title-md text-xs sm:text-body-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all"
                  title="Create & Submit Campus Notice"
                >
                  <span className="material-symbols-outlined text-base text-tertiary-fixed-dim">
                    add_circle
                  </span>
                  <span>{user.role === 'staff' ? 'Post Notice' : 'Pin Request'}</span>
                </Link>
              )}

              {/* Staff OD Approval Desk Quick-Link */}
              {user.role === 'staff' && (
                <Link
                  to="/staff-od-review"
                  className="hidden lg:flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 px-2.5 sm:px-3 py-1.5 rounded font-title-md text-xs sm:text-body-sm transition-all"
                  title="Review & Approve Student OD Requests"
                >
                  <span className="material-symbols-outlined text-base text-blue-700">
                    assignment_ind
                  </span>
                  <span>OD Approvals</span>
                </Link>
              )}

              {/* Admin Review Desk (Admins Only) */}
              {user.role === 'admin' && (
                <Link
                  to="/admin-review"
                  className="hidden xl:flex items-center gap-1 bg-[#1c3551] hover:bg-[#28496e] text-white px-2.5 py-1.5 rounded font-label-md text-xs shadow-sm transition-colors"
                  title="Administrative Review Queue"
                >
                  <span className="material-symbols-outlined text-sm text-amber-300">
                    admin_panel_settings
                  </span>
                  <span>Review Desk</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-rose-900/10 hover:bg-rose-900/20 text-rose-900 border border-rose-900/20 px-2.5 sm:px-3 py-1.5 rounded font-title-md text-xs sm:text-body-sm transition-all"
                title="End current session and return to login"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span className="hidden sm:inline font-bold">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-primary px-3 sm:px-3.5 py-1.5 rounded font-title-md text-xs sm:text-body-sm border border-amber-900/15 shadow-sm transition-all"
              title="Student & Admin Portal Login"
            >
              <span className="material-symbols-outlined text-base">
                account_circle
              </span>
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Pinned Physical Ribbon Navigation */}
      <div className="w-full px-2 sm:px-gutter bg-surface-container flex items-center justify-between gap-gutter overflow-x-auto py-1.5 shadow-[0_1px_4px_rgba(92,56,32,0.05)] scrollbar-none">
        <nav
          className="flex items-center gap-1 sm:gap-space-xs shrink-0"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-2.5 sm:px-space-md py-1 font-title-md text-xs sm:text-body-sm rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-sm font-bold -translate-y-0.5'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`
              }
            >
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Review Desk Shortcut (Admins Only) */}
        {isAuthenticated && user?.role === 'admin' && (
          <div className="hidden md:flex items-center gap-2 shrink-0 pr-2">
            <Link
              to="/admin-review"
              className="text-[11px] font-title-md text-secondary hover:underline flex items-center gap-1 font-bold"
            >
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>Approvals Queue</span>
            </Link>
          </div>
        )}
      </div>

      {/* 4. Mobile Expandable Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-surface-container shadow-lg p-4 space-y-3 animate-in fade-in">
          {/* User Status in Mobile */}
          {isAuthenticated && user && (
            <div className="p-3 bg-surface-container rounded-lg flex items-center justify-between border border-amber-900/10">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    user.role === 'admin' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}
                />
                <div>
                  <span className="font-bold text-xs text-primary block truncate max-w-[180px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-outline uppercase font-semibold">
                    {user.role} • {user.department}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs text-rose-800 font-bold underline"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1 bg-surface-container px-3 py-2 rounded text-body-sm text-on-surface focus:outline-none"
              placeholder="Search notices, clubs, tags..."
            />
            <button
              type="submit"
              className="bg-primary text-on-primary px-3 py-2 rounded font-title-md text-body-sm"
            >
              Search
            </button>
          </form>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded bg-surface-container-low text-xs font-title-md text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {(user?.role === 'staff' || user?.role === 'admin') && (
                  <Link
                    to="/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded bg-primary text-on-primary text-xs font-title-md flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    <span>{user?.role === 'staff' ? 'Post Notice' : 'Pin Request'}</span>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin-review"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded bg-[#1c3551] text-white text-xs font-title-md flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                    <span>Review Desk</span>
                  </Link>
                )}

                {user?.role === 'staff' && (
                  <Link
                    to="/staff-od-review"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded bg-blue-700 text-white text-xs font-title-md flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">assignment_ind</span>
                    <span>OD Approval Desk</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="col-span-2 px-3 py-2 rounded bg-rose-50 text-rose-900 border border-rose-200 text-xs font-title-md flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Log Out of Session</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 px-3 py-2 rounded bg-primary text-on-primary text-xs font-title-md flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">account_circle</span>
                <span>Portal Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
