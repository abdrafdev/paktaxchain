import React from 'react'
import { useState } from 'react'

export default function ApiDocs() {
  const [activeEndpoint, setActiveEndpoint] = useState('cities')

  const endpoints = {
    cities: {
      method: 'GET',
      url: '/api/v1/cities',
      description: 'Get city-wise tax collection data',
      response: {
        cities: [
          { name: 'Karachi', totalTax: 4500000, fundAllocated: 2250000, taxpayers: 1247, rank: 2 },
          { name: 'Lahore', totalTax: 5200000, fundAllocated: 2600000, taxpayers: 1456, rank: 1 }
        ]
      }
    },
    payments: {
      method: 'GET',
      url: '/api/v1/payments',
      description: 'Get recent tax payments',
      response: {
        payments: [
          { id: 'TXN-001', amount: 25000, city: 'Karachi', date: '2025-01-15', status: 'completed' },
          { id: 'TXN-002', amount: 15000, city: 'Lahore', date: '2025-01-14', status: 'completed' }
        ]
      }
    },
    fraud: {
      method: 'GET',
      url: '/api/v1/fraud-alerts',
      description: 'Get fraud detection alerts',
      response: {
        alerts: [
          { id: 1, type: 'Duplicate CNIC', severity: 'High', date: '2025-01-15' },
          { id: 2, type: 'Suspicious Payment', severity: 'Medium', date: '2025-01-14' }
        ]
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Documentation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
            <ul className="space-y-2">
              {Object.keys(endpoints).map(key => (
                <li key={key}>
                  <button
                    onClick={() => setActiveEndpoint(key)}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeEndpoint === key ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {endpoints[key].url}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {endpoints[activeEndpoint].method} {endpoints[activeEndpoint].url}
              </h3>
              <p className="text-gray-600 mb-4">{endpoints[activeEndpoint].description}</p>
              
              <h4 className="font-semibold mb-2">Response Example:</h4>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(endpoints[activeEndpoint].response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
