import React from 'react';
import { Link } from 'react-router-dom';
import { Pushpin } from '../components/common/Pushpin';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full bg-[#84532B] p-4 min-h-screen flex items-center justify-center">
      <div className="relative bg-[#FFFDF7] max-w-md w-full p-8 rounded-sm shadow-2xl border border-amber-900/15 text-center">
        <Pushpin color="red" size="md" className="absolute -top-3 left-1/2 -translate-x-1/2" />
        <span className="material-symbols-outlined text-outline text-5xl mb-2">
          sentiment_dissatisfied
        </span>
        <h1 className="font-display-lg text-3xl text-primary font-serif font-bold">
          404 — Notice Not Found
        </h1>
        <p className="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed">
          The notice or page pin you are looking for has been removed, relocated, or does not exist on this corkboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded text-xs font-title-md transition-colors"
          >
            Return to Notice Board
          </Link>
          <Link
            to="/events"
            className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded text-xs font-title-md transition-colors"
          >
            Search Notices
          </Link>
        </div>
      </div>
    </div>
  );
};
