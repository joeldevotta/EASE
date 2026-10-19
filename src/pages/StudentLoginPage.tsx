import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { useAuth } from '../context/AuthContext';

export const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginStudent, user: currentUser, isAuthenticated } = useAuth();
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!registerNumber.trim() || !password) { setError('Enter your college register number and password.'); return; }
    setLoading(true);
    try {
      await loginStudent(registerNumber, password);
      const destination = (location.state as { from?: string })?.from || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#84532B] p-4 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-xl p-4 sm:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-2xl">
        <article className="relative bg-[#FFFEFA] rounded-sm p-6 sm:p-10 shadow-xl">
          <Pushpin color="brass" size="lg" className="absolute -top-3.5 left-10" />
          <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-10" />
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/15">
            <Link to="/login" className="text-xs text-amber-900 hover:underline">← Login selection</Link>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-900 bg-emerald-100 rounded px-2 py-1">Student Portal</span>
          </div>
          <div className="text-center pt-5 pb-3">
            <img src={appConfig.emblemUrl} alt="College seal" className="h-12 w-auto object-contain mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-amber-900">{appConfig.collegeName}</p>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">Student Login</h1>
            <p className="text-sm text-slate-600 mt-2">Sign in with your E.A.S.E. register number and password.</p>
          </div>
          {isAuthenticated && currentUser?.role === 'student' && <div className="my-3 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">Signed in as <strong>{currentUser.identifier}</strong>. <Link className="underline font-bold" to="/">Open notice board</Link></div>}
          {error && <div role="alert" className="my-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div><label htmlFor="registerNumber" className="block text-xs uppercase font-bold text-slate-700 mb-1">College Register Number</label><input id="registerNumber" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} autoComplete="username" required maxLength={40} className="w-full rounded border border-amber-900/20 bg-amber-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-700" placeholder="Enter register number" /></div>
            <div><label htmlFor="studentPassword" className="block text-xs uppercase font-bold text-slate-700 mb-1">Password</label><div className="flex rounded border border-amber-900/20 bg-amber-50 focus-within:ring-2 focus-within:ring-amber-700"><input id="studentPassword" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className="w-full bg-transparent px-3 py-3 text-sm outline-none" placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(v => !v)} className="px-3 text-xs font-bold text-amber-900">{showPassword ? 'Hide' : 'Show'}</button></div></div>
            <button disabled={loading} className="w-full rounded bg-slate-900 text-white py-3 font-bold text-sm disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in as student →'}</button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">New to E.A.S.E.? <Link to="/register/student" className="font-bold text-amber-900 underline">Create a student account</Link></p>
          <p className="mt-5 border-t border-amber-900/15 pt-3 text-center text-[10px] text-slate-500">Student passwords are verified by the E.A.S.E. backend, not this page.</p>
        </article>
      </div>
    </div>
  );
};
