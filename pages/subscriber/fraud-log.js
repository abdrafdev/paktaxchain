import React from 'react'
import { useState, useEffect } from 'react'

export default function FraudLog() {
  const [fraudData, setFraudData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetch for fraud data
    setTimeout(() => {
      setFraudData([
        { id: 1, date: '2025-01-15', type: 'Duplicate CNIC', severity: 'High', description: 'Multiple registrations with same CNIC' },
        { id: 2, date: '2025-01-14', type: 'Suspicious Payment', severity: 'Medium', description: 'Unusual payment pattern detected' },
        { id: 3, date: '2025-01-13', type: 'Invalid Scan', severity: 'Low', description: 'CNIC scan validation failed' },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Fraud Detection Log</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Fraud Alerts</h2>
            <ul>
              {fraudData.map(fraud => (
                <li key={fraud.id} className="mb-2">
                  {fraud.date} - {fraud.type} - {fraud.severity} - {fraud.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
