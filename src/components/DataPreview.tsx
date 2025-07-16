import React from 'react';
import { Table, Eye } from 'lucide-react';
import type { PortfolioData } from './PortfolioAIChat';

interface DataPreviewProps {
  data: PortfolioData;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const { headers, data: rows } = data;
  const previewRows = rows.slice(0, 10); // Show first 10 rows

  return (
    <div className="bg-white border border-forest-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-forest-50 px-6 py-4 border-b border-forest-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-forest-700" />
          Portfolio Data Preview
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Showing {previewRows.length} of {rows.length} rows
        </p>
      </div>

      <div className="overflow-x-auto max-h-80">
        <table className="w-full">
          <thead className="bg-forest-50 sticky top-0">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-forest-800 uppercase tracking-wider border-b border-forest-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-100">
            {previewRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-forest-50 transition-colors ${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-forest-25'
                }`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {cell || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 10 && (
        <div className="bg-forest-50 px-6 py-3 border-t border-forest-200">
          <p className="text-sm text-forest-700 text-center">
            ... and {rows.length - 10} more rows
          </p>
        </div>
      )}
    </div>
  );
};

export default DataPreview;