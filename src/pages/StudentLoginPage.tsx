import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { validateStudentLogin } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { DEMO_STUDENT_ACCOUNTS } from '../services/authService';

export const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginStudent, user: currentUser, isAuthenticated } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validate = () => {
    const result = validateStudentLogin(identifier, password);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleFillDemo = (demoAccountIndex: number) => {
    const demo = DEMO_STUDENT_ACCOUNTS[demoAccountIndex] || DEMO_STUDENT_ACCOUNTS[0];
    setIdentifier(demo.identifier);
    setPassword(demo.password);
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

    // Simulate realistic campus network latency
    setTimeout(() => {
      const result = loginStudent(identifier, password);

      if (!result.success) {
        setIsLoading(false);
        setAuthError(result.error || 'Invalid credentials.');
        return;
      }

      setIsLoading(false);
      setDemoNotice(
        `Welcome, ${result.user?.name}! Authentication verified. Redirecting to Campus Notice Board...`
      );

      // Redirect user to the page they originally requested, or the Home Notice Board
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
          {/* Paper Login Card */}
          <article className="relative bg-[#FFFEFA] rounded-sm p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,15,5,0.45)] border border-amber-900/10">
            {/* Top Pushpins */}
            <Pushpin color="brass" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-10" />

            {/* Back link */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs text-outline hover:text-primary font-title-md transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Login Selection</span>
              </Link>

              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-label-sm text-[10px] uppercase font-bold tracking-wider">
                Student Portal
              </span>
            </div>

            {/* Header / Branding */}
            <div className="text-center pt-4 pb-2">
              <img
                src={appConfig.emblemUrl}
                alt="Easwari Engineering College Seal"
                className="h-12 w-auto object-contain mx-auto mb-2"
              />
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold block">
                {appConfig.collegeName}
              </span>
              <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold mt-1">
                Student Login
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto mt-1 leading-relaxed">
                Access campus events, registrations, and academic announcements.
              </p>
            </div>

            {/* Existing Active Session Banner (if already logged in) */}
            {isAuthenticated && currentUser && (
              <div className="my-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-700 text-base">info</span>
                  <span>Active session: <strong>{currentUser.name}</strong></span>
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
                  <span className="font-bold block text-red-950">Authentication Failed</span>
                  <p className="mt-0.5 text-[11px] text-red-800 leading-snug">{authError}</p>
                </div>
              </div>
            )}

            {/* Success Demo Notice Banner */}
            {demoNotice && (
              <div className="my-3 p-3.5 bg-emerald-50 rounded border border-emerald-300 text-xs text-emerald-950 animate-in fade-in space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-base">
                    check_circle
                  </span>
                  <span className="font-bold text-emerald-900">Signed In Successfully</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">{demoNotice}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-title-md">
              {/* Register Number or Email */}
              <div>
                <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
                  Student Register Number or College Email *
                </label>
                <div className="relative flex items-center bg-surface-container-low rounded border border-amber-900/15 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-inner">
                  <span className="material-symbols-outlined text-outline text-base ml-3 mr-2">
                    badge
                  </span>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                      if (authError) setAuthError(null);
                    }}
                    placeholder="e.g., 310621104001 or student@easwari.ac.in"
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
                    Password *
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
                    key
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter student password"
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

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-primary focus:ring-primary border-amber-900/20 w-4 h-4"
                  />
                  <span className="text-xs text-on-surface-variant font-medium">
                    Remember me on this browser
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary py-2.5 px-4 rounded font-title-md text-xs sm:text-sm shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Student Access...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Student</span>
                      <span className="material-symbols-outlined text-sm">login</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Demo Credentials Instruction Box */}
            <div className="mt-6 pt-4 border-t border-surface-container bg-[#FFFDF7] p-3.5 rounded border border-amber-900/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">
                    vpn_key
                  </span>
                  <span>Demo Student Credentials:</span>
                </span>
                <span className="text-[10px] text-amber-800 font-bold px-1.5 py-0.5 bg-amber-100 rounded">
                  Password: student123
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-2.5">
                Credential validation is strictly active. Choose a demo student account or click to autofill:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {DEMO_STUDENT_ACCOUNTS.map((acc, idx) => (
                  <div
                    key={acc.identifier}
                    className="p-2 rounded bg-surface-container-low border border-amber-900/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-bold text-on-surface truncate">{acc.name}</div>
                      <div className="text-outline text-[10px] font-mono mt-0.5">
                        ID: {acc.identifier}
                      </div>
                      <div className="text-outline text-[10px] truncate">{acc.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFillDemo(idx)}
                      className="mt-2 text-primary hover:text-primary-container font-bold text-[10px] text-left underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Autofill this account</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Mode Notice */}
            <div className="mt-4 pt-3 border-t border-surface-container text-center">
              <span className="text-[10px] text-outline uppercase font-semibold">
                Client Session Guard • Protected by sessionStorage • Java Spring Boot Ready
              </span>
            </div>
          </article>
        </div>
      </div>

      {/* Forgot Password Instructional Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl border border-amber-900/10">
            <Pushpin color="red" size="sm" className="absolute -top-2 left-6" />

            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline-sm text-base text-primary font-bold">
                Student Password Recovery
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
                Student authentication passwords for Easwari Engineering College are synchronized with the <strong>Central ERP & Examination Management Portal</strong>.
              </p>
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-950">
                <span className="font-bold block text-amber-900">Recovery Instructions:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px]">
                  <li>Reset your master student password via the official SRM Easwari ERP student login portal.</li>
                  <li>Alternatively, visit <strong>Main Block Room 104 (Student Affairs Desk)</strong> with your physical RFID Student ID Card.</li>
                  <li>Call Campus Helpline: <strong>{appConfig.helplinePhone}</strong> (Ext: {appConfig.helplineExt}).</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="bg-primary text-on-primary px-4 py-1.5 rounded text-xs font-title-md"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
