import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {Icon && <Icon className="h-6 w-6" />}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-secondary">{value}</p>
        {trend && <span className="text-xs font-semibold text-emerald-600">{trend}</span>}
      </div>
    </div>
  </div>
);

export default StatCard;
