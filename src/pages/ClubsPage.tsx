import React, { useState } from 'react';
import { clubService } from '../services/clubService';
import { ClubCard } from '../components/clubs/ClubCard';
import { Pushpin } from '../components/common/Pushpin';

export const ClubsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [recruitmentStatus, setRecruitmentStatus] = useState('all');

  const filteredClubs = clubService.filterClubs({
    searchQuery,
    category,
    recruitmentStatus,
  });

  return (
    <div className="w-full bg-[#84532B] p-2 sm:p-4 lg:p-6 shadow-[inset_0_12px_30px_rgba(0,0,0,0.55)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto rounded-xl p-3 sm:p-5 lg:p-7 bg-gradient-to-b from-[#633a1e] via-[#502e17] to-[#3a1f0c] shadow-[0_25px_60px_-15px_rgba(30,15,5,0.7)]">
        <div
          className="rounded-lg p-4 sm:p-6 lg:p-8 min-h-[850px] shadow-[inset_0_8px_30px_rgba(25,12,4,0.7)]"
          style={{
            backgroundColor: '#9B6338',
            backgroundImage:
              'radial-gradient(circle at 18% 12%, rgba(255,238,200,0.22) 0%, transparent 45%), radial-gradient(circle at 82% 88%, rgba(40,18,6,0.3) 0%, transparent 60%), radial-gradient(#6c3f1d 1.2px, transparent 1.2px), radial-gradient(#b87f4e 1px, transparent 1px)',
            backgroundSize: '100% 100%, 100% 100%, 14px 14px, 18px 18px',
          }}
        >
          {/* Header Plaque */}
          <div className="relative bg-surface-container-low/95 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-[0_12px_28px_rgba(60,30,10,0.45)] mb-8 border border-amber-900/10">
            <Pushpin color="navy" size="md" className="absolute -top-3 left-6" />
            <Pushpin color="navy" size="md" className="absolute -top-3 right-6" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-surface-container">
              <div>
                <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                  Student Clubs & Societies Directory
                </h1>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-0.5">
                  Directorate of Student Affairs • Auditions & Recruitment Portal
                </p>
              </div>

              <span className="px-2.5 py-1 bg-secondary text-on-secondary rounded text-xs font-title-md self-start md:self-auto">
                {filteredClubs.length} Active Clubs Listed
              </span>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-title-md">
              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Search Club or Wing
                </label>
                <div className="relative flex items-center bg-surface-container-lowest rounded px-2.5 py-1.5 border border-amber-900/15 shadow-inner">
                  <span className="material-symbols-outlined text-outline text-base mr-1">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, wing, keyword..."
                    className="w-full bg-transparent text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value="all">All Club Domains</option>
                  <option value="Technical">Technical & Research</option>
                  <option value="Social & Service">Social & Leadership</option>
                  <option value="Cultural">Cultural & Fine Arts</option>
                  <option value="Innovation">Automotive & Innovation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Audition Status
                </label>
                <select
                  value={recruitmentStatus}
                  onChange={(e) => setRecruitmentStatus(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value="all">Any Status</option>
                  <option value="Open">Auditions Open</option>
                  <option value="Opening Soon">Opening Soon</option>
                  <option value="Closed">Recruitment Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Pinned Club Cards */}
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="p-10 bg-[#FFFDF7] rounded-sm text-center border-2 border-dashed border-amber-900/20 shadow-md max-w-md mx-auto">
              <span className="material-symbols-outlined text-outline text-4xl mb-2">
                groups
              </span>
              <h3 className="font-headline-sm text-base text-primary font-bold">
                No clubs matched your search
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                  setRecruitmentStatus('all');
                }}
                className="mt-3 bg-primary text-on-primary px-3 py-1.5 rounded text-xs font-title-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
