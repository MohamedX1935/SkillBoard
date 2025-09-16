import React from 'react';
import { InboxIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
    <InboxIcon className="h-10 w-10 text-slate-300" />
    <div>
      <h3 className="text-lg font-semibold text-secondary">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
