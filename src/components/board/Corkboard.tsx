import React from 'react';
import { Pushpin } from '../common/Pushpin';

interface CorkboardProps {
  children: React.ReactNode;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  categoriesWithCounts?: { key: string; label: string; count: number }[];
  sortValue?: string;
  onSortChange?: (val: string) => void;
  onQuickPinClick?: () => void;
  urgentCount?: number;
}

export const Corkboard: React.FC<CorkboardProps> = ({
  children,
  activeFilter = 'all',
  onFilterChange,
  categoriesWithCounts = [
    { key: 'all', label: 'All Notices', count: 24 },
    { key: 'Hackathon', label: '🚀 Hackathons', count: 4 },
    { key: 'Workshop', label: '🛠️ Workshops', count: 6 },
    { key: 'Academic', label: '📜 Exam & Circulars', count: 5 },
    { key: 'Club Activity', label: '🎭 Club Recruitment', count: 5 },
    { key: 'Cultural Event', label: '🏆 Culturals', count: 4 },
  ],
  sortValue = 'urgency',
  onSortChange,
  onQuickPinClick,
  urgentCount = 8,
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)]">
      {/* Outer Simulated Deep Oak Wood Bevel Frame */}
      <div className="relative w-full rounded-xl p-3 sm:p-5 lg:p-7 shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7),inset_0_4px_16px_rgba(255,230,190,0.18),inset_0_-8px_16px_rgba(0,0,0,0.4)] bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c]">
        {/* Realistic Cork Canvas Surface */}
        <div
          id="corkboard-canvas"
          className="relative w-full rounded-lg min-h-[850px] p-3 sm:p-6 lg:p-8 shadow-[inset_0_8px_30px_rgba(25,12,4,0.7),inset_0_0_80px_rgba(0,0,0,0.45)] transition-all duration-300"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
            backgroundPosition: '0 0, 0 0, 0 0, 7px 7px',
          }}
        >
          {/* Ambient Warm Window Sunlight Beam Overlay */}
          <div
            className="pointer-events-none absolute -top-24 -left-20 w-[650px] h-[550px] bg-gradient-to-br from-amber-100/20 via-orange-50/10 to-transparent blur-3xl transform rotate-12 mix-blend-soft-light"
            aria-hidden="true"
          />

          {/* ==========================================
              CORKBOARD CONTROLS STRIP (PINNED ON TOP)
              ========================================== */}
          <div className="relative z-20 mb-6 sm:mb-8">
            <div className="relative bg-surface-container-low/95 backdrop-blur-sm rounded-lg p-3.5 sm:p-5 shadow-[0_12px_28px_-4px_rgba(60,30,10,0.45),0_3px_6px_rgba(0,0,0,0.2)] border border-amber-900/10">
              {/* Brass Pins holding Strip Corners */}
              <Pushpin color="brass" size="md" className="absolute -top-3 left-4" />
              <Pushpin color="brass" size="md" className="absolute -top-3 right-4" />

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                {/* Left: Hand-pinned Wood Badge & Title */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 bg-[#452712] text-amber-100 px-2.5 sm:px-3 py-1 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                    <span className="material-symbols-outlined text-amber-300 text-sm">
                      push_pin
                    </span>
                    <span className="font-label-sm text-[11px] tracking-wider uppercase font-bold">
                      EEC • NOTICE BOARD 2024-2025
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                    </span>
                    <span>{urgentCount} Active Urgent Updates Today</span>
                  </div>
                </div>

                {/* Center: Physical Index Sticky Tabs */}
                {onFilterChange && (
                  <div
                    className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none"
                    id="filter-tabs"
                  >
                    {categoriesWithCounts.map((tab) => {
                      const isActive = activeFilter.toLowerCase() === tab.key.toLowerCase();
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => onFilterChange(tab.key)}
                          className={`filter-btn group relative px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-t font-title-md text-xs sm:text-body-sm shadow-sm flex items-center gap-1.5 transition-all whitespace-nowrap ${
                            isActive
                              ? 'bg-primary text-on-primary -translate-y-1 shadow-[0_-2px_6px_rgba(0,0,0,0.15)] font-bold'
                              : 'bg-surface-container-high hover:bg-surface-variant text-on-surface'
                          }`}
                        >
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
                          )}
                          <span>
                            {tab.label} ({tab.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Right: Sorting and Pin Event CTA */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end lg:self-auto">
                  {onSortChange && (
                    <div className="flex items-center bg-surface-container-lowest rounded px-2.5 py-1 shadow-[inset_0_1px_3px_rgba(80,40,20,0.15)] border border-amber-900/10">
                      <span className="material-symbols-outlined text-outline text-base mr-1">
                        sort
                      </span>
                      <select
                        value={sortValue}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-transparent font-label-md text-xs text-on-surface focus:outline-none cursor-pointer"
                        aria-label="Sort notices"
                      >
                        <option value="urgency">Urgency / Date</option>
                        <option value="recently-added">Recently Added</option>
                        <option value="deadline">Earliest Deadline</option>
                        <option value="title">Alphabetical (A-Z)</option>
                      </select>
                    </div>
                  )}

                  {onQuickPinClick && (
                    <button
                      type="button"
                      onClick={onQuickPinClick}
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3 sm:px-3.5 py-1.5 rounded font-title-md text-xs shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-base text-tertiary-fixed-dim">
                        add_circle
                      </span>
                      <span>Pin Request</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Campus Tagline strip */}
              <div className="mt-3 pt-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-on-surface-variant bg-surface-container/60 px-3 py-2 rounded text-xs border border-amber-900/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-base shrink-0">
                    school
                  </span>
                  <p className="font-body-sm text-[12px] leading-relaxed">
                    <strong className="font-title-md text-primary">Easwari Notice Board:</strong>{' '}
                    "Your Campus. Your Events. All in One Place." Real-time notices vetted by Autonomous Examination Cell & Directorate of Student Affairs.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] shrink-0 font-label-sm text-outline">
                  <span className="flex items-center gap-1 text-primary font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    Live Sync Active
                  </span>
                  <span>Campus: 31°C Ramapuram</span>
                </div>
              </div>
            </div>
          </div>

          {/* Children Slot (Grid of Notices or Views) */}
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
};
