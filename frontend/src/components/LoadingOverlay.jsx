import React from 'react';

const LoadingOverlay = ({ message = 'Chargement en cours...' }) => (
  <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
    <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"></path>
    </svg>
    {message}
  </div>
);

export default LoadingOverlay;
