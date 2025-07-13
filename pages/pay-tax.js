import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Calculator,
  Receipt,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { validateCNIC, formatPKR, PAKISTANI_CITIES } from '../lib/pakistaniTaxCalculator'
import { dbHelpers } from '../lib/supabaseClient'
import { ethers } from 'ethers'
import { hashCNIC as hashCNICUtil } from '../lib/contracts'

// Smart contract ABI and address (update as needed)
const PAK_TAX_LOG_ABI = [
  // Only the logTaxPayment function
  "function logTaxPayment(string hashedCNIC, uint256 amountPKR, uint8 taxType, uint8 paymentMethod, string paymentReference) external"
]
const PAK_TAX_LOG_ADDRESS = process.env.NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS || "0xYourContractAddressHere"

// Fallback mock DB
const mockDB = []

// Tax type and payment method enums (must match contract)
const TAX_TYPE_ENUM = {
  INCOME_TAX: 0,
  PROPERTY_TAX: 1,
  BUSINESS_TAX: 2,
  VEHICLE_TAX: 3,
  SALES_TAX_GST: 4,
  WITHHOLDING_TAX: 5,
  CALCULATED_TAX: 6
}
const PAYMENT_METHOD_ENUM = {
  JAZZCASH: 0,
  EASYPAISA: 1,
  BANK_TRANSFER: 2,
  ONE_LINK: 3
}

