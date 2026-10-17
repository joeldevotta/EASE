import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { MaskingTape } from '../components/common/MaskingTape';
import { RubberStamp } from '../components/common/RubberStamp';
import { useAuth } from '../context/AuthContext';
import { odService, OdApplication, OdStatus } from '../services/odService';

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
const StatusBadge: React.FC<{ status: OdStatus }> = ({ status }) => {
  const cfg: Record<OdStatus, { cls: string; icon: string }> = {
    Approved: { cls: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: 'verified' },
    Rejected: { cls: 'bg-red-100 text-red-900 border-red-300', icon: 'cancel' },
    'Pending Faculty Review': { cls: 'bg-amber-100 text-amber-900 border-amber-300', icon: 'pending' },
    'HOD Endorsement': { cls: 'bg-blue-100 text-blue-900 border-blue-300', icon: 'approval_delegation' },
  };
  const { cls, icon } = cfg[status] ?? cfg['Pending Faculty Review'];
  return (
    <span
      className={`px-2.5 py-1 rounded text-[11px] font-title-md font-bold uppercase tracking-wider flex items-center gap-1 border ${cls}`}
    >
      <span className="material-symbols-outlined text-xs">{icon}</span>
      <span>{status}</span>
    </span>
  );
};

// ---------------------------------------------------------------------------
// Reject modal
// ---------------------------------------------------------------------------
interface RejectModalProps {
  application: OdApplication;
  onCancel: () => void;
  onConfirm: (comment: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({ application, onCancel, onConfirm }) => {
  const [comment, setComment] = useState('');
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFFDF7] rounded-lg shadow-2xl w-full max-w-md p-6 border border-amber-900/10 relative">
        <Pushpin color="red" size="md" className="absolute -top-3 left-8" />
        <h3 className="font-display-lg text-lg text-primary font-bold font-serif mb-1">
          Reject OD Request
        </h3>
        <p className="font-body-sm text-xs text-on-surface-variant mb-4">
          Application <span className="font-mono font-bold text-primary">{application.id}</span>
          {' '}by{' '}
          <strong>{application.studentName}</strong> — {application.eventTitle}
        </p>
        <label className="block text-outline uppercase text-[11px] mb-1 font-bold">
          Reason for Rejection / Feedback for Student *
        </label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g., Attendance below 75% threshold. Insufficient proof of participation provided."
          className="w-full bg-surface-container-low px-3 py-2.5 rounded border border-amber-900/15 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner font-body-sm"
          autoFocus
        />
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded text-xs font-title-md bg-surface-container text-on-surface border border-amber-900/10 hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={comment.trim().length < 5}
            onClick={() => onConfirm(comment)}
            className="px-4 py-2 rounded text-xs font-title-md bg-red-700 hover:bg-red-800 text-white shadow-sm disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">cancel</span>
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Application card
// ---------------------------------------------------------------------------
interface AppCardProps {
  app: OdApplication;
  isPending: boolean;
  onApprove: (app: OdApplication) => void;
  onReject: (app: OdApplication) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, isPending, onApprove, onReject }) => (
  <div className="relative p-4 sm:p-5 rounded bg-surface-container-low border border-amber-900/10 shadow-sm overflow-hidden">
    {/* Header row */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-surface-container pb-2.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded border border-amber-900/10">
          {app.id}
        </span>
        <span className="text-[11px] text-outline">
          Submitted: {new Date(app.appliedAt).toLocaleString()}
        </span>
      </div>
      <StatusBadge status={app.status} />
    </div>

    {/* Body */}
    <div className="mt-3">
      <h3 className="font-title-md text-sm text-on-surface font-bold">{app.eventTitle}</h3>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-body-sm">
        <span>👤 {app.studentName}</span>
        <span>🆔 {app.registerNumber}</span>
        <span>🏛️ {app.department}</span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-body-sm">
        <span>🏷️ {app.category}</span>
        <span>
          📅 {app.startDate} → {app.endDate} ({app.daysCount} day{app.daysCount > 1 ? 's' : ''})
        </span>
        <span>👨‍🏫 {app.facultyAdvisor}</span>
      </div>
      <p className="mt-2 text-xs text-on-surface font-body-sm italic bg-surface-container-lowest p-2 rounded border border-amber-900/5">
        "{app.purpose}"
      </p>
    </div>

    {/* Staff feedback (if already reviewed) */}
    {app.staffComment && (
      <div className="mt-3 pt-2 border-t border-surface-container">
        <p className="text-[11px] text-outline font-body-sm">
          <span className="font-bold text-on-surface">Staff Feedback:</span> {app.staffComment}
        </p>
        {app.reviewedBy && (
          <p className="text-[10px] text-outline mt-0.5">
            Reviewed by: <span className="font-bold">{app.reviewedBy}</span>
            {app.reviewedAt ? ` on ${new Date(app.reviewedAt).toLocaleString()}` : ''}
          </p>
        )}
      </div>
    )}

    {/* Action buttons (only for pending) */}
    {isPending && (
      <div className="mt-4 flex items-center gap-3 pt-3 border-t border-surface-container">
        <button
          type="button"
          onClick={() => onApprove(app)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-title-md shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">check_circle</span>
          Approve OD
        </button>
        <button
          type="button"
          onClick={() => onReject(app)}
          className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-xs font-title-md shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">cancel</span>
          Reject
        </button>
      </div>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
type TabKey = 'pending' | 'approved' | 'rejected';

export const StaffOdReviewPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [filterDept, setFilterDept] = useState('');
  const [rejectTarget, setRejectTarget] = useState<OdApplication | null>(null);
  // Force re-render after mutations
  const [_tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const all = odService.getAllApplications();

  // Derive tabs
  const pending = all.filter((a) =>
    a.status === 'Pending Faculty Review' || a.status === 'HOD Endorsement'
  );
  const approved = all.filter((a) => a.status === 'Approved');
  const rejected = all.filter((a) => a.status === 'Rejected');

  const applyFilter = (list: OdApplication[]) =>
    filterDept ? list.filter((a) => a.department.toLowerCase().includes(filterDept.toLowerCase())) : list;

  const tabList = applyFilter(activeTab === 'pending' ? pending : activeTab === 'approved' ? approved : rejected);

  // Unique departments for quick filter
  const departments = [...new Set(all.map((a) => a.department))].sort();

  const handleApprove = (app: OdApplication) => {
    odService.updateApplicationStatus(
      app.id,
      'Approved',
      'OD request reviewed and approved. Attendance credit will be applied.',
      user?.name || user?.identifier || 'Staff'
    );
    refresh();
  };

  const handleRejectConfirm = (comment: string) => {
    if (!rejectTarget) return;
    odService.updateApplicationStatus(
      rejectTarget.id,
      'Rejected',
      comment,
      user?.name || user?.identifier || 'Staff'
    );
    setRejectTarget(null);
    refresh();
  };

  return (
    <>
      {rejectTarget && (
        <RejectModal
          application={rejectTarget}
          onCancel={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
        />
      )}

      <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-[calc(100vh-7rem)] py-8">
        <div className="max-w-5xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
          <div
            className="rounded-lg p-4 sm:p-8 min-h-[750px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)] flex flex-col gap-6"
            style={{
              backgroundColor: '#9B6338',
              backgroundImage:
                'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
              backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
            }}
          >
            {/* ── Header Plaque ─────────────────────────────────────────── */}
            <div className="relative bg-[#FFFDF7] rounded-sm p-6 sm:p-8 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10">
              <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-10" />
              <Pushpin color="navy" size="lg" className="absolute -top-3.5 right-10" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <img
                    src={appConfig.emblemUrl}
                    alt="Easwari Engineering College Seal"
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold block">
                      {appConfig.collegeName} • Faculty / Staff Portal
                    </span>
                    <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                      OD Request Approval Desk
                    </h1>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Review, approve, or reject student On-Duty attendance requests
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RubberStamp
                    label="FACULTY"
                    subLabel="REVIEW DESK"
                    code="EEC SA-OD"
                    color="primary"
                    className="scale-[0.65] origin-center -my-2"
                  />
                </div>
              </div>

              {/* Staff identity chip */}
              {user && (
                <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-on-surface bg-surface-container px-3 py-1 rounded border border-amber-900/10">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>
                      Reviewer: <strong>{user.name}</strong>
                    </span>
                    <span className="text-[10px] text-outline font-mono">({user.identifier})</span>
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold uppercase">
                      {user.role}
                    </span>
                  </div>

                  {/* Counts */}
                  <div className="flex items-center gap-2 text-[11px] font-title-md">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                      {pending.length} Pending
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                      {approved.length} Approved
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 font-bold">
                      {rejected.length} Rejected
                    </span>
                  </div>
                </div>
              )}

              {/* Demo disclaimer */}
              <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2 font-body-sm">
                <span className="material-symbols-outlined text-blue-600 text-base shrink-0 mt-0.5">
                  info
                </span>
                <span>
                  <strong>Frontend-Only Demo:</strong> All OD requests stored on this device are visible
                  here. In production, only requests submitted to your department would appear. Data is
                  not shared between different browsers or devices.
                </span>
              </div>
            </div>

            {/* ── Tabs + Filter ──────────────────────────────────────────── */}
            <div className="relative bg-[#FFFEFA] rounded-sm p-4 sm:p-6 shadow-[0_15px_35px_rgba(40,15,5,0.4)] border border-amber-900/10 animate-in fade-in">
              <MaskingTape color="cream" width="w-24" className="absolute -top-3 left-12" />
              <MaskingTape color="cream" width="w-24" className="absolute -top-3 right-12" />

              {/* Tab buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-lg border border-amber-900/10 text-xs font-title-md flex-wrap">
                  {(
                    [
                      { key: 'pending', label: `Pending (${pending.length})`, icon: 'pending' },
                      { key: 'approved', label: `Approved (${approved.length})`, icon: 'verified' },
                      { key: 'rejected', label: `Rejected (${rejected.length})`, icon: 'cancel' },
                    ] as { key: TabKey; label: string; icon: string }[]
                  ).map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                        activeTab === key
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Department filter */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">filter_list</span>
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-surface-container-low text-xs font-title-md text-on-surface px-2 py-1.5 rounded border border-amber-900/10 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Application cards */}
              <div className="space-y-4">
                {tabList.length > 0 ? (
                  tabList.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      isPending={activeTab === 'pending'}
                      onApprove={handleApprove}
                      onReject={(a) => setRejectTarget(a)}
                    />
                  ))
                ) : (
                  <div className="p-10 text-center bg-surface-container-low rounded border border-dashed border-amber-900/20">
                    <span className="material-symbols-outlined text-outline text-3xl block mb-2">
                      {activeTab === 'pending'
                        ? 'assignment_turned_in'
                        : activeTab === 'approved'
                        ? 'verified'
                        : 'cancel'}
                    </span>
                    <p className="text-xs text-on-surface-variant font-body-sm">
                      {activeTab === 'pending'
                        ? 'No pending OD requests at this time.'
                        : activeTab === 'approved'
                        ? 'No approved OD requests yet.'
                        : 'No rejected OD requests.'}
                      {filterDept && ' (filtered by department)'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Bottom nav ──────────────────────────────────────────────── */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-amber-100 hover:text-white font-title-md bg-[#452712]/70 px-4 py-2 rounded-full transition-colors backdrop-blur-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Campus Notice Board</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
