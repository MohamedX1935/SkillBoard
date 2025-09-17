import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchInput = ({ value, onChange, placeholder = 'Rechercher...' }) => (
  <div className="relative">
    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  </div>
);

export default SearchInput;
