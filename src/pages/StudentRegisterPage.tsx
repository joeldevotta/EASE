import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { studentAuthApi } from '../services/studentAuthApi';

export const StudentRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!/^[A-Za-z0-9/-]{5,40}$/.test(registerNumber.trim())) {
      setError('Enter a valid register number (5–40 letters, numbers, / or -).');
      return;
    }
    if (password.length < 10 || password.length > 72) {
      setError('Use a password between 10 and 72 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const result = await studentAuthApi.register(registerNumber, password);
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#84532B] p-4 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-xl p-4 sm:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-2xl">
        <article className="relative bg-[#FFFEFA] rounded-sm p-6 sm:p-10 shadow-xl">
          <Pushpin color="brass" size="lg" className="absolute -top-3.5 left-10" />
          <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-10" />
          <div className="flex items-center justify-between border-b border-amber-900/15 pb-3">
            <Link to="/login/student" className="text-xs text-amber-900 hover:underline">← Student login</Link>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-900 bg-emerald-100 rounded px-2 py-1">Create Account</span>
          </div>
          <div className="text-center pt-5 pb-3">
            <img src={appConfig.emblemUrl} alt="College seal" className="h-12 w-auto object-contain mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-amber-900">{appConfig.collegeName}</p>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">Student Registration</h1>
            <p className="text-sm text-slate-600 mt-2">Create your E.A.S.E. password using your college register number.</p>
          </div>
          {error && <div role="alert" className="my-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
          {message ? (
            <div role="status" className="my-4 rounded border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
              <strong className="block mb-1">Registration submitted</strong>{message}
              <button onClick={() => navigate('/login/student')} className="mt-3 block font-bold underline">Return to student login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="newRegisterNumber" className="block text-xs uppercase font-bold text-slate-700 mb-1">College Register Number</label>
                <input id="newRegisterNumber" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} autoComplete="username" required maxLength={40} className="w-full rounded border border-amber-900/20 bg-amber-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-700" placeholder="Enter register number" />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-xs uppercase font-bold text-slate-700 mb-1">Create Password</label>
                <input id="newPassword" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required minLength={10} maxLength={72} className="w-full rounded border border-amber-900/20 bg-amber-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-700" placeholder="At least 10 characters" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs uppercase font-bold text-slate-700 mb-1">Confirm Password</label>
                <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" required className="w-full rounded border border-amber-900/20 bg-amber-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-700" placeholder="Re-enter password" />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} /> Show password while typing</label>
              <p className="text-xs leading-relaxed text-amber-900 bg-amber-50 border border-amber-200 rounded p-3">For account safety, registrations remain pending until an administrator approves them. Register number alone does not prove student identity.</p>
              <button disabled={loading} className="w-full rounded bg-slate-900 text-white py-3 font-bold text-sm disabled:opacity-60">{loading ? 'Submitting…' : 'Create student account →'}</button>
            </form>
          )}
          <p className="mt-5 text-center text-[10px] text-slate-500">Passwords are hashed by the backend before storage.</p>
        </article>
      </div>
    </div>
  );
};
