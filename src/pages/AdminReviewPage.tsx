import React, { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import { lostFoundService } from '../services/lostFoundService';
import { EventItem, PublicationStatus } from '../types/event';
import { LostFoundAdminItem, LostFoundPublicationStatus } from '../types/lostFound';
import { formatEventDateRange } from '../utils/dateUtils';
import { Pushpin } from '../components/common/Pushpin';
import { appConfig } from '../config/appConfig';
import { BackendAdminReview } from './BackendAdminReview';

export const AdminReviewPage: React.FC = () => {
  // ── Event review state ──
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState<PublicationStatus>('Pending');
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // ── Lost & Found review state ──
  const [lfItems, setLfItems] = useState<LostFoundAdminItem[]>([]);
  const [lfActiveTab, setLfActiveTab] = useState<LostFoundPublicationStatus>('Pending');
  const [lfRejectModalId, setLfRejectModalId] = useState<string | null>(null);
  const [lfRejectReason, setLfRejectReason] = useState('');
  const [lfNotification, setLfNotification] = useState<string | null>(null);

  // ── Event handlers ──
  const loadData = () => {
    setEvents(eventService.getAllEvents());
  };

  const loadLfData = useCallback(async () => {
    try {
      const items = await lostFoundService.getAdminItems(undefined, 'all');
      setLfItems(items);
    } catch (err) {
      setLfNotification(
        err instanceof Error ? err.message : 'Could not load Lost & Found reports.'
      );
    }
  }, []);

  useEffect(() => {
    if (appConfig.apiBaseUrl) return;
    loadData();
    const unsubscribe = eventService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (appConfig.apiBaseUrl) return;
    loadLfData();
    const unsubscribe = lostFoundService.subscribe(() => {
      loadLfData();
    });
    return () => unsubscribe();
  }, [loadLfData]);

  const handleApprove = (id: string, title: string) => {
    const success = eventService.updateEventStatus(id, 'Approved');
    if (success) {
      setNotification(`Notice "${title}" approved! It is now live on the public corkboard, events page, and calendar.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleOpenRejectModal = (id: string) => {
    setRejectionModalId(id);
    setRejectionReason('Does not adhere to Student Affairs notice format or missing faculty signature.');
  };

  const handleConfirmReject = () => {
    if (rejectionModalId) {
      eventService.updateEventStatus(rejectionModalId, 'Rejected', rejectionReason);
      setNotification(`Notice #${rejectionModalId} rejected. It has been removed from public visibility.`);
      setRejectionModalId(null);
      setRejectionReason('');
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleResetBaseline = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all events and Lost & Found items to the original demo dataset? Any local demo submissions will be cleared.'
      )
    ) {
      eventService.resetToDefaultDemo();
      lostFoundService.resetToDefaultDemo();
      setNotification('Events and Lost & Found repository reset to clean demo baseline.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // ── Lost & Found handlers ──
  const handleLfApprove = async (id: string, itemName: string) => {
    try {
      const success = await lostFoundService.updateStatus(id, 'Approved');
      if (success) {
        setLfNotification(`Report "${itemName}" approved and now visible on the public corkboard.`);
        setTimeout(() => setLfNotification(null), 4000);
      }
    } catch (err) {
      setLfNotification(
        err instanceof Error ? err.message : 'Could not approve the Lost & Found report.'
      );
    }
  };

  const handleLfOpenRejectModal = (id: string) => {
    setLfRejectModalId(id);
    setLfRejectReason('Unable to verify physical item. Please bring the item to Room 104 for in-person verification.');
  };

  const handleLfConfirmReject = async () => {
    if (lfRejectModalId) {
      if (!lfRejectReason.trim()) {
        setLfNotification('A rejection reason is required.');
        return;
      }
      try {
        await lostFoundService.updateStatus(lfRejectModalId, 'Rejected', lfRejectReason);
        setLfNotification(`Report #${lfRejectModalId} rejected.`);
        setLfRejectModalId(null);
        setLfRejectReason('');
        setTimeout(() => setLfNotification(null), 4000);
      } catch (err) {
        setLfNotification(
          err instanceof Error ? err.message : 'Could not reject the Lost & Found report.'
        );
      }
    }
  };

  // ── Derived counts ──
  const filteredList = events.filter((ev) => ev.publicationStatus === activeTab);
  const pendingCount = events.filter((ev) => ev.publicationStatus === 'Pending').length;
  const approvedCount = events.filter((ev) => ev.publicationStatus === 'Approved').length;
  const rejectedCount = events.filter((ev) => ev.publicationStatus === 'Rejected').length;

  const lfFiltered = lfItems.filter((item) => item.publicationStatus === lfActiveTab);
  const lfPendingCount = lfItems.filter((item) => item.publicationStatus === 'Pending').length;
  const lfApprovedCount = lfItems.filter((item) => item.publicationStatus === 'Approved').length;
  const lfRejectedCount = lfItems.filter((item) => item.publicationStatus === 'Rejected').length;

  // Use the real Spring Boot review desk whenever the backend is configured.
  if (appConfig.apiBaseUrl) return <BackendAdminReview />;

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen py-8">
      <div className="max-w-6xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
        <div
          className="rounded-lg p-4 sm:p-8 min-h-[850px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)]"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
          }}
        >
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* EVENT REVIEW SECTION                                           */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="relative bg-[#FFFDF7] rounded-sm p-6 sm:p-8 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10">
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="red" size="lg" className="absolute -top-3.5 right-10" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-2xl">
                    admin_panel_settings
                  </span>
                  <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                    Faculty & Dean Notice Review Desk (Demo)
                  </h1>
                </div>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-1">
                  Demonstration Approval Queue • Simulating Future Java Spring Boot RBAC
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetBaseline}
                className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-xs font-title-md text-on-surface border border-amber-900/15 flex items-center gap-1 self-start md:self-auto"
                title="Reset local storage changes"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset Demo Data</span>
              </button>
            </div>

            {/* Crucial Security Notice Box */}
            <div className="my-5 p-4 bg-amber-50 rounded border-2 border-amber-300 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase">
                <span className="material-symbols-outlined text-base text-amber-700">
                  shield_with_heart
                </span>
                <span>Development Demonstration Mode Notice</span>
              </div>
              <p className="leading-relaxed">
                This local review interface is intended strictly for <strong>evaluating frontend approval behaviors</strong> and local state synchronization. It does not enforce cryptographic JWT tokens or multi-user server security. In production, this desk will be protected by Java Spring Boot Spring Security with role-based access control (Dean of Student Affairs / COE Officers).
              </p>
            </div>

            {/* Action Feedback Banner */}
            {notification && (
              <div className="my-4 p-3.5 bg-emerald-100 text-emerald-950 rounded border border-emerald-300 text-xs font-bold animate-in fade-in flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-emerald-700">
                  check_circle
                </span>
                <span>{notification}</span>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-surface-container mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('Pending')}
                className={`px-4 py-2 font-title-md text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'Pending'
                    ? 'border-secondary text-secondary font-bold'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span>Pending Verification</span>
                <span className="px-2 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('Approved')}
                className={`px-4 py-2 font-title-md text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'Approved'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span>Approved Notices (Public)</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {approvedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('Rejected')}
                className={`px-4 py-2 font-title-md text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'Rejected'
                    ? 'border-stone-600 text-stone-800 font-bold'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span>Rejected / Archived</span>
                <span className="px-2 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[11px] font-bold">
                  {rejectedCount}
                </span>
              </button>
            </div>

            {/* Submissions List */}
            <div className="mt-6 space-y-4">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 bg-surface-container-low rounded border border-amber-900/10 shadow-sm transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-container">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold">
                          {item.category}
                        </span>
                        <span className="font-title-md text-xs text-primary font-bold">
                          {item.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-outline">Ref ID: <code>{item.id}</code></span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.publicationStatus === 'Pending'
                              ? 'bg-amber-200 text-amber-900'
                              : item.publicationStatus === 'Approved'
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-red-200 text-red-900'
                          }`}
                        >
                          {item.publicationStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h3 className="font-headline-sm text-base text-primary font-serif font-bold">
                        {item.title}
                      </h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2 text-xs text-on-surface-variant bg-surface-container-lowest p-2.5 rounded">
                      <div>
                        <span className="text-outline text-[10px] block font-bold">SCHEDULE</span>
                        <span>{formatEventDateRange(item.startDate, item.endDate)}</span>
                      </div>
                      <div>
                        <span className="text-outline text-[10px] block font-bold">VENUE</span>
                        <span className="truncate block">{item.venue}</span>
                      </div>
                      <div>
                        <span className="text-outline text-[10px] block font-bold">FACULTY IN-CHARGE</span>
                        <span className="truncate block">
                          {item.facultyCoordinator}{' '}
                          {item.facultyCoordinatorEmpId && `(${item.facultyCoordinatorEmpId})`}
                        </span>
                      </div>
                    </div>

                    {item.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs border border-red-200">
                        <strong>Rejection Reason:</strong> {item.rejectionReason}
                      </div>
                    )}

                    {/* Admin Actions */}
                    <div className="mt-4 pt-3 border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-outline font-body-sm">
                        Submitted: {new Date(item.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        {item.publicationStatus !== 'Approved' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(item.id, item.title)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded font-title-md text-xs shadow-sm flex items-center gap-1 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">
                              check_circle
                            </span>
                            <span>Approve & Pin to Board</span>
                          </button>
                        )}

                        {item.publicationStatus !== 'Rejected' && (
                          <button
                            type="button"
                            onClick={() => handleOpenRejectModal(item.id)}
                            className="bg-secondary hover:bg-secondary/90 text-on-secondary px-3.5 py-1.5 rounded font-title-md text-xs shadow-sm flex items-center gap-1 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">
                              cancel
                            </span>
                            <span>Reject Notice</span>
                          </button>
                        )}

                        {item.publicationStatus === 'Approved' && (
                          <a
                            href={`/events/${item.id}`}
                            className="bg-surface-container-high hover:bg-surface-variant text-on-surface px-3 py-1.5 rounded font-title-md text-xs flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">
                              visibility
                            </span>
                            <span>Inspect Public Notice</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 bg-surface-container-low/60 rounded text-center border border-dashed border-amber-900/20">
                  <span className="material-symbols-outlined text-outline text-3xl mb-1">
                    inbox
                  </span>
                  <p className="font-title-md text-sm text-on-surface">
                    No notices in "{activeTab}" queue.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LOST & FOUND REVIEW SECTION                                    */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="relative bg-[#FFFDF7] rounded-sm p-6 sm:p-8 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10 mt-8">
            <Pushpin color="green" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-10" />

            {/* L&F Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-2xl">
                    search_check
                  </span>
                  <h2 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                    Lost & Found Property Desk (Demo)
                  </h2>
                </div>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-1">
                  Student Affairs Item Verification Queue • Main Block Room 104
                </p>
              </div>
            </div>

            {/* L&F Feedback Banner */}
            {lfNotification && (
              <div className="my-4 p-3.5 bg-emerald-100 text-emerald-950 rounded border border-emerald-300 text-xs font-bold animate-in fade-in flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-emerald-700">
                  check_circle
                </span>
                <span>{lfNotification}</span>
              </div>
            )}

            {/* L&F Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-surface-container mt-6">
              <button
                type="button"
                onClick={() => setLfActiveTab('Pending')}
                className={`px-4 py-2 font-title-md text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  lfActiveTab === 'Pending'
                    ? 'border-secondary text-secondary font-bold'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span>Pending Verification</span>
                <span className="px-2 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                  {lfPendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLfActiveTab('Approved')}
                className={`px-4 py-2 font-title-md text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  lfActiveTab === 'Approved'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span>Verified Items (Public)</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {lfApprovedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLfActiveTab('Rejected')}
                className={`px-4 py-2 font-title-md text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  lfActiveTab === 'Rejected'
                    ? 'border-stone-600 text-stone-800 font-bold'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span>Rejected</span>
                <span className="px-2 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[11px] font-bold">
                  {lfRejectedCount}
                </span>
              </button>
            </div>

            {/* L&F Items List */}
            <div className="mt-6 space-y-4">
              {lfFiltered.length > 0 ? (
                lfFiltered.map((item) => {
                  const isLost = item.reportType === 'LOST';
                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded border shadow-sm transition-all ${
                        isLost
                          ? 'bg-rose-50 border-rose-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-container">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded font-label-sm text-[10px] uppercase font-bold ${
                              isLost
                                ? 'bg-rose-200 text-rose-900'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {isLost ? '🔴 Lost Item' : '🟢 Found Item'}
                          </span>
                          <span className="font-title-md text-xs text-primary font-bold">
                            {item.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-outline">Ref: <code>{item.id}</code></span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.publicationStatus === 'Pending'
                                ? 'bg-amber-200 text-amber-900'
                                : item.publicationStatus === 'Approved'
                                ? 'bg-emerald-200 text-emerald-900'
                                : 'bg-red-200 text-red-900'
                            }`}
                          >
                            {item.publicationStatus}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h3 className="font-headline-sm text-base text-primary font-serif font-bold">
                          {item.itemName}
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Reporter Contact (admin-only visible) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2 text-xs text-on-surface-variant bg-surface-container-lowest p-2.5 rounded">
                        <div>
                          <span className="text-outline text-[10px] block font-bold">REPORTER</span>
                          <span>{item.contactName}</span>
                        </div>
                        <div>
                          <span className="text-outline text-[10px] block font-bold">CONTACT EMAIL</span>
                          <span className="truncate block">{item.contactEmail}</span>
                        </div>
                        <div>
                          <span className="text-outline text-[10px] block font-bold">REPORTED AT</span>
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {item.hasImage && item.imageOriginalName && (
                        <div className="mt-2 text-xs text-on-surface-variant flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-secondary">image</span>
                          <span>Photo attached: <strong>{item.imageOriginalName}</strong></span>
                        </div>
                      )}

                      {item.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs border border-red-200">
                          <strong>Rejection Reason:</strong> {item.rejectionReason}
                        </div>
                      )}

                      {/* Admin Actions */}
                      <div className="mt-4 pt-3 border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-outline font-body-sm">
                          Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.publicationStatus !== 'Approved' && (
                            <button
                              type="button"
                              onClick={() => void handleLfApprove(item.id, item.itemName)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded font-title-md text-xs shadow-sm flex items-center gap-1 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                check_circle
                              </span>
                              <span>Verify & Publish</span>
                            </button>
                          )}

                          {item.publicationStatus !== 'Rejected' && (
                            <button
                              type="button"
                              onClick={() => handleLfOpenRejectModal(item.id)}
                              className="bg-secondary hover:bg-secondary/90 text-on-secondary px-3.5 py-1.5 rounded font-title-md text-xs shadow-sm flex items-center gap-1 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                cancel
                              </span>
                              <span>Reject Report</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 bg-surface-container-low/60 rounded text-center border border-dashed border-amber-900/20">
                  <span className="material-symbols-outlined text-outline text-3xl mb-1">
                    inventory_2
                  </span>
                  <p className="font-title-md text-sm text-on-surface">
                    No Lost & Found reports in "{lfActiveTab}" queue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Notice Modal (Events) */}
      {rejectionModalId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl border border-amber-900/10">
            <h3 className="font-headline-sm text-base text-primary font-bold">
              Reject Submission #{rejectionModalId}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Provide a rationale for the faculty coordinator or club lead:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full mt-3 bg-surface-container-low p-2.5 rounded text-xs border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalId(null)}
                className="px-3 py-1.5 rounded text-xs font-title-md text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="bg-secondary text-on-secondary px-4 py-1.5 rounded text-xs font-title-md shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Report Modal (Lost & Found) */}
      {lfRejectModalId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl border border-amber-900/10">
            <h3 className="font-headline-sm text-base text-primary font-bold">
              Reject Lost & Found Report #{lfRejectModalId}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Provide a reason for rejecting this report:
            </p>
            <textarea
              rows={3}
              value={lfRejectReason}
              onChange={(e) => setLfRejectReason(e.target.value)}
              className="w-full mt-3 bg-surface-container-low p-2.5 rounded text-xs border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLfRejectModalId(null)}
                className="px-3 py-1.5 rounded text-xs font-title-md text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleLfConfirmReject()}
                className="bg-secondary text-on-secondary px-4 py-1.5 rounded text-xs font-title-md shadow-sm"
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
