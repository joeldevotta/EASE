import React, { useCallback, useMemo, useState } from 'react';
import { appConfig } from '../config/appConfig';
import { EventItem, PublicationStatus } from '../types/event';
import { formatEventDateRange } from '../utils/dateUtils';
import { Pushpin } from '../components/common/Pushpin';

type ReviewStatus = 'Pending' | 'Approved' | 'Rejected' | 'all';

export const BackendAdminReview: React.FC = () => {
  const [username, setUsername] = useState('ease-admin');
  const [password, setPassword] = useState('');
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState<ReviewStatus>('Pending');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const apiBase = appConfig.apiBaseUrl.replace(/\/$/, '');
  const authorization = useMemo(() => 'Basic ' + btoa(username + ':' + password), [username, password]);

  const request = useCallback(async (path: string, init: RequestInit = {}) => {
    const response = await fetch(apiBase + path, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: authorization,
        ...init.headers,
      },
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Backend admin authentication failed. Use EASE_ADMIN_USERNAME and EASE_ADMIN_PASSWORD from the backend terminal, not the demo password admin123.');
      }
      let message = 'Request failed (HTTP ' + response.status + ').';
      try {
        const body = await response.json();
        if (body.message) message = body.message;
        else if (body.detail) message = body.detail;
      } catch {}
      throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
  }, [apiBase, authorization]);

  const loadEvents = useCallback(async (status: ReviewStatus = activeTab) => {
    setLoading(true);
    setError(null);
    try {
      const query = status === 'all' ? '' : '?status=' + encodeURIComponent(status);
      const result = await request('/admin/events' + query) as EventItem[];
      setEvents(result);
      setConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load events.');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [activeTab, request]);

  const connect = async (event: React.FormEvent) => {
    event.preventDefault();
    await loadEvents(activeTab);
  };

  const review = async (id: string, status: Extract<PublicationStatus, 'Approved' | 'Rejected'>, reason?: string) => {
    setBusyId(id);
    setError(null);
    try {
      await request('/admin/events/' + encodeURIComponent(id) + '/status', {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(status === 'Rejected' ? { rejectionReason: reason } : {}) }),
      });
      setNotification(status === 'Approved' ? 'Event approved and published to the public events API.' : 'Event rejected and kept out of public events.');
      setRejectionId(null);
      setRejectionReason('');
      await loadEvents(activeTab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update event status.');
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    Pending: events.filter((item) => item.publicationStatus === 'Pending').length,
    Approved: events.filter((item) => item.publicationStatus === 'Approved').length,
    Rejected: events.filter((item) => item.publicationStatus === 'Rejected').length,
  };

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 min-h-screen py-8">
      <div className="max-w-6xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c]">
        <div className="rounded-lg p-4 sm:p-8" style={{ backgroundColor: '#9B6338' }}>
          <div className="relative bg-[#FFFDF7] rounded-sm p-5 sm:p-8 shadow-xl border border-amber-900/10">
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="red" size="lg" className="absolute -top-3.5 right-10" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
              <div>
                <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">E.A.S.E. Event Review Desk</h1>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-1">Connected to the Java Spring Boot backend</p>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-bold ${connected ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                {connected ? 'Backend connected' : 'Backend login required'}
              </span>
            </div>

            {!connected && (
              <form onSubmit={connect} className="my-5 p-4 bg-amber-50 border border-amber-200 rounded space-y-3">
                <p className="text-sm font-bold text-amber-950">Sign in with your backend admin credentials</p>
                <p className="text-xs text-amber-900">Use the EASE_ADMIN_USERNAME and EASE_ADMIN_PASSWORD values set in the terminal running Spring Boot. These differ from the frontend demo login (admin123).</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-primary">Backend username
                    <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required className="mt-1 w-full border rounded p-2 bg-white text-sm font-normal" />
                  </label>
                  <label className="block text-xs font-bold text-primary">Backend password
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required className="mt-1 w-full border rounded p-2 bg-white text-sm font-normal" />
                  </label>
                </div>
                <button type="submit" disabled={loading || !password} className="px-4 py-2 rounded bg-[#1c3551] text-white text-sm font-bold disabled:opacity-50">
                  {loading ? 'Connecting…' : 'Connect to review queue'}
                </button>
              </form>
            )}

            {error && <div role="alert" className="my-4 p-3 bg-red-50 text-red-900 border border-red-200 rounded text-sm">{error}</div>}
            {notification && <div role="status" className="my-4 p-3 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded text-sm font-bold">{notification}</div>}

            {connected && (
              <>
                <div className="flex flex-wrap items-center gap-2 border-b border-surface-container mt-6">
                  {(['Pending', 'Approved', 'Rejected', 'all'] as ReviewStatus[]).map((tab) => (
                    <button key={tab} type="button" onClick={() => { setActiveTab(tab); void loadEvents(tab); }} className={`px-3 py-2 text-xs sm:text-sm border-b-2 ${activeTab === tab ? 'border-secondary text-secondary font-bold' : 'border-transparent text-outline'}`}>
                      {tab === 'all' ? 'All events' : tab}
                      {tab !== 'all' && <span className="ml-2 px-2 py-0.5 rounded-full bg-surface-container">{counts[tab]}</span>}
                    </button>
                  ))}
                  <button type="button" onClick={() => void loadEvents(activeTab)} className="ml-auto px-3 py-2 rounded border text-xs font-bold text-primary" disabled={loading}>
                    {loading ? 'Refreshing…' : 'Refresh'}
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {loading && events.length === 0 ? <p className="p-8 text-center text-sm text-outline">Loading events…</p> :
                    events.length ? events.map((item) => (
                      <article key={item.id} className="p-4 sm:p-5 bg-surface-container-low rounded border border-amber-900/10 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-container">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary text-[10px] uppercase font-bold">{item.category}</span>
                            <span className="text-xs text-primary font-bold">{item.department}</span>
                          </div>
                          <span className="text-xs text-outline">Ref ID: <code>{item.id}</code></span>
                        </div>
                        <h2 className="mt-3 text-lg text-primary font-serif font-bold">{item.title}</h2>
                        <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 p-3 bg-white rounded text-xs text-on-surface-variant">
                          <div><span className="block text-[10px] font-bold text-outline">SCHEDULE</span>{formatEventDateRange(item.startDate, item.endDate)}</div>
                          <div><span className="block text-[10px] font-bold text-outline">VENUE</span>{item.venue}</div>
                          <div><span className="block text-[10px] font-bold text-outline">FACULTY IN-CHARGE</span>{item.facultyCoordinator} {item.facultyCoordinatorEmpId ? '(' + item.facultyCoordinatorEmpId + ')' : ''}</div>
                        </div>
                        {item.rejectionReason && <p className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs"><strong>Rejection reason:</strong> {item.rejectionReason}</p>}
                        <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
                          <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${item.publicationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-900' : item.publicationStatus === 'Rejected' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'}`}>{item.publicationStatus}</span>
                          {item.publicationStatus === 'Pending' && (
                            <div className="flex flex-wrap gap-2">
                              <button type="button" disabled={busyId === item.id} onClick={() => void review(item.id, 'Approved')} className="px-3 py-2 rounded bg-emerald-700 text-white text-xs font-bold disabled:opacity-50">{busyId === item.id ? 'Saving…' : 'Approve & publish'}</button>
                              <button type="button" disabled={busyId === item.id} onClick={() => { setRejectionId(item.id); setRejectionReason(''); }} className="px-3 py-2 rounded bg-secondary text-on-secondary text-xs font-bold disabled:opacity-50">Reject</button>
                            </div>
                          )}
                        </div>
                      </article>
                    )) : <div className="p-10 text-center border border-dashed rounded text-sm text-outline">{activeTab === 'Pending' ? 'No pending events. Submit one from the staff event form to test the workflow.' : 'No events in this view yet.'}</div>
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {rejectionId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl">
            <h3 className="text-lg text-primary font-bold">Reject event</h3>
            <p className="text-xs text-on-surface-variant mt-1">Give the event submitter a reason.</p>
            <textarea rows={4} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full mt-3 border rounded p-3 text-sm bg-white" placeholder="Explain what needs to be corrected…" />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setRejectionId(null)} className="px-3 py-2 rounded text-xs">Cancel</button>
              <button type="button" disabled={!rejectionReason.trim() || busyId === rejectionId} onClick={() => void review(rejectionId, 'Rejected', rejectionReason.trim())} className="px-4 py-2 rounded bg-secondary text-on-secondary text-xs font-bold disabled:opacity-50">Confirm rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
