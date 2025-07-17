import React from 'react'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const AdminAnalytics = dynamic(() => import('../../components/AdminAnalytics'), {
  ssr: false
})

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Analytics</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <AdminAnalytics loading={loading} />
        </div>
      </div>
    </div>
  )
}

