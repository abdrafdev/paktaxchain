import React from 'react';
import { useState } from 'react';

export default function ExportPage() {
  const [exportType, setExportType] = useState('csv');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleExport = () => {
    console.log('Exporting data...', { exportType, dateRange });
    // Implement export logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Data Export</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Export Tax Data</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select 
              value={exportType} 
              onChange={(e) => setExportType(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
