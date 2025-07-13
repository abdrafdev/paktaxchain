import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { PAKISTANI_CITIES } from '../lib/pakistaniTaxCalculator'
import { dbHelpers } from '../lib/supabaseClient'
import { ethers } from 'ethers'
import { hashCNIC as hashCNICUtil } from '../lib/contracts'

// Smart contract ABI and address (update as needed)
const PAK_TAX_LOG_ABI = [
  // Only the registerTaxpayer function
  "function registerTaxpayer(string hashedCNIC, string city, string phoneNumber) external"
]
const PAK_TAX_LOG_ADDRESS = process.env.NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS || "0xYourContractAddressHere"

// Fallback mock DB
const mockDB = []

function generateTaxpayerId() {
  return 'TXP-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

export default function CNICRegistrationPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    city: '',
    phone: ''
  })
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [taxpayerId, setTaxpayerId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Validate registration form
  const validateForm = () => {
    if (!formData.name.trim() || formData.name.length < 3) {
      toast.error('Full name is required (min 3 chars)')
      return false
    }
    if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
      toast.error('Invalid CNIC format (12345-1234567-1)')
      return false
    }
    if (!formData.city) {
      toast.error('Please select a city')
      return false
    }
    if (!/^((\+92|92|0)?[0-9]{10})$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      toast.error('Invalid Pakistani phone number')
      return false
    }
    return true
  }

  // Handle registration submit
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      // Check if user already exists in Supabase (if available)
      if (dbHelpers && dbHelpers.getUserByCNIC) {
        const existing = await dbHelpers.getUserByCNIC(formData.cnic)
        if (existing) {
          toast.error('User with this CNIC already exists')
          setIsLoading(false)
          return
        }
      }
      // Simulate sending OTP
      const otpCode = (Math.floor(100000 + Math.random() * 900000)).toString()
      setGeneratedOtp(otpCode)
      setStep(2)
      toast.success(`Simulated OTP sent: ${otpCode}`)
    } catch (err) {
      toast.error('Error checking user. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP verification and registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp !== generatedOtp) {
      toast.error('Incorrect OTP. Please try again.')
      return
    }
    setIsLoading(true)
    try {
      // 1. Save user to Supabase (if available)
      let newTaxpayerId = generateTaxpayerId()
      let supabaseSuccess = false
      if (dbHelpers && dbHelpers.createUser) {
        try {
          await dbHelpers.createUser({
            cnic: formData.cnic,
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            taxpayer_id: newTaxpayerId,
            registered_at: new Date().toISOString(),
            status: 'active'
          })
          supabaseSuccess = true
        } catch (err) {
          // fallback to mockDB
          supabaseSuccess = false
        }
      }
      if (!supabaseSuccess) {
        mockDB.push({ ...formData, taxpayerId: newTaxpayerId })
      }
      // 2. Register user on blockchain (PakTaxLog)
      // Connect to wallet (assume window.ethereum/metamask)
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(PAK_TAX_LOG_ADDRESS, PAK_TAX_LOG_ABI, signer)
        // Hash CNIC for privacy
        const hashedCNIC = hashCNICUtil(formData.cnic)
        // Call contract
        const tx = await contract.registerTaxpayer(hashedCNIC, formData.city, formData.phone)
        await tx.wait()
      }
      setTaxpayerId(newTaxpayerId)
      setStep(3)
      toast.success('Registration successful!')
    } catch (err) {
      toast.error('Blockchain registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-pakistan-green mb-6 text-center">
            CNIC Registration
          </h1>

          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Muhammad Ahmad Khan"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNIC *</label>
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={e => handleChange('cnic', e.target.value)}
                  placeholder="12345-1234567-1"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <select
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                  disabled={isLoading}
                >
                  <option value="">Select City</option>
                  {PAKISTANI_CITIES.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pakistan-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Register & Get OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center mb-4">
                <p className="text-gray-700">Enter the 6-digit OTP sent to your phone (simulated):</p>
              </div>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green text-center text-lg tracking-widest"
                placeholder="------"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="w-full bg-pakistan-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-4xl mb-2">✔️</div>
              <h2 className="text-xl font-bold">Registration Successful!</h2>
              <p className="text-gray-700">Your unique Taxpayer ID:</p>
              <div className="text-lg font-mono bg-gray-100 rounded p-2 inline-block border border-gray-300">
                {taxpayerId}
              </div>
              <p className="text-gray-500 text-sm mt-2">Please save this ID for your records.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 