import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserByCNIC(cnic) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('cnic', cnic)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateUser(cnic, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('cnic', cnic)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Tax payment operations
  async createTaxPayment(paymentData) {
    const { data, error } = await supabase
      .from('tax_payments')
      .insert([paymentData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getTaxPaymentsByUser(cnic) {
    const { data, error } = await supabase
      .from('tax_payments')
      .select('*')
      .eq('cnic', cnic)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getTaxPaymentById(id) {
    const { data, error } = await supabase
      .from('tax_payments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateTaxPaymentStatus(id, status, blockchainTxHash = null) {
    const updates = { status }
    if (blockchainTxHash) updates.blockchain_tx_hash = blockchainTxHash
    
    const { data, error } = await supabase
      .from('tax_payments')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // City statistics
  async getCityStats() {
    const { data, error } = await supabase
      .from('tax_payments')
      .select('city, amount_pkr')
      .eq('status', 'completed')
    
    if (error) throw error
    
    // Group by city and calculate totals
    const cityStats = data.reduce((acc, payment) => {
      if (!acc[payment.city]) {
        acc[payment.city] = {
          city: payment.city,
          totalAmount: 0,
          paymentCount: 0
        }
      }
      acc[payment.city].totalAmount += payment.amount_pkr
      acc[payment.city].paymentCount += 1
      return acc
    }, {})
    
    return Object.values(cityStats)
  },

  // Admin operations
  async getTotalTaxCollected() {
    const { data, error } = await supabase
      .from('tax_payments')
      .select('amount_pkr')
      .eq('status', 'completed')
    
    if (error) throw error
    
    return data.reduce((total, payment) => total + payment.amount_pkr, 0)
  },

  async getRecentPayments(limit = 10) {
    const { data, error } = await supabase
      .from('tax_payments')
      .select(`
        *,
        users:cnic (
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // OTP operations
  async saveOTP(phone, otp, expiresAt) {
    const { data, error } = await supabase
      .from('otp_codes')
      .insert([{
        phone,
        otp,
        expires_at: expiresAt,
        used: false
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async verifyOTP(phone, otp) {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    
    if (data) {
      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', data.id)
    }
    
    return !!data
  }
}
