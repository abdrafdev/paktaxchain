import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

// Mock analytics data for demo
const mockAnalytics = {
  cityTaxData: [
    { city: 'Karachi', collected: 2548750, allocated: 2200000, population: 14916000 },
    { city: 'Lahore', collected: 1875000, allocated: 1650000, population: 11126000 },
    { city: 'Islamabad', collected: 1250000, allocated: 1100000, population: 1015000 },
    { city: 'Rawalpindi', collected: 890000, allocated: 780000, population: 2098000 },
    { city: 'Faisalabad', collected: 675000, allocated: 590000, population: 3204000 }
  ],
  
  anomalies: [
    { city: 'Multan', issue: 'Tax collection 40% below expected', severity: 'High' },
    { city: 'Peshawar', issue: 'Unusual payment pattern detected', severity: 'Medium' },
    { city: 'Quetta', issue: 'Population vs taxpayer ratio anomaly', severity: 'Critical' }
  ],
  
  trends: {
    monthlyGrowth: 12.5,
    yearlyGrowth: 24.8,
    topPerformingCity: 'Karachi',
    underPerformingCity: 'Quetta'
  }
}

// Check subscription access level
function checkSubscriptionAccess(subscription, requestedDataType) {
  if (!subscription) return false
  
  const accessLevels = {
    'ngo-basic': ['basic-city-data', 'anomalies'],
    'media-pro': ['basic-city-data', 'anomalies', 'trends', 'historical'],
    'government-insights': ['all'],
    'academic-access': ['basic-city-data', 'historical'],
    'enterprise': ['all']
  }
  
  const userAccess = accessLevels[subscription.plan_id] || []
  return userAccess.includes(requestedDataType) || userAccess.includes('all')
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email, dataType = 'basic-city-data' } = req.query
    
    try {
      // Check user subscription
      let subscription = null
      if (supabase) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_email', email)
          .eq('status', 'active')
          .single()
        
        subscription = data
      }
      
      // Check access
      if (!checkSubscriptionAccess(subscription, dataType)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient subscription level for requested data',
          requiredPlans: ['media-pro', 'government-insights', 'enterprise']
        })
      }
      
      // Return requested data based on access level
      let responseData = {}
      
      if (dataType === 'basic-city-data' || dataType === 'all') {
        responseData.cityData = mockAnalytics.cityTaxData
      }
      
      if (dataType === 'anomalies' || dataType === 'all') {
        responseData.anomalies = mockAnalytics.anomalies
      }
      
      if (dataType === 'trends' || dataType === 'all') {
        responseData.trends = mockAnalytics.trends
      }
      
      if (dataType === 'historical' || dataType === 'all') {
        responseData.historical = {
          lastSixMonths: [
            { month: 'Jan', collection: 5200000 },
            { month: 'Feb', collection: 4800000 },
            { month: 'Mar', collection: 5600000 },
            { month: 'Apr', collection: 6200000 },
            { month: 'May', collection: 6800000 },
            { month: 'Jun', collection: 7200000 }
          ]
        }
      }
      
      res.status(200).json({
        success: true,
        data: responseData,
        subscription: subscription?.plan_id || 'none',
        requestedBy: email,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      console.error('Analytics API error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics data',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
