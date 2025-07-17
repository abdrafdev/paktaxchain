import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  Calculator, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  DollarSign,
  Building,
  Car,
  Home,
  TrendingUp,
  Smartphone,
  University,
  ArrowRight,
  Receipt
} from 'lucide-react'
import { calculateTax, TAX_TYPES } from '../lib/pakistaniTaxCalculator'
import { ethers } from 'ethers'

const PAK_TAX_CHAIN_ABI = [
  "function payTax(string hashedCNIC, string taxType, uint256 amount, string city) external payable",
  "function getTaxPayment(bytes32 paymentId) external view returns (uint256, string, string, uint256, address)"
]
const PAK_TAX_CHAIN_ADDRESS = process.env.NEXT_PUBLIC_PAK_TAX_CHAIN_ADDRESS || "0xYourContractAddressHere"

export default function TaxPaymentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTaxType, setSelectedTaxType] = useState('')
  const [taxData, setTaxData] = useState({
    income: '',
    propertyValue: '',
    businessSize: '',
    vehicleType: '',
    vehicleEngine: '',
    amount: 0
  })
  const [calculatedTax, setCalculatedTax] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [blockchainTx, setBlockchainTx] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userCity, setUserCity] = useState('Karachi') // This should come from user session

  const steps = [
    { id: 1, title: 'Tax Type', icon: FileText },
    { id: 2, title: 'Calculate', icon: Calculator },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Receipt', icon: Receipt }
  ]

  const taxTypes = [
    {
      id: 'income',
      name: 'Income Tax',
      icon: DollarSign,
      description: 'Tax on your annual income',
      color: 'bg-blue-500'
    },
    {
      id: 'property',
      name: 'Property Tax',
      icon: Home,
      description: 'Tax on property ownership',
      color: 'bg-green-500'
    },
    {
      id: 'business',
      name: 'Business Tax',
      icon: Building,
      description: 'Tax on business operations',
      color: 'bg-purple-500'
    },
    {
      id: 'vehicle',
      name: 'Vehicle Tax',
      icon: Car,
      description: 'Tax on vehicle registration',
      color: 'bg-orange-500'
    },
    {
      id: 'gst',
      name: 'GST',
      icon: TrendingUp,
      description: 'General Sales Tax for merchants',
      color: 'bg-red-500'
    }
  ]

  const paymentMethods = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: Smartphone,
      description: 'Pay via JazzCash mobile wallet'
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: Smartphone,
      description: 'Pay via EasyPaisa mobile wallet'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: University,
      description: 'Direct bank transfer'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: DollarSign,
      description: 'Pay with ETH/MATIC'
    }
  ]

  // Step 1: Tax Type Selection
  const handleTaxTypeSelect = (taxType) => {
    setSelectedTaxType(taxType)
    setCurrentStep(2)
  }

  // Step 2: Tax Calculator
  const handleCalculateTax = () => {
    try {
      let calculatedAmount = 0
      
      switch (selectedTaxType) {
        case 'income':
          if (!taxData.income || taxData.income <= 0) {
            toast.error('Please enter a valid annual income')
            return
          }
          calculatedAmount = calculateTax.income(parseFloat(taxData.income))
          break
          
        case 'property':
          if (!taxData.propertyValue || taxData.propertyValue <= 0) {
            toast.error('Please enter a valid property value')
            return
          }
          calculatedAmount = calculateTax.property(parseFloat(taxData.propertyValue))
          break
          
        case 'business':
          if (!taxData.businessSize) {
            toast.error('Please select business size')
            return
          }
          calculatedAmount = calculateTax.business(taxData.businessSize)
          break
          
        case 'vehicle':
          if (!taxData.vehicleType || !taxData.vehicleEngine) {
            toast.error('Please select vehicle type and engine size')
            return
          }
          calculatedAmount = calculateTax.vehicle(taxData.vehicleType, parseFloat(taxData.vehicleEngine))
          break
          
        case 'gst':
          if (!taxData.amount || taxData.amount <= 0) {
            toast.error('Please enter transaction amount')
            return
          }
          calculatedAmount = calculateTax.gst(parseFloat(taxData.amount))
          break
          
        default:
          toast.error('Please select a tax type')
          return
      }
      
      setCalculatedTax(calculatedAmount)
      setCurrentStep(3)
      toast.success(`Tax calculated: PKR ${calculatedAmount.toLocaleString()}`)
    } catch (error) {
      toast.error('Error calculating tax')
      console.error(error)
    }
  }

  // Step 3: Payment Processing
  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Generate transaction ID
      const txId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      setTransactionId(txId)

      // Simulate payment processing
      if (paymentMethod === 'crypto') {
        // Handle cryptocurrency payment
        await handleCryptoPayment(txId)
      } else {
        // Handle traditional payment methods
        await handleTraditionalPayment(txId)
      }

      // Log payment on blockchain
      const blockchainReceipt = await logPaymentOnBlockchain(calculatedTax, txId, userCity)
      setBlockchainTx(blockchainReceipt.transactionHash)
      console.log('Blockchain Receipt:', blockchainReceipt)

      setCurrentStep(4)
      toast.success('Payment successful!')
      
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCryptoPayment = async (txId) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(PAK_TAX_CHAIN_ADDRESS, PAK_TAX_CHAIN_ABI, signer)

    // Convert PKR to ETH (simplified conversion)
    const ethAmount = ethers.parseEther((calculatedTax / 5000000).toFixed(6)) // Needs accurate conversion

    const userAddress = await signer.getAddress()
    const hashedCNIC = ethers.keccak256(ethers.toUtf8Bytes("real-cnic")) // Use actual CNIC during interaction

    const tx = await contract.payTax(
      hashedCNIC,
      selectedTaxType,
      ethAmount,
      userCity,
      { value: ethAmount }
    )

    const receipt = await tx.wait()
    setBlockchainTx(receipt.hash)
  }

  const logPaymentOnBlockchain = async (amount, txId, city) => {
    // Simulate blockchain logging
    console.log('Logging payment of PKR', amount, 'with TX ID:', txId)
    return { transactionHash: '0xBlock123...', amount, city, txId }
  }

  const handleTraditionalPayment = async (txId) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real application, you would integrate with actual payment gateways
    // For now, we'll simulate success
    console.log(`Processing ${paymentMethod} payment for ${calculatedTax} PKR`)
  }

  const handleInputChange = (field, value) => {
    setTaxData(prev => ({ ...prev, [field]: value }))
  }

  const renderTaxCalculator = () => {
    switch (selectedTaxType) {
      case 'income':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income (PKR)
              </label>
              <input
                type="number"
                value={taxData.income}
                onChange={(e) => handleInputChange('income', e.target.value)}
                placeholder="1,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
              />
            </div>
          </div>
        )
        
      case 'property':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Value (PKR)
              </label>
              <input
                type="number"
                value={taxData.propertyValue}
                onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                placeholder="5,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
              />
            </div>
          </div>
        )
        
      case 'business':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Size
              </label>
              <select
                value={taxData.businessSize}
                onChange={(e) => handleInputChange('businessSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
              >
                <option value="">Select Size</option>
                <option value="small">Small (Revenue < 10M)</option>
                <option value="medium">Medium (Revenue 10M-50M)</option>
                <option value="large">Large (Revenue > 50M)</option>
              </select>
            </div>
          </div>
        )
        
      case 'vehicle':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={taxData.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
              >
                <option value="">Select Type</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engine Size (CC)
              </label>
              <input
                type="number"
                value={taxData.vehicleEngine}
                onChange={(e) => handleInputChange('vehicleEngine', e.target.value)}
                placeholder="1600"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
              />
            </div>
          </div>
        )
        
      case 'gst':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Amount (PKR)
              </label>
              <input
                type="number"
                value={taxData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="100,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
              />
            </div>
          </div>
        )
        
      default:
        return null
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
              Pay Your Tax
            </h1>
            <p className="text-xl text-pakistan-light">
              Quick, transparent, and secure tax payment
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
            {/* Step 1: Tax Type Selection */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Select Tax Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {taxTypes.map((taxType) => (
                    <motion.div
                      key={taxType.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTaxTypeSelect(taxType.id)}
                      className="cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-pakistan-green transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className={`w-12 h-12 ${taxType.color} rounded-lg flex items-center justify-center mb-4`}>
                        <taxType.icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {taxType.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {taxType.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Tax Calculator */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Calculate {taxTypes.find(t => t.id === selectedTaxType)?.name}
                </h2>
                <div className="space-y-6">
                  {renderTaxCalculator()}
                  
                  <div className="flex justify-between items-center pt-6 border-t">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                      ← Back to Tax Types
                    </button>
                    <button
                      onClick={handleCalculateTax}
                      className="bg-pakistan-green text-white py-3 px-8 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors flex items-center gap-2"
                    >
                      Calculate Tax <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Payment Details
                </h2>
                
                {/* Tax Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Tax Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tax Type</p>
                      <p className="font-medium">{taxTypes.find(t => t.id === selectedTaxType)?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium text-2xl text-pakistan-green">
                        PKR {calculatedTax.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="font-medium">{userCity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Period</p>
                      <p className="font-medium">FY 2024-25</p>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 ${
                        paymentMethod === method.id
                          ? 'border-pakistan-green bg-pakistan-green/5'
                          : 'border-gray-200 hover:border-pakistan-green/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <method.icon size={24} className="text-pakistan-green" />
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    ← Back to Calculator
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="bg-pakistan-green text-white py-3 px-8 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Receipt */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your tax payment has been processed and logged on the blockchain.
                </p>
                
                {/* Receipt Details */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                  <h3 className="text-lg font-semibold mb-4">Payment Receipt</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono font-medium">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">PKR {calculatedTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Type:</span>
                      <span className="font-medium">{taxTypes.find(t => t.id === selectedTaxType)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    {blockchainTx && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blockchain TX:</span>
                        <a
                          href={`https://polygonscan.com/tx/${blockchainTx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-pakistan-green hover:underline"
                        >
                          {blockchainTx.substring(0, 20)}...
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-pakistan-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-white text-pakistan-green border border-pakistan-green py-3 px-6 rounded-lg font-semibold hover:bg-pakistan-green hover:text-white transition-colors"
                  >
                    Print Receipt
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
