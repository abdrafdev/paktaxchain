import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

// Mock payment processing for subscriptions
function processSubscriptionPayment(planId, userEmail, paymentMethod) {
  // In production, integrate with Stripe/PayPal/Pakistani payment gateways
  return {
    success: true,
    transactionId: `SUB-${Date.now()}`,
    planId,
    userEmail,
    paymentMethod,
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { planId, userEmail, paymentMethod, organizationType } = req.body

    try {
      // Process payment
      const payment = processSubscriptionPayment(planId, userEmail, paymentMethod)
      
      if (payment.success) {
        // Create subscription record
        const subscriptionData = {
          plan_id: planId,
          user_email: userEmail,
          organization_type: organizationType,
          status: 'active',
          payment_method: paymentMethod,
          transaction_id: payment.transactionId,
          start_date: payment.startDate,
          end_date: payment.endDate,
          created_at: new Date().toISOString()
        }

        // Save to database (if Supabase is configured)
        if (supabase) {
          const { data, error } = await supabase
            .from('subscriptions')
            .insert([subscriptionData])
            .select()
          
          if (error) throw error
        }

        res.status(200).json({
          success: true,
          subscription: subscriptionData,
          message: 'Subscription activated successfully'
        })
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment failed'
        })
      }
    } catch (error) {
      console.error('Subscription error:', error)
      res.status(500).json({
        success: false,
        message: 'Subscription processing failed',
        error: error.message
      })
    }
  } else if (req.method === 'GET') {
    // Get user's subscription status
    const { email } = req.query
    
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_email', email)
          .eq('status', 'active')
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        
        res.status(200).json({
          success: true,
          subscription: data
        })
      } else {
        res.status(200).json({
          success: true,
          subscription: null
        })
      }
    } catch (error) {
      console.error('Get subscription error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get subscription',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
