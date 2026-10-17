import React from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';
import { RubberStamp } from '../components/common/RubberStamp';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen py-8">
      <div className="max-w-4xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
        <div
          className="rounded-lg p-4 sm:p-8 min-h-[850px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)]"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
          }}
        >
          {/* Parchment Sheet */}
          <article className="relative bg-[#FFFEFA] rounded-sm p-6 sm:p-12 shadow-[0_20px_50px_rgba(40,15,5,0.5)] border border-amber-900/10">
            <Pushpin color="brass" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-10" />

            {/* Letterhead Top */}
            <div className="text-center pb-6 border-b border-surface-container">
              <img
                src={appConfig.emblemUrl}
                alt="Easwari Engineering College Seal"
                className="h-16 w-auto mx-auto mb-2 object-contain"
              />
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold block">
                {appConfig.collegeName}
              </span>
              <p className="font-label-sm text-[11px] text-outline uppercase tracking-wider mt-0.5">
                {appConfig.affiliation}
              </p>
              <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold mt-3">
                About E.A.S.E. Bulletin Platform
              </h1>
              <p className="font-title-md text-xs sm:text-sm text-secondary italic font-serif mt-1">
                "Easwari Academic Schedule and Events — Your Campus. Your Events. All in One Place."
              </p>
            </div>

            {/* Story & Objective */}
            <div className="mt-8 space-y-6 text-xs sm:text-sm text-on-surface-variant font-body-sm leading-relaxed">
              <div>
                <h2 className="font-headline-sm text-base sm:text-lg text-primary font-serif font-bold mb-2">
                  1. The Digital Bulletin Metaphor
                </h2>
                <p>
                  For decades, college life was centered around the physical cork notice board outside the Main Block and Dean's corridor. Students gathered between lecture bells to read pinned posters for symposiums, exam timetables, hackathon deadlines, and club recruitment trials.
                </p>
                <p className="mt-2">
                  <strong>E.A.S.E.</strong> translates the intuitive warmth, tactile depth, and spontaneous community spirit of a physical collegiate corkboard into a modern, responsive, and accessible digital portal without turning it into a sterile corporate dashboard.
                </p>
              </div>

              <div>
                <h2 className="font-headline-sm text-base sm:text-lg text-primary font-serif font-bold mb-2">
                  2. Core Capabilities for Students
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-surface-container-low rounded border-l-4 border-primary">
                    <span className="font-title-md text-xs text-primary font-bold block">
                      🚀 Centralized Event Discovery
                    </span>
                    <p className="text-[11px] mt-0.5">
                      Filter upcoming national hackathons, technical symposia, alumni keynotes, and workshops across all engineering disciplines.
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded border-l-4 border-secondary">
                    <span className="font-title-md text-xs text-secondary font-bold block">
                      📜 Autonomous Circulars
                    </span>
                    <p className="text-[11px] mt-0.5">
                      Access verified dispatches, practical lab schedules, and end-semester timetables released directly by the Controller of Examinations.
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded border-l-4 border-emerald-700">
                    <span className="font-title-md text-xs text-emerald-800 font-bold block">
                      🎭 Student Club Directory
                    </span>
                    <p className="text-[11px] mt-0.5">
                      Explore active youth clubs, leadership wings, audition venues, walk-in dates, and faculty advisor contact coordinates.
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded border-l-4 border-amber-600">
                    <span className="font-title-md text-xs text-amber-900 font-bold block">
                      📅 Synchronized Calendar & ICS
                    </span>
                    <p className="text-[11px] mt-0.5">
                      Browse monthly schedules by date and export deadlines into your personal phone calendar (.ics).
                    </p>
                  </div>
                </div>
              </div>

              {/* Administrative Disclaimer */}
              <div className="p-4 bg-amber-50 rounded border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-1.5 font-title-md text-xs font-bold text-amber-900 uppercase">
                  <span className="material-symbols-outlined text-sm text-amber-700">
                    verified_user
                  </span>
                  <span>Institutional Integration Boundary & Disclaimer</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  E.A.S.E. serves strictly as a <strong>discovery and schedule synchronization notice board</strong>. It complements, but does not replace, the official Autonomous COE Examination Portal (where formal hall tickets and grades reside) or the official On-Duty (OD) authorization workflows. Always ensure your faculty advisor verifies your external event participation.
                </p>
              </div>

              {/* Administrative Stamps */}
              <div className="pt-6 border-t border-surface-container flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <RubberStamp label="AUTONOMOUS" subLabel="EASE PLATFORM" code="EEC 2025" />
                  <div className="text-xs text-outline">
                    <span className="block font-bold text-primary">Directorate of Student Affairs</span>
                    <span>Easwari Engineering College, Chennai</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/events"
                    className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded text-xs font-title-md shadow-sm transition-colors"
                  >
                    Explore Notices →
                  </Link>
                  <Link
                    to="/contact"
                    className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded text-xs font-title-md transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
