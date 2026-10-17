import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventItem } from '../../types/event';
import { Pushpin } from '../common/Pushpin';

interface CorkboardAccessoriesProps {
  onSelectEvent?: (event: EventItem) => void;
  onPostLostItem?: () => void;
}

export const CorkboardAccessories: React.FC<CorkboardAccessoriesProps> = ({
  onPostLostItem,
}) => {
  const [showLostItemModal, setShowLostItemModal] = useState(false);

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
        <div className="relative bg-surface-container-lowest/90 rounded-sm p-5 pt-7 shadow-[0_8px_20px_rgba(50,20,5,0.35)] transform lg:rotate-[1.2deg] hover:rotate-0 transition-transform border border-amber-900/10">
          <Pushpin color="green" size="md" className="absolute -top-3 left-10 z-30" />

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
              onClick={() => {
                if (onPostLostItem) onPostLostItem();
                else setShowLostItemModal(true);
              }}
              className="font-label-sm text-xs text-secondary hover:underline font-bold"
            >
              + Post Item
            </button>
          </div>

          <div className="space-y-3 mt-3">
            {/* Sticky 1: Found Calculator */}
            <div className="p-3 bg-amber-100/90 rounded shadow-sm transform -rotate-1 border border-amber-200">
              <div className="flex items-center justify-between text-[10px] text-amber-900 font-bold uppercase">
                <span>🟢 Found Item</span>
                <span>March 15, 2:30 PM</span>
              </div>
              <p className="font-title-md text-xs text-amber-950 mt-1 font-bold">
                Casio fx-991EX ClassWiz Calculator
              </p>
              <p className="text-[11px] text-amber-900 mt-0.5 leading-snug">
                Found under Table 4 in ECE Analog Lab 2. Name "Rahul K." scribbled on battery lid. Handed over to Lab Asst Mr. Murugan.
              </p>
            </div>

            {/* Sticky 2: Lost Charger */}
            <div className="p-3 bg-rose-100/90 rounded shadow-sm transform rotate-1 border border-rose-200">
              <div className="flex items-center justify-between text-[10px] text-rose-900 font-bold uppercase">
                <span>🔴 Lost Item</span>
                <span>March 14</span>
              </div>
              <p className="font-title-md text-xs text-rose-950 mt-1 font-bold">
                Dell 65W USB-C Laptop Charger
              </p>
              <p className="text-[11px] text-rose-900 mt-0.5 leading-snug">
                Left in Central Library 2nd Floor Silent Study cubicle. Has green rubber band around cable. Handed over to Desk.
              </p>
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

      {/* Lost item report guidance modal */}
      {showLostItemModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFDF7] max-w-md w-full rounded-lg p-6 shadow-2xl border border-amber-900/10">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h4 className="font-headline-sm text-base text-primary font-bold">
                Post Item to Lost & Found Cork
              </h4>
              <button
                type="button"
                onClick={() => setShowLostItemModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <p className="mt-3 text-xs text-on-surface-variant font-body-sm leading-relaxed">
              To prevent fraudulent claims, all physical lost or found possessions (ID cards, calculators, chargers, keys, wallets) must be deposited in person at <strong>Main Block Room 104 (Directorate of Student Affairs)</strong>. The desk officer verifies ownership before issuing a digital sticky note to this corkboard.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLostItemModal(false)}
                className="bg-primary text-on-primary px-4 py-1.5 rounded text-xs font-title-md"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
