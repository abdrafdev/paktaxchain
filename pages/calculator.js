import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  Calculator, 
  DollarSign, 
  Home, 
  Car, 
  Building2, 
  Receipt, 
  ArrowRight,
  Info,
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  calculateIncomeTax, 
  calculatePropertyTax, 
  calculateVehicleTax, 
  calculateBusinessTax,
  getTaxSummary,
  formatPKR, 
  TAX_RATES,
  PAKISTANI_CITIES,
  calculateSalesTax
} from '../lib/pakistaniTaxCalculator'

export default function TaxCalculatorPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('income')
  const [calculations, setCalculations] = useState({})
  const [totalTax, setTotalTax] = useState(0)
  
  // Form data for different tax types
  const [formData, setFormData] = useState({
    // Income Tax
    annualIncome: '',
    
    // Property Tax
    propertyValue: '',
    
    // Vehicle Tax
    vehicleType: 'CAR',
    vehicleCategory: 'under1000cc',
    vehicleValue: '',
    
    // Business Tax
    businessTurnover: '',
    businessType: 'retailer',
    
    // Personal Info (for final calculation)
    city: '',
    cnic: '',
    name: '',

    // GST
    gstAmount: '',
    gstCategory: 'standard',
  })

  // Tab configuration
  const tabs = [
    { 
      id: 'income', 
      label: 'Income Tax', 
      icon: DollarSign, 
      color: 'text-green-600',
      description: 'Calculate your annual income tax based on FBR slabs'
    },
    { 
      id: 'property', 
      label: 'Property Tax', 
      icon: Home, 
      color: 'text-blue-600',
      description: 'Calculate property tax based on current market value'
    },
    { 
      id: 'vehicle', 
      label: 'Vehicle Tax', 
      icon: Car, 
      color: 'text-purple-600',
      description: 'Calculate annual vehicle token tax'
    },
    { 
      id: 'business', 
      label: 'Business Tax', 
      icon: Building2, 
      color: 'text-orange-600',
      description: 'Calculate presumptive tax for small businesses'
    },
    {
      id: 'gst',
      label: 'GST (Sales Tax)',
      icon: Receipt,
      color: 'text-red-600',
      description: 'Calculate GST on goods/services'
    }
  ]

  // Vehicle categories
  const vehicleCategories = {
    MOTORCYCLE: [
      { value: 'under125cc', label: 'Under 125cc', tax: 1000 },
      { value: 'above125cc', label: 'Above 125cc', tax: 2000 }
    ],
    CAR: [
      { value: 'under1000cc', label: 'Under 1000cc', tax: 8000 },
      { value: '1000-1300cc', label: '1000-1300cc', tax: 12000 },
      { value: '1300-1600cc', label: '1300-1600cc', tax: 18000 },
      { value: '1600-1800cc', label: '1600-1800cc', tax: 25000 },
      { value: 'above1800cc', label: 'Above 1800cc', tax: 35000 }
    ],
    COMMERCIAL: [
      { value: 'rate', label: '2.5% of vehicle value', tax: 0 }
    ]
  }

  // Business types
  const businessTypes = [
    { value: 'retailer', label: 'Retailer', rate: 1.5 },
    { value: 'distributor', label: 'Distributor', rate: 0.5 },
    { value: 'manufacturer', label: 'Manufacturer', rate: 1.0 }
  ]

  // GST categories
  const gstCategories = [
    { value: 'standard', label: 'Standard (18%)' },
    { value: 'reduced', label: 'Reduced (5%)' },
    { value: 'zero', label: 'Zero (0%)' }
  ]

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Calculate taxes based on current inputs
  const calculateTaxes = () => {
    const newCalculations = {}
    let total = 0

    // Income Tax
    if (formData.annualIncome) {
      const incomeTaxResult = calculateIncomeTax(parseFloat(formData.annualIncome))
      newCalculations.income = incomeTaxResult
      total += incomeTaxResult.tax
    }

    // Property Tax
    if (formData.propertyValue) {
      const propertyTaxResult = calculatePropertyTax(parseFloat(formData.propertyValue))
      newCalculations.property = propertyTaxResult
      total += propertyTaxResult.tax
    }

    // Vehicle Tax
    if (formData.vehicleType && formData.vehicleCategory) {
      const vehicleTax = calculateVehicleTax(formData.vehicleType, formData.vehicleCategory)
      newCalculations.vehicle = { tax: vehicleTax }
      total += vehicleTax
    }

    // Business Tax
    if (formData.businessTurnover) {
      const businessTaxResult = calculateBusinessTax(
        parseFloat(formData.businessTurnover), 
        formData.businessType
      )
      newCalculations.business = businessTaxResult
      total += businessTaxResult.tax
    }

    // GST
    if (formData.gstAmount) {
      const gstResult = calculateSalesTax(parseFloat(formData.gstAmount), formData.gstCategory)
      newCalculations.gst = gstResult
      total += gstResult.tax
    }

    setCalculations(newCalculations)
    setTotalTax(total)
  }

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateTaxes()
  }, [formData]) // eslint-disable-line react-hooks/exhaustive-deps

  // Add validation for all fields
  const validateForm = () => {
    if (totalTax === 0) {
      toast.error('Please calculate your tax first')
      return false
    }
    if (!formData.city || !formData.cnic || !formData.name) {
      toast.error('Please fill in your personal information')
      return false
    }
    // CNIC validation (13 digits)
    if (!/^\d{13}$/.test(formData.cnic)) {
      toast.error('Invalid CNIC. Must be 13 digits.')
      return false
    }
    return true
  }

  // Proceed to payment with calculated tax
  const proceedToPayment = () => {
    if (!validateForm()) return

    // Navigate to payment page with pre-filled data
    const paymentData = {
      amount: totalTax,
      cnic: formData.cnic,
      fullName: formData.name,
      city: formData.city,
      taxType: 'CALCULATED_TAX',
      calculationBreakdown: calculations
    }

    localStorage.setItem('taxCalculationData', JSON.stringify(paymentData))
    router.push('/pay?from=calculator')
    toast.success('Redirecting to payment...')
  }

  // Reset all calculations
  const resetCalculations = () => {
    setFormData({
      annualIncome: '',
      propertyValue: '',
      vehicleType: 'CAR',
      vehicleCategory: 'under1000cc',
      vehicleValue: '',
      businessTurnover: '',
      businessType: 'retailer',
      city: '',
      cnic: '',
      name: '',
      gstAmount: '',
      gstCategory: 'standard',
    })
    setCalculations({})
    setTotalTax(0)
    toast.success('Calculator reset')
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
            <Calculator className="w-10 h-10 mr-3 text-pakistan-green" />
            Pakistani Tax Calculator 🇵🇰
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your exact tax liability based on official FBR rates. 
            Get instant calculations for Income Tax, Property Tax, Vehicle Tax, and Business Tax.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Tax Calculator */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 px-4 text-center transition-colors ${
                          activeTab === tab.id
                            ? 'border-b-2 border-pakistan-green bg-pakistan-green bg-opacity-5 text-pakistan-green'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <tab.icon className={`w-5 h-5 mx-auto mb-1 ${tab.color}`} />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {/* Income Tax Tab */}
                  {activeTab === 'income' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center mb-4">
                        <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                        <h3 className="text-xl font-semibold">Income Tax Calculator</h3>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Info className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800">FBR Tax Slabs 2024</span>
                        </div>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>• Up to PKR 6,00,000: 0% (Tax Free)</p>
                          <p>• PKR 6,00,001 - 12,00,000: 2.5%</p>
                          <p>• PKR 12,00,001 - 24,00,000: 12.5%</p>
                          <p>• PKR 24,00,001 - 30,00,000: 20%</p>
                          <p>• Above PKR 70,00,000: 35%</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Income (PKR) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">PKR</span>
                          <input
                            type="number"
                            value={formData.annualIncome}
                            onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                            placeholder="1500000"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                          />
                        </div>
                        {formData.annualIncome && calculations.income && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Annual Income Tax:</span>
                              <span className="text-xl font-bold text-green-600">
                                {formatPKR(calculations.income.tax)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Effective Rate: {calculations.income.effectiveRate}%</p>
                              <p>Net Income: {formatPKR(calculations.income.netIncome)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Property Tax Tab */}
                  {activeTab === 'property' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center mb-4">
                        <Home className="w-6 h-6 text-blue-600 mr-2" />
                        <h3 className="text-xl font-semibold">Property Tax Calculator</h3>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Info className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800">Property Tax Rate</span>
                        </div>
                        <div className="text-sm text-blue-700">
                          <p>• 0.8% annually on property value</p>
                          <p>• Properties below PKR 25,00,000 are exempt</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Market Value (PKR) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">PKR</span>
                          <input
                            type="number"
                            value={formData.propertyValue}
                            onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                            placeholder="5000000"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                          />
                        </div>
                        {formData.propertyValue && calculations.property && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            {calculations.property.isExempt ? (
                              <div className="text-center">
                                <p className="text-green-600 font-medium">Property Tax Exempt!</p>
                                <p className="text-sm text-gray-600">
                                  Properties below PKR 25,00,000 are exempt from tax
                                </p>
                              </div>
                            ) : (
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">Annual Property Tax:</span>
                                  <span className="text-xl font-bold text-blue-600">
                                    {formatPKR(calculations.property.tax)}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p>Rate: {calculations.property.rate}% annually</p>
                                  <p>Property Value: {formatPKR(calculations.property.propertyValue)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Vehicle Tax Tab */}
                  {activeTab === 'vehicle' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center mb-4">
                        <Car className="w-6 h-6 text-purple-600 mr-2" />
                        <h3 className="text-xl font-semibold">Vehicle Token Tax Calculator</h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Type *
                        </label>
                        <select
                          value={formData.vehicleType}
                          onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                        >
                          <option value="MOTORCYCLE">Motorcycle</option>
                          <option value="CAR">Car</option>
                          <option value="COMMERCIAL">Commercial Vehicle</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Category *
                        </label>
                        <div className="space-y-2">
                          {vehicleCategories[formData.vehicleType]?.map(category => (
                            <label key={category.value} className="flex items-center">
                              <input
                                type="radio"
                                name="vehicleCategory"
                                value={category.value}
                                checked={formData.vehicleCategory === category.value}
                                onChange={(e) => handleInputChange('vehicleCategory', e.target.value)}
                                className="mr-3"
                              />
                              <span className="flex-1">{category.label}</span>
                              <span className="font-medium text-purple-600">
                                {category.tax > 0 ? formatPKR(category.tax) : 'Variable'}
                              </span>
                            </label>
                          ))}
                        </div>
                        
                        {calculations.vehicle && (
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Annual Vehicle Tax:</span>
                              <span className="text-xl font-bold text-purple-600">
                                {formatPKR(calculations.vehicle.tax)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Business Tax Tab */}
                  {activeTab === 'business' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center mb-4">
                        <Building2 className="w-6 h-6 text-orange-600 mr-2" />
                        <h3 className="text-xl font-semibold">Business Tax Calculator</h3>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Info className="w-5 h-5 text-orange-600 mr-2" />
                          <span className="font-medium text-orange-800">Presumptive Tax Rates</span>
                        </div>
                        <div className="text-sm text-orange-700 space-y-1">
                          <p>• Retailer: 1.5% of annual turnover</p>
                          <p>• Distributor: 0.5% of annual turnover</p>
                          <p>• Manufacturer: 1.0% of annual turnover</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type *
                        </label>
                        <select
                          value={formData.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                        >
                          {businessTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label} ({type.rate}%)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Business Turnover (PKR) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">PKR</span>
                          <input
                            type="number"
                            value={formData.businessTurnover}
                            onChange={(e) => handleInputChange('businessTurnover', e.target.value)}
                            placeholder="2000000"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                          />
                        </div>
                        {formData.businessTurnover && calculations.business && (
                          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Annual Business Tax:</span>
                              <span className="text-xl font-bold text-orange-600">
                                {formatPKR(calculations.business.tax)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Rate: {calculations.business.rate}%</p>
                              <p>Turnover: {formatPKR(calculations.business.turnover)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* GST Tab */}
                  {activeTab === 'gst' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center mb-4">
                        <Receipt className="w-6 h-6 text-red-600 mr-2" />
                        <h3 className="text-xl font-semibold">GST (Sales Tax) Calculator</h3>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Info className="w-5 h-5 text-red-600 mr-2" />
                          <span className="font-medium text-red-800">GST Rates</span>
                        </div>
                        <div className="text-sm text-red-700 space-y-1">
                          <p>• Standard (18%): Applicable on most goods and services</p>
                          <p>• Reduced (5%): Applicable on certain goods and services</p>
                          <p>• Zero (0%): Applicable on exports and certain services</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Amount (PKR) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">PKR</span>
                          <input
                            type="number"
                            value={formData.gstAmount}
                            onChange={(e) => handleInputChange('gstAmount', e.target.value)}
                            placeholder="100000"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                          />
                        </div>
                        {formData.gstAmount && calculations.gst && (
                          <div className="mt-4 p-4 bg-red-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">GST Amount:</span>
                              <span className="text-xl font-bold text-red-600">
                                {formatPKR(calculations.gst.tax)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Rate: {calculations.gst.rate}%</p>
                              <p>Base Amount: {formatPKR(calculations.gst.baseAmount)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Payment */}
            <div className="space-y-6">
              
              {/* Tax Summary */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Tax Summary
                </h3>
                
                <div className="space-y-3">
                  {calculations.income && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Income Tax</span>
                      <span className="font-medium">{formatPKR(calculations.income.tax)}</span>
                    </div>
                  )}
                  
                  {calculations.property && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-medium">{formatPKR(calculations.property.tax)}</span>
                    </div>
                  )}
                  
                  {calculations.vehicle && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Vehicle Tax</span>
                      <span className="font-medium">{formatPKR(calculations.vehicle.tax)}</span>
                    </div>
                  )}
                  
                  {calculations.business && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Business Tax</span>
                      <span className="font-medium">{formatPKR(calculations.business.tax)}</span>
                    </div>
                  )}

                  {calculations.gst && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">GST (Sales Tax)</span>
                      <span className="font-medium">{formatPKR(calculations.gst.tax)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-3 bg-pakistan-green bg-opacity-10 px-4 rounded-lg">
                    <span className="font-semibold text-lg">Total Tax Due</span>
                    <span className="font-bold text-2xl text-pakistan-green">
                      {formatPKR(totalTax)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Muhammad Ahmad Khan"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNIC *
                    </label>
                    <input
                      type="text"
                      value={formData.cnic}
                      onChange={(e) => handleInputChange('cnic', e.target.value)}
                      placeholder="12345-1234567-1"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pakistan-green"
                    >
                      <option value="">Select City</option>
                      {PAKISTANI_CITIES.map(city => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={proceedToPayment}
                  disabled={totalTax === 0}
                  className="w-full bg-pakistan-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Pay {formatPKR(totalTax)} Now
                </button>
                
                <button
                  onClick={resetCalculations}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reset Calculator
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-pakistan-green to-pakistan-dark text-white rounded-lg p-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Quick Facts
                </h4>
                <div className="space-y-2 text-sm">
                  <p>• Average Pakistani pays 8-12% in taxes</p>
                  <p>• Property tax varies by province</p>
                  <p>• Vehicle tax is annual</p>
                  <p>• Business tax is on turnover basis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
