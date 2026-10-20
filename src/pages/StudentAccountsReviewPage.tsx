import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';

type StudentApplication = { id: number; registerNumber: string; status: string; createdAt: string };

export const StudentAccountsReviewPage: React.FC = () => {
  const [username, setUsername] = useState('ease-admin');
  const [password, setPassword] = useState('');
  const [connected, setConnected] = useState(false);
  const [students, setStudents] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const apiBase = appConfig.apiBaseUrl.replace(/\/$/, '');
  const authHeader = () => 'Basic ' + btoa(username + ':' + password);

  const request = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(apiBase + path, {
      ...init,
      headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), Authorization: authHeader(), ...init.headers },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || (response.status === 401 || response.status === 403 ? 'Backend admin login failed. Check EASE_ADMIN_USERNAME and EASE_ADMIN_PASSWORD.' : 'Request failed (HTTP ' + response.status + ').'));
    return body;
  };

  const refresh = async () => {
    setLoading(true); setError('');
    try {
      const result = await request('/admin/students/pending') as StudentApplication[];
      setStudents(result); setConnected(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load student registrations.'); setConnected(false); }
    finally { setLoading(false); }
  };

  const connect = async (event: React.FormEvent) => { event.preventDefault(); await refresh(); };

  const review = async (student: StudentApplication, status: 'APPROVED' | 'REJECTED') => {
    setBusyId(student.id); setError(''); setNotice('');
    try {
      await request('/admin/students/' + student.id + '/status', { method: 'PATCH', body: JSON.stringify({ status }) });
      setNotice(student.registerNumber + (status === 'APPROVED' ? ' approved. They can now sign in.' : ' rejected.'));
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not update account status.'); }
    finally { setBusyId(null); }
  };

  return (
    <div className="min-h-screen bg-[#84532B] p-3 sm:p-6">
      <div className="max-w-5xl mx-auto rounded-xl p-3 sm:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c]">
        <section className="relative bg-[#FFFDF7] rounded-sm p-5 sm:p-8 shadow-xl">
          <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-8" />
          <Pushpin color="red" size="lg" className="absolute -top-3.5 right-8" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/15 pb-4">
            <div><h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Student Account Review</h1><p className="mt-1 text-xs text-slate-600">Check student identity against an authoritative college roster before approving.</p></div>
            <Link to="/admin-review" className="text-xs font-bold text-amber-900 underline">← Event review desk</Link>
          </div>
          {!connected && <form onSubmit={connect} className="my-5 p-4 bg-amber-50 border border-amber-200 rounded space-y-3">
            <p className="text-sm font-bold text-amber-950">Sign in with backend admin credentials</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-800">Username<input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required className="mt-1 w-full border rounded p-2 bg-white text-sm font-normal" /></label>
              <label className="block text-xs font-bold text-slate-800">Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" required className="mt-1 w-full border rounded p-2 bg-white text-sm font-normal" /></label>
            </div>
            <button disabled={loading || !password} className="px-4 py-2 rounded bg-slate-900 text-white text-sm font-bold disabled:opacity-50">{loading ? 'Connecting…' : 'Load pending registrations'}</button>
          </form>}
          {error && <div role="alert" className="my-4 p-3 bg-red-50 text-red-900 border border-red-200 rounded text-sm">{error}</div>}
          {notice && <div role="status" className="my-4 p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-sm">{notice}</div>}
          {connected && <>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-700"><strong>{students.length}</strong> pending registration{students.length === 1 ? '' : 's'}</p><button onClick={() => void refresh()} disabled={loading} className="px-3 py-2 rounded border text-xs font-bold text-slate-900">{loading ? 'Refreshing…' : 'Refresh'}</button></div>
            <div className="mt-4 space-y-3">
              {students.length === 0 && !loading && <p className="rounded border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">No pending student registrations.</p>}
              {students.map(student => <article key={student.id} className="rounded border border-amber-900/15 bg-amber-50/50 p-4 flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="font-bold text-slate-900">{student.registerNumber}</h2><p className="mt-1 text-xs text-slate-600">Submitted {new Date(student.createdAt).toLocaleString()}</p><p className="mt-1 text-[11px] text-amber-900">Verify identity before approval.</p></div>
                <div className="flex gap-2"><button onClick={() => void review(student, 'APPROVED')} disabled={busyId !== null} className="px-3 py-2 rounded bg-emerald-700 text-white text-xs font-bold disabled:opacity-50">{busyId === student.id ? 'Saving…' : 'Approve'}</button><button onClick={() => void review(student, 'REJECTED')} disabled={busyId !== null} className="px-3 py-2 rounded bg-red-700 text-white text-xs font-bold disabled:opacity-50">Reject</button></div>
              </article>)}
            </div>
          </>}
          <p className="mt-6 border-t border-amber-900/15 pt-3 text-[10px] text-slate-500">Approval actions are enforced by the Spring Boot API. Frontend route checks are not the security boundary.</p>
        </section>
      </div>
    </div>
  );
};
