import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { Camera, Upload, CheckCircle, User, CreditCard, MapPin, Phone, Shield } from 'lucide-react'
import { PAKISTANI_CITIES } from '../lib/pakistaniTaxCalculator'
import { dbHelpers } from '../lib/supabaseClient'
import { ethers } from 'ethers'
import { hashCNIC as hashCNICUtil } from '../lib/contracts'
import Tesseract from 'tesseract.js'

// Smart contract integration
const PAK_TAX_LOG_ABI = [
  "function registerTaxpayer(string hashedCNIC, string city, string phoneNumber) external"
]
const PAK_TAX_LOG_ADDRESS = process.env.NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS || "0xYourContractAddressHere"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    city: '',
    phone: '',
    email: ''
  })
  const [cnicImage, setCnicImage] = useState(null)
  const [ocrResult, setOcrResult] = useState(null)
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [taxpayerId, setTaxpayerId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'CNIC Upload', icon: CreditCard },
    { id: 3, title: 'Phone Verify', icon: Phone },
    { id: 4, title: 'Complete', icon: CheckCircle }
  ]

  // Validate Pakistani CNIC from OCR text
  const validatePakistaniCNIC = (text) => {
    const indicators = {
      hasRepublicOfPakistan: /republic.{0,10}of.{0,10}pakistan/i.test(text),
      hasNationalIdentityCard: /national.{0,10}identity.{0,10}card/i.test(text),
      hasUrduText: /[\u0600-\u06FF]/.test(text),
      hasCNICNumber: /\d{5}-\d{7}-\d{1}/.test(text) || /\d{13}/.test(text),
      hasSignature: /signature/i.test(text) || /دستخط/i.test(text),
      hasAddress: /address/i.test(text) || /پتہ/i.test(text),
      hasName: /name/i.test(text) || /نام/i.test(text),
      hasIssueDate: /issue.{0,10}date/i.test(text) || /جاری.{0,10}تاریخ/i.test(text),
      hasValidPattern: /computerized.{0,10}national.{0,10}identity.{0,10}card/i.test(text),
      rejectsForeignID: !/passport/i.test(text) && !/driving.{0,10}license/i.test(text) && !/visa/i.test(text)
    };
    
    const score = Object.values(indicators).filter(Boolean).length;
    const confidence = (score / 10) * 100;
    
    return {
      isValid: score >= 5 && indicators.hasCNICNumber && indicators.rejectsForeignID,
      score: score,
      confidence: confidence,
      indicators: indicators
    };
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Step 1: Personal Information
  const handleStep1Submit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || formData.name.length < 3) {
      toast.error('Full name is required (minimum 3 characters)')
      return
    }
    
    if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
      toast.error('Invalid CNIC format (12345-1234567-1)')
      return
    }
    
    if (!formData.city) {
      toast.error('Please select a city')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (!/^((\\+92|92|0)?[0-9]{10})$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      toast.error('Invalid Pakistani phone number')
      return
    }
    
    setCurrentStep(2)
  }

  // Step 2: CNIC Image Upload and OCR
  const handleCnicImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB')
      return
    }
    
    setCnicImage(file)
    processCnicImage(file)
  }

  const processCnicImage = async (file) => {
    setOcrProcessing(true)
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      })
      
      const text = result.data.text.toLowerCase()
      setOcrResult(text)
      
      // Validate if it's a Pakistani National ID Card
      const isPakistaniCNIC = validatePakistaniCNIC(text)
      
      if (!isPakistaniCNIC.isValid) {
        toast.error('This is not a valid Pakistani National ID Card. Please upload the front side of your Pakistani CNIC.')
        setCnicImage(null)
        setOcrResult(null)
        setOcrProcessing(false)
        return
      }
      
      // Extract CNIC number from OCR text
      const cnicMatch = text.match(/\d{5}-\d{7}-\d{1}/) || text.match(/\d{13}/)
      if (cnicMatch) {
        let extractedCnic = cnicMatch[0]
        
        // Format 13-digit CNIC to standard format
        if (extractedCnic.length === 13) {
          extractedCnic = `${extractedCnic.substr(0, 5)}-${extractedCnic.substr(5, 7)}-${extractedCnic.substr(12, 1)}`
        }
        
        if (extractedCnic === formData.cnic) {
          toast.success('CNIC verified successfully!')
          setTimeout(() => setCurrentStep(3), 1500)
        } else {
          toast.error(`CNIC number does not match. Found: ${extractedCnic}, Expected: ${formData.cnic}`)
        }
      } else {
        toast.error('Could not extract CNIC from image. Please ensure the image is clear and try again.')
      }
    } catch (error) {
      toast.error('Error processing image. Please try again.')
      console.error('OCR Error:', error)
    } finally {
      setOcrProcessing(false)
    }
  }

  // Step 3: Phone Verification
  const sendOtp = async () => {
    setIsLoading(true)
    try {
      // Call the API endpoint to send OTP
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setGeneratedOtp(data.otp) // Store the OTP for verification
        toast.success(`OTP sent to ${formData.phone}. OTP: ${data.otp}`)
      } else {
        toast.error(data.message || 'Failed to send OTP')
      }
      
    } catch (error) {
      console.error('OTP sending error:', error)
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    
    // Verify OTP using the API
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          otp: otp
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        toast.error(data.message || 'Invalid OTP. Please try again.')
        return
      }
    } catch (error) {
      toast.error('OTP verification failed. Please try again.')
      return
    }
    
    setIsLoading(true)
    try {
      // Generate taxpayer ID
      const newTaxpayerId = 'TXP-' + Math.random().toString(36).substr(2, 8).toUpperCase()
      
      // Try to save to database (optional)
      let dbSuccess = false
      if (dbHelpers && dbHelpers.createUser) {
        try {
          await dbHelpers.createUser({
            cnic: formData.cnic,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            city: formData.city,
            taxpayer_id: newTaxpayerId,
            registered_at: new Date().toISOString(),
            status: 'active'
          })
          dbSuccess = true
          console.log('User saved to database successfully')
        } catch (err) {
          console.error('Database error (continuing without database):', err)
        }
      } else {
        console.log('Database not available, continuing without database')
      }
      
      // Skip blockchain registration for now to avoid MetaMask popup
      console.log('Skipping blockchain registration in development mode')
      // Uncomment below if you want blockchain registration:
      /*
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const contract = new ethers.Contract(PAK_TAX_LOG_ADDRESS, PAK_TAX_LOG_ABI, signer)
          
          const hashedCNIC = hashCNICUtil(formData.cnic)
          const tx = await contract.registerTaxpayer(hashedCNIC, formData.city, formData.phone)
          await tx.wait()
          
          toast.success('Successfully registered on blockchain!')
        } catch (error) {
          console.error('Blockchain registration error:', error)
          toast.error('Database registered but blockchain registration failed')
        }
      }
      */
      
      setTaxpayerId(newTaxpayerId)
      setCurrentStep(4)
      toast.success('Registration completed successfully!')
      
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pakistan-green via-pakistan-dark to-emerald-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Register as Taxpayer
            </h1>
            <p className="text-xl text-pakistan-light">
              Join Pakistan's transparent tax ecosystem
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-8">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    currentStep >= step.id ? 'text-pakistan-light' : 'text-white/50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= step.id
                        ? 'bg-pakistan-light text-pakistan-green'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <step.icon size={24} />
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Personal Information
                </h2>
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Muhammad Ahmad Khan"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNIC Number *
                      </label>
                      <input
                        type="text"
                        value={formData.cnic}
                        onChange={(e) => handleChange('cnic', e.target.value)}
                        placeholder="12345-1234567-1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                        required
                      >
                        <option value="">Select City</option>
                        {PAKISTANI_CITIES.map(city => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="03XXXXXXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="ahmad@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-pakistan-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors"
                  >
                    Continue to CNIC Upload
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: CNIC Upload */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Upload CNIC Image
                </h2>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCnicImageUpload}
                      className="hidden"
                      id="cnic-upload"
                    />
                    <label
                      htmlFor="cnic-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload size={48} className="text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700">
                        Upload CNIC Front Side
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG or GIF (max 5MB)
                      </p>
                    </label>
                  </div>
                  
                  {cnicImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Uploaded Image:</p>
                      <Image
                        src={URL.createObjectURL(cnicImage)}
                        alt="CNIC"
                        width={500}
                        height={500}
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  
                  {ocrProcessing && (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pakistan-green mx-auto mb-4"></div>
                      <p className="text-gray-600">Processing image...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Phone Verification */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Phone Verification
                </h2>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      We'll send an OTP to <strong>{formData.phone}</strong>
                    </p>
                    <button
                      onClick={sendOtp}
                      disabled={isLoading || generatedOtp}
                      className="bg-pakistan-green text-white py-2 px-6 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : generatedOtp ? 'OTP Sent' : 'Send OTP'}
                    </button>
                  </div>
                  
                  {generatedOtp && (
                    <div className="space-y-4">
                      {/* OTP Display */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-green-600 mb-2">📱 Your OTP Code (Development Mode)</p>
                        <div className="text-3xl font-mono font-bold text-green-800 tracking-widest">
                          {generatedOtp}
                        </div>
                        <p className="text-xs text-green-600 mt-2">Copy this code and enter it below</p>
                      </div>
                      
                      <form onSubmit={verifyOtp} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                          </label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green text-center text-lg tracking-widest"
                            placeholder="------"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-pakistan-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Registration Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Welcome to PakTaxChain! Your account has been created.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Your Taxpayer ID:</p>
                  <p className="text-2xl font-mono font-bold text-pakistan-green">
                    {taxpayerId}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-pakistan-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => window.location.href = '/pay-tax'}
                    className="bg-white text-pakistan-green border border-pakistan-green py-3 px-6 rounded-lg font-semibold hover:bg-pakistan-green hover:text-white transition-colors"
                  >
                    Pay Your First Tax
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
