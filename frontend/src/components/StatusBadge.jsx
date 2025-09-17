import React from 'react';

const colors = {
  Planifié: 'bg-slate-100 text-slate-700',
  'En cours': 'bg-amber-100 text-amber-700',
  Terminé: 'bg-emerald-100 text-emerald-700'
};

const StatusBadge = ({ status }) => {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
};

export default StatusBadge;
