import React from 'react'
import { useState, useEffect } from 'react'

export default function SubscriberDashboard() {
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetch for analytics
    setTimeout(() => {
      setAnalytics([
        { id: 1, city: 'Karachi', taxCollected: 4500000, developmentFund: 2250000 },
        { id: 2, city: 'Lahore', taxCollected: 5200000, developmentFund: 2600000 },
        { id: 3, city: 'Islamabad', taxCollected: 3000000, developmentFund: 1500000 },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscriber Dashboard</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">City Tax Analytics</h2>
            <ul>
              {analytics.map(item => (
                <li key={item.id} className="mb-2">
                  {item.city}: Tax Collected ₨{item.taxCollected.toLocaleString()} - Development Fund ₨{item.developmentFund.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
