import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { RubberStamp } from '../components/common/RubberStamp';
import { validateAdminLogin } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { authService, DEMO_ADMIN_ACCOUNTS } from '../services/authService';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginOfficial, user: currentUser, isAuthenticated } = useAuth();

  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validate = () => {
    const result = validateAdminLogin(adminIdentifier, password);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleFillDemo = (identifier: string, pass: string) => {
    setAdminIdentifier(identifier);
    setPassword(pass);
    setErrors({});
    setAuthError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoNotice(null);
    setAuthError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginOfficial(adminIdentifier, password);

      if (!result.success) {
        setIsLoading(false);
        setAuthError(result.error || 'Invalid credentials.');
        return;
      }

      setIsLoading(false);
      const roleLabel = result.user?.role === 'admin' ? 'Administrator' : 'Staff / Faculty Coordinator';
      setDemoNotice(
        `${roleLabel} clearance verified for ${result.user?.name}. Redirecting to Campus Notice Board...`
      );

      // Redirect user to destination or the Home Notice Board
      setTimeout(() => {
        const destination = (location.state as { from?: string })?.from || '/';
        navigate(destination, { replace: true });
      }, 700);
    }, 600);
  };

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen py-8 sm:py-12 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
        <div
          className="rounded-lg p-4 sm:p-8 min-h-[600px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)] flex flex-col justify-between"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
          }}
        >
          {/* Formal Admin Card with Navy Perimeter Header */}
          <article className="relative bg-[#FFF9F3] rounded-sm p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,15,5,0.45)] border-t-4 border-t-primary border-x border-b border-amber-900/10">
            {/* Top Navy Metallic Pushpins */}
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 right-10" />

            {/* Back link */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs text-outline hover:text-primary font-title-md transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Login Selection</span>
              </Link>

              <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold tracking-wider">
                Staff & Admin
              </span>
            </div>

            {/* Header / Branding */}
            <div className="text-center pt-4 pb-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img
                  src={appConfig.emblemUrl}
                  alt="Easwari Engineering College Seal"
                  className="h-12 w-auto object-contain"
                />
                <RubberStamp
                  label="COE & DEAN"
                  subLabel="AUTHORIZED"
                  code="EEC ADMIN"
                  color="primary"
                  className="scale-[0.6] origin-center -my-3"
                />
              </div>

              <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold block">
                {appConfig.collegeName}
              </span>
              <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold mt-1">
                Administrator Login
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto mt-1 leading-relaxed">
                Sign in to manage campus events, approve pending notices, and publish official announcements.
              </p>
            </div>

            {/* Existing Active Session Banner (if already logged in) */}
            {isAuthenticated && currentUser && (
              <div className="my-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-700 text-base">verified_user</span>
                  <span>Active session: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
                </div>
                <Link
                  to="/"
                  className="font-bold underline text-blue-800 hover:text-blue-950 text-[11px]"
                >
                  Enter Notice Board →
                </Link>
              </div>
            )}

            {/* Authentication Error Banner */}
            {authError && (
              <div className="my-3 p-3 bg-red-50 rounded border border-red-300 text-xs text-red-900 animate-in fade-in flex items-start gap-2">
                <span className="material-symbols-outlined text-red-700 text-base mt-0.5 shrink-0">
                  gpp_bad
                </span>
                <div>
                  <span className="font-bold block text-red-950">Administrative Clearance Failed</span>
                  <p className="mt-0.5 text-[11px] text-red-800 leading-snug">{authError}</p>
                </div>
              </div>
            )}

            {/* Success Demo Notice Banner */}
            {demoNotice && (
              <div className="my-3 p-3.5 bg-blue-50 rounded border border-blue-300 text-xs text-blue-950 animate-in fade-in space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    verified_user
                  </span>
                  <span className="font-bold text-primary">Authority Authenticated</span>
                </div>
                <p className="text-[11px] text-blue-900 leading-snug">{demoNotice}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-title-md">
              {/* Admin Email or Employee ID */}
              <div>
                <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                  Admin Email or Employee ID *
                </label>
                <div className="relative flex items-center bg-surface-container-low rounded border border-amber-900/15 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-inner">
                  <span className="material-symbols-outlined text-outline text-base ml-3 mr-2">
                    badge
                  </span>
                  <input
                    type="text"
                    value={adminIdentifier}
                    onChange={(e) => {
                      setAdminIdentifier(e.target.value);
                      if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                      if (authError) setAuthError(null);
                    }}
                    placeholder="e.g., EEC-FAC-1042 or faculty@easwari.ac.in"
                    className="w-full bg-transparent px-2 py-2.5 text-body-sm text-on-surface focus:outline-none"
                    autoComplete="username"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-red-600 font-bold text-[11px] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">error</span>
                    <span>{errors.identifier}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-outline uppercase text-[11px] font-bold">
                    Admin Security Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-secondary hover:underline text-[11px] font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center bg-surface-container-low rounded border border-amber-900/15 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-inner">
                  <span className="material-symbols-outlined text-outline text-base ml-3 mr-2">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter administrator password"
                    className="w-full bg-transparent px-2 py-2.5 text-body-sm text-on-surface focus:outline-none"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 text-outline hover:text-on-surface transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 font-bold text-[11px] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">error</span>
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1c3551] hover:bg-[#28496e] text-white py-2.5 px-4 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Administrative Authority...</span>
                    </>
                  ) : (
                    <>
                      <span>Admin Login</span>
                      <span className="material-symbols-outlined text-sm">lock_open</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Demo Credentials Instruction Box */}
            <div className="mt-6 pt-4 border-t border-surface-container bg-[#FFFDF7] p-3.5 rounded border border-amber-900/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">
                    key
                  </span>
                  <span>Staff & Admin Clearance Demo Credentials:</span>
                </span>
                <span className="text-[10px] text-blue-900 font-bold px-1.5 py-0.5 bg-blue-100 rounded">
                  Staff: staff123 • Admin: admin123
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-2.5">
                Role-based authority active. Staff can create and submit events. Admins review and approve submissions:
              </p>

              {/* Staff Accounts Section */}
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                  Staff Role (Can Create & Manage Events)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {authService.getDemoStaffAccounts().map((acc) => (
                    <div
                      key={acc.identifier}
                      className="p-2 rounded bg-surface-container-low border border-amber-900/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-primary truncate">{acc.name}</div>
                        <div className="text-outline text-[10px] font-mono mt-0.5">
                          ID: {acc.identifier}
                        </div>
                        <div className="text-outline text-[10px] truncate">{acc.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFillDemo(acc.identifier, acc.password)}
                        className="mt-2 text-emerald-800 hover:text-emerald-950 font-bold text-[10px] text-left underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Autofill Staff Coordinator</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Accounts Section */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
                  Admin Role (Can Approve / Reject Submissions)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {authService.getDemoAdminAccounts().map((acc) => (
                    <div
                      key={acc.identifier}
                      className="p-2 rounded bg-surface-container-low border border-amber-900/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-primary truncate">{acc.name}</div>
                        <div className="text-outline text-[10px] font-mono mt-0.5">
                          Emp ID: {acc.identifier}
                        </div>
                        <div className="text-outline text-[10px] truncate">{acc.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFillDemo(acc.identifier, acc.password)}
                        className="mt-2 text-[#1c3551] hover:text-[#28496e] font-bold text-[10px] text-left underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Autofill Administrator</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Development Mode Notice */}
            <div className="mt-4 pt-3 border-t border-surface-container text-center">
              <span className="text-[10px] text-outline uppercase font-semibold">
                Protected Faculty Zone • Session Active in sessionStorage • Spring Boot RBAC Ready
              </span>
            </div>
          </article>
        </div>
      </div>

      {/* Admin Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl border border-amber-900/10">
            <Pushpin color="navy" size="sm" className="absolute -top-2 left-6" />

            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline-sm text-base text-primary font-bold">
                Faculty & Admin Credential Reset
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="mt-3 text-xs text-on-surface-variant font-body-sm space-y-2 leading-relaxed">
              <p>
                Administrative accounts are issued exclusively to faculty coordinators, department heads, and COE personnel by the <strong>Easwari Central Information Cell</strong>.
              </p>
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-950">
                <span className="font-bold block text-amber-900">Assistance Contacts:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px]">
                  <li>Email Campus IT Administrator: <code>admin.support@easwari.ac.in</code></li>
                  <li>Campus Internal Phone Extension: <strong>204</strong> (Office of Dean of Student Affairs)</li>
                  <li>Physical Helpdesk: Central IT Centre, Library Block 2nd Floor</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="bg-primary text-on-primary px-4 py-1.5 rounded text-xs font-title-md"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
