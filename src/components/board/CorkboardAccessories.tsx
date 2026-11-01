import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EventItem } from '../../types/event';
import { LostFoundPublicItem } from '../../types/lostFound';
import { lostFoundService } from '../../services/lostFoundService';
import { Pushpin } from '../common/Pushpin';
import { LostItemSubmissionModal } from './LostItemSubmissionModal';

interface CorkboardAccessoriesProps {
  onSelectEvent?: (event: EventItem) => void;
  onPostLostItem?: () => void;
}

function formatItemDate(isoStr: string): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
}

export const CorkboardAccessories: React.FC<CorkboardAccessoriesProps> = ({
  onPostLostItem,
}) => {
  const [items, setItems] = useState<LostFoundPublicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const loadLostFoundItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await lostFoundService.getApprovedItems();
      setItems(list);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load Lost & Found items from the server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLostFoundItems();
    const unsubscribe = lostFoundService.subscribe(() => {
      loadLostFoundItems();
    });
    return () => unsubscribe();
  }, [loadLostFoundItems]);

  const handleOpenPostModal = () => {
    if (onPostLostItem) {
      onPostLostItem();
    } else {
      setShowPostModal(true);
    }
  };

  return (
    <>
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* 1. Campus Tear-off Calendar Sheet */}
        <div className="relative bg-white rounded-sm p-5 pt-7 shadow-[0_8px_20px_rgba(50,20,5,0.35)] transform lg:-rotate-[0.8deg] hover:rotate-0 transition-transform border border-amber-900/10">
          <Pushpin color="navy" size="md" className="absolute -top-3 left-1/2 -translate-x-1/2 z-30" />

          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                date_range
              </span>
              <h4 className="font-title-md text-base text-primary font-bold">
                This Week on Campus
              </h4>
            </div>
            <span className="font-label-sm text-[10px] text-outline uppercase font-bold">
              Week 11 (Even Sem)
            </span>
          </div>

          <div className="mt-3 space-y-2.5 font-body-sm text-xs">
            <Link
              to="/clubs"
              className="flex items-start gap-2.5 p-1.5 rounded hover:bg-surface-container-low transition-colors group"
            >
              <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-title-md text-[11px] shrink-0 font-bold">
                MON 17
              </span>
              <div>
                <span className="font-title-md text-on-surface group-hover:text-primary">
                  Rotaract & Leo Club Auditions
                </span>
                <span className="block text-outline text-[11px]">
                  4:00 PM • Mech Block Seminar Hall
                </span>
              </div>
            </Link>

            <Link
              to="/events/eec-ev-007"
              className="flex items-start gap-2.5 p-1.5 rounded hover:bg-surface-container-low transition-colors group"
            >
              <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-title-md text-[11px] shrink-0 font-bold">
                WED 19
              </span>
              <div>
                <span className="font-title-md text-on-surface group-hover:text-primary">
                  National Level Paper Presentation (ELECTROFEST)
                </span>
                <span className="block text-outline text-[11px]">
                  Dept of EEE • TRP Auditorium Hall A
                </span>
              </div>
            </Link>

            <Link
              to="/events/eec-ev-005"
              className="flex items-start gap-2.5 p-1.5 rounded hover:bg-surface-container-low transition-colors group"
            >
              <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-title-md text-[11px] shrink-0 font-bold">
                THU 20
              </span>
              <div>
                <span className="font-title-md text-on-surface group-hover:text-primary">
                  Meta Staff Engineer Alumni Talk (Karthik Sundaram)
                </span>
                <span className="block text-outline text-[11px]">
                  3:30 PM • Mini Auditorium II
                </span>
              </div>
            </Link>

            <Link
              to="/events/eec-ev-003"
              className="flex items-start gap-2.5 p-1.5 rounded hover:bg-surface-container-low transition-colors group"
            >
              <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary font-title-md text-[11px] shrink-0 font-bold">
                SAT 22
              </span>
              <div>
                <span className="font-title-md text-on-surface group-hover:text-primary">
                  Autonomous Robotics & ROS2 BootCamp
                </span>
                <span className="block text-outline text-[11px]">
                  9:00 AM – 4:30 PM • R&A Labs
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-3 pt-2 text-right border-t border-surface-container">
            <Link
              to="/calendar"
              className="font-title-md text-xs text-primary hover:underline flex items-center justify-end gap-1"
            >
              <span>View Full Semester Academic Calendar</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* 2. Lost & Found Corkboard Area */}
        <div className="relative bg-surface-container-lowest/90 rounded-sm p-5 pt-7 shadow-[0_8px_20px_rgba(50,20,5,0.35)] transform lg:rotate-[1.2deg] hover:rotate-0 transition-transform border border-amber-900/10 flex flex-col justify-between">
          <Pushpin color="green" size="md" className="absolute -top-3 left-10 z-30" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-lg">
                  search_check
                </span>
                <h4 className="font-title-md text-base text-primary font-bold">
                  Lost & Found Cork
                </h4>
              </div>
              <button
                type="button"
                onClick={handleOpenPostModal}
                className="font-label-sm text-xs text-secondary hover:underline font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">add_circle</span>
                <span>Post Item</span>
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {/* Loading State */}
              {loading && items.length === 0 && (
                <div className="p-5 bg-amber-50/60 rounded text-center border border-dashed border-amber-900/20 text-xs text-outline animate-pulse flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm animate-spin text-secondary">
                    progress_activity
                  </span>
                  <span>Loading verified campus notices…</span>
                </div>
              )}

              {/* Error State: Explicit failure notice, no silent fallback to mock data */}
              {error && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 text-red-900 border border-red-200 rounded text-xs space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-sm text-red-700">
                      cloud_off
                    </span>
                    <span>Lost & Found Sync Issue</span>
                  </div>
                  <p className="text-[11px] leading-snug">{error}</p>
                  <button
                    type="button"
                    onClick={loadLostFoundItems}
                    className="mt-1 px-2 py-0.5 bg-white border border-red-300 rounded text-[10px] font-bold text-red-900 hover:bg-red-100 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">refresh</span>
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && items.length === 0 && (
                <div className="p-5 bg-amber-50/50 rounded text-center border border-dashed border-amber-900/20">
                  <span className="material-symbols-outlined text-outline text-2xl mb-1">
                    inventory_2
                  </span>
                  <p className="font-title-md text-xs text-on-surface font-bold">
                    No Lost & Found Items Reported
                  </p>
                  <p className="text-[11px] text-outline mt-0.5">
                    All campus property has been claimed or resolved.
                  </p>
                </div>
              )}

              {/* Loaded Approved Items */}
              {items.map((item, idx) => {
                const isLost = item.reportType === 'LOST';
                const rotationClass = idx % 2 === 0 ? 'transform -rotate-1' : 'transform rotate-1';
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded shadow-sm ${rotationClass} border transition-all hover:rotate-0 ${
                      isLost
                        ? 'bg-rose-100/95 border-rose-200 text-rose-950'
                        : 'bg-amber-100/95 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between text-[10px] font-bold uppercase ${
                        isLost ? 'text-rose-900' : 'text-amber-900'
                      }`}
                    >
                      <span>{isLost ? '🔴 Lost Item' : '🟢 Found Item'}</span>
                      {item.createdAt && <span>{formatItemDate(item.createdAt)}</span>}
                    </div>

                    {item.hasImage && item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={`Photo of ${item.itemName}`}
                        className="mt-2 h-24 w-full rounded object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}

                    <p
                      className={`font-title-md text-xs mt-1 font-bold ${
                        isLost ? 'text-rose-950' : 'text-amber-950'
                      }`}
                    >
                      {item.itemName}
                    </p>

                    <div
                      className={`flex items-center gap-1 text-[10px] mt-0.5 font-bold ${
                        isLost ? 'text-rose-800' : 'text-amber-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      <span>{item.location}</span>
                    </div>

                    <p
                      className={`text-[11px] mt-1 leading-snug ${
                        isLost ? 'text-rose-900' : 'text-amber-900'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2 text-center border-t border-surface-container">
            <span className="font-body-sm text-[11px] text-outline">
              Verified items can be claimed at Student Affairs Desk (Main Block Rm 104).
            </span>
          </div>
        </div>
      </div>

      {/* 3. Faculty & Student Affairs Advisory */}
      <article className="notice-card lg:col-span-4 relative group transform lg:-rotate-[1deg] hover:rotate-0 hover:scale-[1.01] transition-all duration-300">
        <Pushpin color="brass" size="md" className="absolute -top-3 left-1/2 -translate-x-1/2 z-30" />

        <div className="relative bg-[#FFF9E6] rounded-sm p-5 sm:p-6 pt-7 shadow-[0_10px_25px_-4px_rgba(50,20,5,0.4),0_3px_6px_rgba(0,0,0,0.15)] border border-amber-900/10">
          <div className="flex items-center gap-1.5 text-secondary font-label-sm text-[11px] uppercase font-bold pb-2">
            <span className="material-symbols-outlined text-sm">security</span>
            <span>Campus Advisory • Student Affairs</span>
          </div>

          <h4 className="font-headline-sm text-base text-primary font-serif font-bold">
            Campus Transport & ID Card Protocols
          </h4>

          <div className="mt-3 space-y-2 text-xs font-body-sm text-on-surface-variant">
            <div className="p-2 bg-amber-50 rounded border border-amber-200/50">
              <p>
                <strong>1. Special Symposium Buses:</strong> Return buses will ply at 5:15 PM from Main Gate to Tambaram, CMBT, and Avadi during HackEaswari & Workshop days.
              </p>
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-200/50">
              <p>
                <strong>2. RFID ID Badges:</strong> Physical RFID smart cards must be tapped at turnstiles. Digital phone screenshots will not be accepted.
              </p>
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-200/50">
              <p>
                <strong>3. Parking Sticker:</strong> Two-wheeler student parking permit renewals for Even Semester are open at Security Main Gate cabin.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-amber-900/10 flex items-center justify-between text-xs text-outline">
            <span>Office of Dean (Student Affairs)</span>
            <span className="font-bold text-primary">Helpline Ext: 204</span>
          </div>
        </div>
      </article>

      {/* Lost & Found Item Submission Modal */}
      <LostItemSubmissionModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSuccess={() => loadLostFoundItems()}
      />
    </>
  );
};

