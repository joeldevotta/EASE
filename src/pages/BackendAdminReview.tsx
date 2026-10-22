import React, { useCallback, useMemo, useState } from 'react';
import { appConfig } from '../config/appConfig';
import { EventItem, PublicationStatus } from '../types/event';
import { LostFoundAdminItem } from '../types/lostFound';
import { formatEventDateRange } from '../utils/dateUtils';
import { AuthenticatedImage } from '../components/common/AuthenticatedImage';
import { Pushpin } from '../components/common/Pushpin';

type ReviewStatus = 'Pending' | 'Approved' | 'Rejected' | 'all';
type ReviewQueue = 'events' | 'lostfound';

export const BackendAdminReview: React.FC = () => {
  const [username, setUsername] = useState('ease-admin');
  const [password, setPassword] = useState('');
  const [connected, setConnected] = useState(false);
  const [queueMode, setQueueMode] = useState<ReviewQueue>('events');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundAdminItem[]>([]);
  const [activeTab, setActiveTab] = useState<ReviewStatus>('Pending');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const trimmedBase = appConfig.apiBaseUrl.trim().replace(/\/$/, '');
  const apiBase = trimmedBase.endsWith('/api') ? trimmedBase : `${trimmedBase}/api`;
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

  const loadLostFound = useCallback(async (status: ReviewStatus = activeTab) => {
    setLoading(true);
    setError(null);
    try {
      const query = status === 'all' ? '' : '?status=' + encodeURIComponent(status);
      const result = await request('/admin/lost-found' + query) as LostFoundAdminItem[];
      setLostFoundItems(result);
      setConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load Lost & Found items.');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [activeTab, request]);

  const connect = async (event: React.FormEvent) => {
    event.preventDefault();
    if (queueMode === 'events') {
      await loadEvents(activeTab);
    } else {
      await loadLostFound(activeTab);
    }
  };

  const reviewEvent = async (id: string, status: Extract<PublicationStatus, 'Approved' | 'Rejected'>, reason?: string) => {
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

  const reviewLostFound = async (id: string, status: Extract<PublicationStatus, 'Approved' | 'Rejected'>, reason?: string) => {
    setBusyId(id);
    setError(null);
    try {
      await request('/admin/lost-found/' + encodeURIComponent(id) + '/status', {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(status === 'Rejected' ? { rejectionReason: reason } : {}) }),
      });
      setNotification(status === 'Approved' ? 'Lost & Found item approved and published to the corkboard.' : 'Lost & Found item rejected.');
      setRejectionId(null);
      setRejectionReason('');
      await loadLostFound(activeTab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update Lost & Found status.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReview = (id: string, status: Extract<PublicationStatus, 'Approved' | 'Rejected'>, reason?: string) => {
    if (queueMode === 'events') {
      return reviewEvent(id, status, reason);
    } else {
      return reviewLostFound(id, status, reason);
    }
  };

  const refreshCurrentQueue = (status: ReviewStatus = activeTab) => {
    if (queueMode === 'events') {
      void loadEvents(status);
    } else {
      void loadLostFound(status);
    }
  };

  const eventCounts = {
    Pending: events.filter((item) => item.publicationStatus === 'Pending').length,
    Approved: events.filter((item) => item.publicationStatus === 'Approved').length,
    Rejected: events.filter((item) => item.publicationStatus === 'Rejected').length,
  };

  const lostFoundCounts = {
    Pending: lostFoundItems.filter((item) => item.publicationStatus === 'Pending').length,
    Approved: lostFoundItems.filter((item) => item.publicationStatus === 'Approved').length,
    Rejected: lostFoundItems.filter((item) => item.publicationStatus === 'Rejected').length,
  };

  const currentCounts = queueMode === 'events' ? eventCounts : lostFoundCounts;

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 min-h-screen py-8">
      <div className="max-w-6xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c]">
        <div className="rounded-lg p-4 sm:p-8" style={{ backgroundColor: '#9B6338' }}>
          <div className="relative bg-[#FFFDF7] rounded-sm p-5 sm:p-8 shadow-xl border border-amber-900/10">
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="red" size="lg" className="absolute -top-3.5 right-10" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
              <div>
                <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                  E.A.S.E. Administrative Review Desk
                </h1>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-1">
                  Connected to Spring Boot REST backend • HTTP Basic Authentication
                </p>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-bold ${connected ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                {connected ? 'Backend connected' : 'Backend login required'}
              </span>
            </div>

            {!connected && (
              <form onSubmit={connect} className="my-5 p-4 bg-amber-50 border border-amber-200 rounded space-y-3">
                <p className="text-sm font-bold text-amber-950">Sign in with your backend admin credentials</p>
                <p className="text-xs text-amber-900">
                  Use the <code>EASE_ADMIN_USERNAME</code> and <code>EASE_ADMIN_PASSWORD</code> values configured on the Spring Boot server. These are separate from frontend demo accounts.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-primary">Backend username
                    <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required className="mt-1 w-full border rounded p-2 bg-white text-sm font-normal" />
                  </label>
                  <label className="block text-xs font-bold text-primary">Backend password
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required className="mt-1 w-full border rounded p-2 bg-white text-sm font-normal" />
                  </label>
                </div>
                <button type="submit" disabled={loading || !password} className="px-4 py-2 rounded bg-[#1c3551] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#15283e] transition-colors">
                  {loading ? 'Connecting…' : 'Connect to review queue'}
                </button>
              </form>
            )}

            {error && <div role="alert" className="my-4 p-3 bg-red-50 text-red-900 border border-red-200 rounded text-sm">{error}</div>}
            {notification && <div role="status" className="my-4 p-3 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded text-sm font-bold">{notification}</div>}

            {connected && (
              <>
                {/* Desk Switcher: Events vs Lost & Found */}
                <div className="flex flex-wrap gap-2 my-5 p-2 bg-surface-container-low rounded border border-amber-900/10">
                  <button
                    type="button"
                    onClick={() => {
                      setQueueMode('events');
                      void loadEvents(activeTab);
                    }}
                    className={`px-4 py-2 rounded text-xs sm:text-sm font-title-md font-bold transition-all flex items-center gap-1.5 ${
                      queueMode === 'events'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">campaign</span>
                    <span>Event Notices Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQueueMode('lostfound');
                      void loadLostFound(activeTab);
                    }}
                    className={`px-4 py-2 rounded text-xs sm:text-sm font-title-md font-bold transition-all flex items-center gap-1.5 ${
                      queueMode === 'lostfound'
                        ? 'bg-secondary text-on-secondary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">search_check</span>
                    <span>Lost & Found Property Desk</span>
                  </button>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-surface-container mt-4">
                  {(['Pending', 'Approved', 'Rejected', 'all'] as ReviewStatus[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        refreshCurrentQueue(tab);
                      }}
                      className={`px-3 py-2 text-xs sm:text-sm border-b-2 transition-all ${
                        activeTab === tab
                          ? 'border-secondary text-secondary font-bold'
                          : 'border-transparent text-outline hover:text-on-surface'
                      }`}
                    >
                      {tab === 'all' ? 'All records' : tab}
                      {tab !== 'all' && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-surface-container text-xs">
                          {currentCounts[tab]}
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => refreshCurrentQueue(activeTab)}
                    className="ml-auto px-3 py-1.5 rounded border border-amber-900/15 text-xs font-bold text-primary hover:bg-surface-container"
                    disabled={loading}
                  >
                    {loading ? 'Refreshing…' : 'Refresh'}
                  </button>
                </div>

                {/* Queue Content: Events */}
                {queueMode === 'events' && (
                  <div className="mt-5 space-y-4">
                    {loading && events.length === 0 ? (
                      <p className="p-8 text-center text-sm text-outline animate-pulse">Loading events…</p>
                    ) : events.length ? (
                      events.map((item) => (
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
                                <button type="button" disabled={busyId === item.id} onClick={() => void handleReview(item.id, 'Approved')} className="px-3 py-2 rounded bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 hover:bg-emerald-800 transition-colors">{busyId === item.id ? 'Saving…' : 'Approve & publish'}</button>
                                <button type="button" disabled={busyId === item.id} onClick={() => { setRejectionId(item.id); setRejectionReason(''); }} className="px-3 py-2 rounded bg-secondary text-on-secondary text-xs font-bold disabled:opacity-50 hover:bg-secondary/90 transition-colors">Reject</button>
                              </div>
                            )}
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="p-10 text-center border border-dashed rounded text-sm text-outline">
                        {activeTab === 'Pending' ? 'No pending events in the queue.' : 'No events in this view.'}
                      </div>
                    )}
                  </div>
                )}

                {/* Queue Content: Lost & Found */}
                {queueMode === 'lostfound' && (
                  <div className="mt-5 space-y-4">
                    {loading && lostFoundItems.length === 0 ? (
                      <p className="p-8 text-center text-sm text-outline animate-pulse">Loading Lost & Found property reports…</p>
                    ) : lostFoundItems.length ? (
                      lostFoundItems.map((item) => {
                        const isLost = item.reportType === 'LOST';
                        return (
                          <article key={item.id} className="p-4 sm:p-5 bg-surface-container-low rounded border border-amber-900/10 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-container">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  isLost ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                }`}>
                                  {isLost ? '🔴 Lost Item' : '🟢 Found Item'}
                                </span>
                                <span className="text-xs text-primary font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">location_on</span>
                                  <span>{item.location}</span>
                                </span>
                              </div>
                              <span className="text-xs text-outline font-mono">Ref ID: <code>{item.id}</code></span>
                            </div>

                            <h2 className="mt-3 text-lg text-primary font-serif font-bold">{item.itemName}</h2>
                            <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
                            {item.hasImage ? (
                              <div className="mt-3 max-w-xs">
                                <AuthenticatedImage
                                  url={`${apiBase}/admin/lost-found/${encodeURIComponent(item.id)}/image`}
                                  authorization={authorization}
                                  alt={`Submitted photo of ${item.itemName}`}
                                  className="h-36 w-full rounded border border-amber-900/10 object-cover"
                                />
                                {item.imageOriginalName ? (
                                  <p className="mt-1 truncate text-[11px] text-outline">{item.imageOriginalName}</p>
                                ) : null}
                              </div>
                            ) : (
                              <p className="mt-2 text-[11px] italic text-outline">No photo attached.</p>
                            )}

                            {/* Verification Contact Data (Admin-Only Visibility) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 p-3 bg-white rounded border border-amber-900/10 text-xs text-on-surface-variant">
                              <div>
                                <span className="block text-[10px] font-bold text-outline">REPORTER NAME</span>
                                <span className="font-semibold text-primary">{item.contactName}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] font-bold text-outline">CONTACT EMAIL</span>
                                <a href={`mailto:${item.contactEmail}`} className="text-secondary hover:underline font-semibold">
                                  {item.contactEmail}
                                </a>
                              </div>
                              <div>
                                <span className="block text-[10px] font-bold text-outline">LOGGED TIMESTAMP</span>
                                <span>{new Date(item.createdAt).toLocaleString()}</span>
                              </div>
                            </div>

                            {item.rejectionReason && (
                              <p className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs border border-red-200">
                                <strong>Rejection reason:</strong> {item.rejectionReason}
                              </p>
                            )}

                            <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
                              <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                item.publicationStatus === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : item.publicationStatus === 'Rejected'
                                  ? 'bg-red-100 text-red-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {item.publicationStatus}
                              </span>

                              {item.publicationStatus === 'Pending' && (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    disabled={busyId === item.id}
                                    onClick={() => void handleReview(item.id, 'Approved')}
                                    className="px-3 py-2 rounded bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 hover:bg-emerald-800 transition-colors flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-xs">check</span>
                                    <span>{busyId === item.id ? 'Saving…' : 'Approve & Pin to Corkboard'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busyId === item.id}
                                    onClick={() => {
                                      setRejectionId(item.id);
                                      setRejectionReason('');
                                    }}
                                    className="px-3 py-2 rounded bg-secondary text-on-secondary text-xs font-bold disabled:opacity-50 hover:bg-secondary/90 transition-colors flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-xs">close</span>
                                    <span>Reject Report</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })
                    ) : (
                      <div className="p-10 text-center border border-dashed rounded text-sm text-outline">
                        {activeTab === 'Pending'
                          ? 'No pending property reports. Student submissions will appear here for physical desk verification.'
                          : 'No reports in this view.'}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {rejectionId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl border border-amber-900/15">
            <h3 className="text-lg text-primary font-bold">
              Reject {queueMode === 'events' ? 'Notice' : 'Property Report'} #{rejectionId}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Provide an official rationale explaining why this submission cannot be approved:
            </p>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full mt-3 border border-amber-900/20 rounded p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="State reason for rejection (e.g. Item already retrieved by owner, or invalid campus location)..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionId(null)}
                className="px-3 py-2 rounded text-xs font-title-md text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReason.trim() || busyId === rejectionId}
                onClick={() => void handleReview(rejectionId, 'Rejected', rejectionReason.trim())}
                className="px-4 py-2 rounded bg-secondary text-on-secondary text-xs font-bold disabled:opacity-50 hover:bg-secondary/90 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
