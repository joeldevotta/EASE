import React, { useState } from 'react';
import { appConfig } from '../config/appConfig';
import { Pushpin } from '../components/common/Pushpin';

export const ContactPage: React.FC = () => {
  const [inquiry, setInquiry] = useState({
    name: '',
    registerNumber: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.email || !inquiry.message) return;
    setSubmitted(true);
  };

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
          <article className="relative bg-[#FFFEFA] rounded-sm p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,15,5,0.5)] border border-amber-900/10">
            <Pushpin color="navy" size="lg" className="absolute -top-3.5 left-10" />
            <Pushpin color="brass" size="lg" className="absolute -top-3.5 right-10" />

            <div className="pb-5 border-b border-surface-container">
              <span className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold block">
                Easwari Engineering College (Autonomous)
              </span>
              <h1 className="font-display-lg text-2xl sm:text-3xl text-primary font-serif font-bold mt-1">
                Campus Directory & Notice Desk Support
              </h1>
              <p className="font-title-md text-xs text-outline mt-1">
                Have an inquiry about an event poster, timetable correction, or club recruitment?
              </p>
            </div>

            {/* Official Coordinates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-surface-container-low rounded border border-amber-900/10 text-xs">
                <span className="material-symbols-outlined text-primary text-xl mb-1">
                  location_on
                </span>
                <span className="font-title-md text-primary font-bold block text-sm">
                  Campus Address
                </span>
                <p className="font-body-sm text-on-surface-variant mt-1 leading-snug">
                  {appConfig.campusAddress}
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded border border-amber-900/10 text-xs">
                <span className="material-symbols-outlined text-secondary text-xl mb-1">
                  call
                </span>
                <span className="font-title-md text-secondary font-bold block text-sm">
                  Official Helpline
                </span>
                <p className="font-title-md text-on-surface mt-1 font-bold">
                  {appConfig.helplinePhone}
                </p>
                <p className="text-outline text-[11px] mt-0.5">
                  Helpline Ext: <strong>{appConfig.helplineExt}</strong> (Main Block)
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded border border-amber-900/10 text-xs">
                <span className="material-symbols-outlined text-emerald-700 text-xl mb-1">
                  mail
                </span>
                <span className="font-title-md text-emerald-800 font-bold block text-sm">
                  Inquiry Portals
                </span>
                <p className="text-on-surface mt-1">
                  COE Desk: <a href={`mailto:${appConfig.examCellEmail}`} className="underline">{appConfig.examCellEmail}</a>
                </p>
                <p className="text-on-surface mt-0.5">
                  Student Affairs: <a href={`mailto:${appConfig.studentAffairsEmail}`} className="underline">{appConfig.studentAffairsEmail}</a>
                </p>
              </div>
            </div>

            {/* In-Person Physical Office Rooms */}
            <div className="p-4 bg-surface-container rounded border-l-4 border-primary text-xs mb-8">
              <span className="font-title-md text-primary font-bold block text-xs uppercase">
                Physical Office Counters:
              </span>
              <ul className="mt-1 space-y-1 text-on-surface-variant font-body-sm">
                <li>• <strong>Directorate of Student Affairs:</strong> Main Block Room 104 (Ground Floor)</li>
                <li>• <strong>Office of Controller of Examinations:</strong> COE Building 1st Floor</li>
                <li>• <strong>Lost & Found Property Desk:</strong> Security Main Gate Cabin & Rm 104</li>
              </ul>
            </div>

            {/* Digital Contact Inquiry Form */}
            <div className="pt-2">
              <h2 className="font-headline-sm text-lg text-primary font-serif font-bold mb-1">
                Dispatch an Inquiry or Notice Correction
              </h2>
              <p className="text-xs text-outline mb-4">
                Requests are processed by Student Affairs officers during college working hours (8:30 AM – 4:30 PM).
              </p>

              {submitted ? (
                <div className="p-5 bg-emerald-50 rounded border border-emerald-300 text-xs text-emerald-900">
                  <span className="font-bold text-sm block">Inquiry Submitted Successfully!</span>
                  <p className="mt-1">
                    Thank you, {inquiry.name}. Your inquiry concerning "{inquiry.subject || inquiry.category}" has been registered in the demo support queue.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setInquiry({
                        name: '',
                        registerNumber: '',
                        email: '',
                        category: 'General Inquiry',
                        subject: '',
                        message: '',
                      });
                    }}
                    className="mt-3 bg-primary text-on-primary px-3.5 py-1.5 rounded font-title-md"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-title-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-outline uppercase mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={inquiry.name}
                        onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                        placeholder="e.g., K. Abhinav"
                        className="w-full bg-surface-container-low px-3 py-2 rounded text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-outline uppercase mb-1">Student Register / Employee ID</label>
                      <input
                        type="text"
                        value={inquiry.registerNumber}
                        onChange={(e) => setInquiry({ ...inquiry, registerNumber: e.target.value })}
                        placeholder="310621104xxx"
                        className="w-full bg-surface-container-low px-3 py-2 rounded text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-outline uppercase mb-1">Official Email Address *</label>
                      <input
                        type="email"
                        required
                        value={inquiry.email}
                        onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                        placeholder="student@easwari.ac.in"
                        className="w-full bg-surface-container-low px-3 py-2 rounded text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-outline uppercase mb-1">Inquiry Domain</label>
                      <select
                        value={inquiry.category}
                        onChange={(e) => setInquiry({ ...inquiry, category: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Event Poster Correction</option>
                        <option>Club Listing Update</option>
                        <option>Exam Timetable Clarification</option>
                        <option>Technical Issue with E.A.S.E.</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-outline uppercase mb-1">Subject</label>
                    <input
                      type="text"
                      value={inquiry.subject}
                      onChange={(e) => setInquiry({ ...inquiry, subject: e.target.value })}
                      placeholder="e.g., Query regarding HackEaswari Round 1 venue change"
                      className="w-full bg-surface-container-low px-3 py-2 rounded text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-outline uppercase mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={inquiry.message}
                      onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                      placeholder="Please describe your question or correction in detail..."
                      className="w-full bg-surface-container-low px-3 py-2 rounded text-on-surface border border-amber-900/15 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded font-title-md text-xs shadow-[0_3px_0_#0f1f30] active:translate-y-0.5 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Dispatch Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
