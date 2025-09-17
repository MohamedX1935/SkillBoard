import React from 'react';

const DataTable = ({ columns, data, renderActions }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {column.header}
              </th>
            ))}
            {renderActions && <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-6 text-center text-sm text-slate-500">
                Aucun résultat
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={row.id || row._id} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-slate-700">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {renderActions && <td className="px-4 py-3 text-sm text-slate-700">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
