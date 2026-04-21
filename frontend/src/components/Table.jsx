import React from 'react';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-100">
            {headers.map((header, idx) => (
              <th key={idx} className="pb-4 pt-2 font-bold text-primary/70 uppercase text-xs tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              {renderRow(item, idx)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
