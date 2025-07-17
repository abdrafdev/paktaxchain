import React from 'react'
import { useState, useEffect } from 'react'

export default function CityInsights() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetch for city insights
    setTimeout(() => {
      setInsights([
        { city: 'Karachi', taxPaid: 4500000, fundReceived: 2250000, disparity: 50 },
        { city: 'Lahore', taxPaid: 5200000, fundReceived: 2600000, disparity: 50 },
        { city: 'Islamabad', taxPaid: 3000000, fundReceived: 2400000, disparity: 20 },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">City Insights</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Tax vs Fund Allocation</h2>
            <ul>
              {insights.map((insight, index) => (
                <li key={index} className="mb-2">
                  {insight.city}: Tax Paid ₨{insight.taxPaid.toLocaleString()} - Fund Received ₨{insight.fundReceived.toLocaleString()} - Disparity: {insight.disparity}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
