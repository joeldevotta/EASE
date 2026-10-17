import React, { useState } from 'react';
import { announcementService } from '../services/announcementService';
import { AnnouncementCard } from '../components/announcements/AnnouncementCard';
import { Pushpin } from '../components/common/Pushpin';

export const AnnouncementsPage: React.FC = () => {
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const announcements = announcementService.filterAnnouncements({
    category,
    priority,
    searchQuery,
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
            <Pushpin color="red" size="md" className="absolute -top-3 left-6" />
            <Pushpin color="brass" size="md" className="absolute -top-3 right-6" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-surface-container">
              <div>
                <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold">
                  Official Academic Circulars & Campus Notices
                </h1>
                <p className="font-label-sm text-xs text-outline uppercase tracking-wider mt-0.5">
                  Published by Office of Controller of Examinations & Dean of Student Affairs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-title-md">
                  Autonomous Official Gazette
                </span>
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-title-md">
              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Search Circular or Subject
                </label>
                <div className="relative flex items-center bg-surface-container-lowest rounded px-2.5 py-1.5 border border-amber-900/15 shadow-inner">
                  <span className="material-symbols-outlined text-outline text-base mr-1">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keywords or ref number..."
                    className="w-full bg-transparent text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Notice Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value="all">All Notice Types</option>
                  <option value="Academic">Academic & Timetable</option>
                  <option value="Event Deadlines">Event Deadlines</option>
                  <option value="Club Recruitment">Club Recruitment</option>
                  <option value="Emergency & Advisory">Transport & Advisory</option>
                  <option value="General Notices">Lost & Found / General</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-outline uppercase mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded px-2.5 py-1.5 text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value="all">All Priorities</option>
                  <option value="Urgent">Urgent Dispatches</option>
                  <option value="Important">Important Notices</option>
                  <option value="Normal">General Information</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {announcements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
