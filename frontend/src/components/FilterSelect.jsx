import React from 'react';

const FilterSelect = ({ value, onChange, options, placeholder = 'Filtrer' }) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default FilterSelect;