export default function PayTaxPage() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [calculationBreakdown, setCalculationBreakdown] = useState(null)
  const [receipt, setReceipt] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    cnic: '',
    fullName: '',
    city: '',
    email: '',
    phone: '',
    taxType: 'INCOME_TAX',
    amount: '',
    paymentMethod: 'JAZZCASH'
  })

  // Validation state
  const [errors, setErrors] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)

  // Tax types available in Pakistan
  const taxTypes = [
    { value: 'INCOME_TAX', label: 'Income Tax', icon: '💰' },
    { value: 'PROPERTY_TAX', label: 'Property Tax', icon: '🏠' },
    { value: 'BUSINESS_TAX', label: 'Business Tax', icon: '🏪' },
    { value: 'VEHICLE_TAX', label: 'Vehicle Token Tax', icon: '🚗' },
    { value: 'SALES_TAX_GST', label: 'Sales Tax (GST)', icon: '🧾' },
    { value: 'WITHHOLDING_TAX', label: 'Withholding Tax', icon: '📊' },
    { value: 'CALCULATED_TAX', label: 'Calculated Tax (Multiple)', icon: '🧮' }
  ]

  // Pakistani payment methods
  const paymentMethods = [
    { value: 'JAZZCASH', label: 'JazzCash', icon: '📱', color: 'bg-red-500' },
    { value: 'EASYPAISA', label: 'EasyPaisa', icon: '💳', color: 'bg-green-500' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦', color: 'bg-blue-500' },
    { value: 'ONE_LINK', label: '1Link', icon: '🔗', color: 'bg-purple-500' }
  ]

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData.cnic) {
      newErrors.cnic = 'CNIC is required'
    } else if (!validateCNIC(formData.cnic)) {
      newErrors.cnic = 'Invalid CNIC format (12345-1234567-1)'
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters'
    }
    if (!formData.city) {
      newErrors.city = 'Please select a city'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^(\+92|92|0)?[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Invalid Pakistani phone number'
    }
    if (!formData.amount) {
      newErrors.amount = 'Tax amount is required'
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    } else if (parseFloat(formData.amount) < 100) {
      newErrors.amount = 'Minimum tax amount is PKR 100'
    }
    setErrors(newErrors)
    setIsFormValid(Object.keys(newErrors).length === 0)
    return Object.keys(newErrors).length === 0
  }

  // Simulate PKR payment
  const simulatePayment = async () => {
    setIsLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 90% chance of success
        if (Math.random() < 0.9) {
          resolve({
            paymentReference: 'TX-' + Math.random().toString(36).substr(2, 10).toUpperCase(),
            status: 'success'
          })
        } else {
          reject(new Error('Simulated payment failed'))
        }
      }, 2000)
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }
    setIsLoading(true)
    setPaymentSuccess(false)
    setReceipt(null)
    try {
      // 1. Simulate PKR payment
      const paymentResult = await simulatePayment()
      toast.success('Payment successful! Logging on blockchain...')
      // 2. Log payment on blockchain
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(PAK_TAX_LOG_ADDRESS, PAK_TAX_LOG_ABI, signer)
        // Hash CNIC for privacy
        const hashedCNIC = hashCNICUtil(formData.cnic)
        // Use correct enums for tax type and payment method
        const taxTypeEnum = TAX_TYPE_ENUM[formData.taxType] || 0
        const paymentMethodEnum = PAYMENT_METHOD_ENUM[formData.paymentMethod] || 0
        // Call contract
        const tx = await contract.logTaxPayment(
          hashedCNIC,
          parseInt(formData.amount),
          taxTypeEnum,
          paymentMethodEnum,
          paymentResult.paymentReference
        )
        await tx.wait()
        setTransactionId(tx.hash)
      }
      // 3. Store payment reference in Supabase (if available)
      let supabaseSuccess = false
      if (dbHelpers && dbHelpers.createPayment) {
        try {
          await dbHelpers.createPayment({
            cnic: formData.cnic,
            fullName: formData.fullName,
            city: formData.city,
            email: formData.email,
            phone: formData.phone,
            taxType: formData.taxType,
            amount: parseInt(formData.amount),
            paymentMethod: formData.paymentMethod,
            paymentReference: paymentResult.paymentReference,
            txHash: transactionId,
            paidAt: new Date().toISOString()
          })
          supabaseSuccess = true
        } catch (err) {
          supabaseSuccess = false
        }
      }
      if (!supabaseSuccess) {
        mockDB.push({
          ...formData,
          paymentReference: paymentResult.paymentReference,
          txHash: transactionId,
          paidAt: new Date().toISOString()
        })
      }
      // 4. Show receipt
      setReceipt({
        ...formData,
        paymentReference: paymentResult.paymentReference,
        txHash: transactionId
      })
      setPaymentSuccess(true)
      toast.success('Tax payment recorded and receipt generated!')
      // Reset form
      setFormData({
        cnic: '',
        fullName: '',
        city: '',
        email: '',
        phone: '',
        taxType: 'INCOME_TAX',
        amount: '',
        paymentMethod: 'JAZZCASH'
      })
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load data from calculator if available
  useEffect(() => {
    if (router.query.from === 'calculator') {
      const calculationData = localStorage.getItem('taxCalculationData')
      if (calculationData) {
        try {
          const data = JSON.parse(calculationData)
          setFormData(prev => ({
            ...prev,
            amount: data.amount.toString(),
            cnic: data.cnic || '',
            fullName: data.fullName || '',
            city: data.city || '',
            taxType: 'CALCULATED_TAX'
          }))
          setCalculationBreakdown(data.calculationBreakdown)
          localStorage.removeItem('taxCalculationData')
        } catch {}
      }
    }
  }, [router.query.from])

  // Auto-validate form on changes
  useEffect(() => {
    if (Object.values(formData).some(value => value !== '')) {
      validateForm()
    }
  }, [formData]) // eslint-disable-line react-hooks/exhaustive-deps

  // Generate receipt component
  const ReceiptComponent = ({ receipt, txHash }) => {
    const getPolygonscanUrl = (hash) => {
      return `https://mumbai.polygonscan.com/tx/${hash}`
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto"
      >
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
          <p className="text-gray-600">Your tax payment has been recorded on the blockchain</p>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-pakistan-green">Tax Receipt</h3>
            <p className="text-sm text-gray-500">PakTaxChain - Pakistan's Transparent Tax System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Taxpayer Information */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Taxpayer Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{receipt.fullName}</span>
                </div>
                <div>
                  <span className="font-medium">CNIC:</span>
                  <span className="ml-2 font-mono">{receipt.cnic}</span>
                </div>
                <div>
                  <span className="font-medium">City:</span>
                  <span className="ml-2">{receipt.city}</span>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{receipt.email}</span>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{receipt.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Amount:</span>
                  <span className="ml-2 font-bold text-lg text-pakistan-green">
                    {formatPKR(parseInt(receipt.amount))}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Tax Type:</span>
                  <span className="ml-2">{taxTypes.find(t => t.value === receipt.taxType)?.label}</span>
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <span className="ml-2">{paymentMethods.find(p => p.value === receipt.paymentMethod)?.label}</span>
                </div>
                <div>
                  <span className="font-medium">Payment Reference:</span>
                  <span className="ml-2 font-mono text-xs">{receipt.paymentReference}</span>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{new Date().toLocaleString('en-PK')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Receipt className="w-4 h-4 mr-2" />
              Blockchain Record
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Transaction Hash:</span>
                <div className="mt-1">
                  <a
                    href={getPolygonscanUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all"
                  >
                    {txHash}
                  </a>
                </div>
              </div>
              <div>
                <span className="font-medium">Network:</span>
                <span className="ml-2">Polygon Mumbai Testnet</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-pakistan-green text-white py-2 px-4 rounded-lg font-medium hover:bg-pakistan-dark transition-colors"
            >
              Print Receipt
            </button>
            <button
              onClick={() => {
                const receiptText = `
PakTaxChain Tax Receipt
=======================
Date: ${new Date().toLocaleString('en-PK')}
Payment Reference: ${receipt.paymentReference}
Transaction Hash: ${txHash}

Taxpayer Information:
- Name: ${receipt.fullName}
- CNIC: ${receipt.cnic}
- City: ${receipt.city}
- Email: ${receipt.email}
- Phone: ${receipt.phone}

Payment Information:
- Amount: ${formatPKR(parseInt(receipt.amount))}
- Tax Type: ${taxTypes.find(t => t.value === receipt.taxType)?.label}
- Payment Method: ${paymentMethods.find(p => p.value === receipt.paymentMethod)?.label}

Blockchain Record:
- Network: Polygon Mumbai Testnet
- Transaction: ${getPolygonscanUrl(txHash)}
                `
                navigator.clipboard.writeText(receiptText)
                toast.success('Receipt copied to clipboard!')
              }}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Copy Receipt
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Payment success modal
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your tax payment has been processed successfully.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-mono text-sm font-medium">{transactionId}</p>
          </div>

          {receipt && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Receipt Reference</p>
              <p className="font-mono text-sm font-medium">{receipt.paymentReference}</p>
            </div>
          )}

          <div className="space-y-2 mb-6">
            <button className="w-full bg-pakistan-green text-white py-2 px-4 rounded-lg hover:bg-pakistan-dark transition-colors">
              Download Receipt
            </button>
            <button 
              onClick={() => setPaymentSuccess(false)}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Make Another Payment
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <CreditCard className="w-10 h-10 mr-3 text-pakistan-green" />
            Pay Your Taxes 🇵🇰
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make your tax payment using any Pakistani payment method. 
            All transactions are recorded on blockchain for transparency.
          </p>
        </motion.div>

        {/* Success State - Show Receipt */}
        {paymentSuccess && receipt && (
          <ReceiptComponent receipt={receipt} txHash={transactionId} />
        )}

        {/* Payment Form */}
        {!paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-pakistan-flag text-white p-6">
                <h2 className="text-2xl font-semibold flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Tax Payment Form
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </h3>

                    {/* CNIC */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNIC Number *
                      </label>
                      <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleInputChange}
                        placeholder="12345-1234567-1"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green ${
                          errors.cnic ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Muhammad Ahmad Khan"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select your city</option>
                        {PAKISTANI_CITIES.map(city => (
                          <option key={city.name} value={city.name}>
                            {city.name} ({city.province})
                          </option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ahmad@gmail.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+92 300 1234567"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Tax & Payment Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                      <Calculator className="w-5 h-5 mr-2" />
                      Tax & Payment Details
                    </h3>

                    {/* Tax Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Type *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {taxTypes.map(type => (
                          <label key={type.value} className="relative">
                            <input
                              type="radio"
                              name="taxType"
                              value={type.value}
                              checked={formData.taxType === type.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                              formData.taxType === type.value 
                                ? 'border-pakistan-green bg-pakistan-green bg-opacity-10' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{type.icon}</span>
                                <span className="text-sm font-medium">{type.label}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Amount (PKR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">PKR</span>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          placeholder="5000"
                          min="100"
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green ${
                            errors.amount ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                      {formData.amount && !errors.amount && (
                        <p className="text-green-600 text-sm mt-1">
                          Amount: {formatPKR(parseFloat(formData.amount))}
                        </p>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <div className="space-y-3">
                        {paymentMethods.map(method => (
                          <label key={method.value} className="relative">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={formData.paymentMethod === method.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              formData.paymentMethod === method.value 
                                ? 'border-pakistan-green bg-pakistan-green bg-opacity-10' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 ${method.color} rounded-full flex items-center justify-center text-white text-sm`}>
                                  {method.icon}
                                </div>
                                <span className="font-medium">{method.label}</span>
                                {formData.paymentMethod === method.value && (
                                  <CheckCircle className="w-5 h-5 text-pakistan-green ml-auto" />
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className="w-full bg-pakistan-green text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pakistan-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Receipt className="w-5 h-5 mr-2" />
                        Pay {formData.amount ? formatPKR(parseFloat(formData.amount)) : 'Tax'} Now
                      </>
                    )}
                  </button>
                  
                  {!isConnected && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Wallet connection is optional for PKR payments
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
