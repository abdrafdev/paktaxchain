import React from 'react';
import { useState, useEffect } from 'react';

export default function AlertsPage() {
  const [alertsList, setAlertsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch for alerts
    setTimeout(() => {
      setAlertsList([
        { id: 1, date: '2025-01-15', type: 'Duplicate CNIC', cnic: '12345-1234567-1', message: 'CNIC already registered', severity: 'High' },
        { id: 2, date: '2025-01-14', type: 'Invalid Card', cnic: '23456-1234567-2', message: 'CNIC scan failed validation', severity: 'Medium' },
        { id: 3, date: '2025-01-13', type: 'Suspicious Activity', cnic: '34567-1234567-3', message: 'Multiple tax payment attempts', severity: 'Low' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Security Alerts</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">CNIC Fraud Detection</h2>
            <ul>
              {alertsList.map(alert => (
                <li key={alert.id} className="mb-2">
                  {alert.date} - {alert.type} - {alert.cnic} - {alert.message} - {alert.severity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
