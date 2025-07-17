import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Clock, CheckCircle, AlertCircle, Wallet, DollarSign, FileText, Receipt } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';

const PayTax = () => {
  const { isConnected, address } = useAccount();
  const [selectedTaxType, setSelectedTaxType] = useState('income');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('blockchain');
  const [taxpayerInfo, setTaxpayerInfo] = useState({
    cnic: '',
    name: '',
    phone: '',
    city: 'karachi'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');

  const taxTypes = [
    { value: 'income', label: 'Income Tax', description: 'Annual income tax payment', icon: DollarSign },
    { value: 'property', label: 'Property Tax', description: 'Property ownership tax', icon: FileText },
    { value: 'vehicle', label: 'Vehicle Tax', description: 'Vehicle registration tax', icon: Receipt },
    { value: 'business', label: 'Business Tax', description: 'Business operations tax', icon: CreditCard }
  ];

  const pakistaniCities = [
    { value: 'karachi', label: 'Karachi' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'islamabad', label: 'Islamabad' },
    { value: 'rawalpindi', label: 'Rawalpindi' },
    { value: 'faisalabad', label: 'Faisalabad' },
    { value: 'multan', label: 'Multan' },
    { value: 'peshawar', label: 'Peshawar' },
    { value: 'quetta', label: 'Quetta' }
  ];

  const handleInputChange = (field, value) => {
    setTaxpayerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!taxpayerInfo.cnic || taxpayerInfo.cnic.length !== 13) {
      toast.error('Please enter a valid 13-digit CNIC number');
      return false;
    }
    if (!taxpayerInfo.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!taxpayerInfo.phone || taxpayerInfo.phone.length < 11) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return false;
    }
    if (paymentMethod === 'blockchain' && !isConnected) {
      toast.error('Please connect your wallet for blockchain payment');
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 40);
      setTransactionHash(mockTxHash);
      
      setPaymentStatus('success');
      toast.success('Payment processed successfully!');
      
      // In real implementation, this would:
      // 1. Process blockchain transaction
      // 2. Update database
      // 3. Generate receipt
      
    } catch (error) {
      setPaymentStatus('error');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setTaxpayerInfo({ cnic: '', name: '', phone: '', city: 'karachi' });
    setPaymentAmount('');
    setPaymentStatus(null);
    setTransactionHash('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pakistan-green via-emerald-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <CreditCard className="w-12 h-12 text-pakistan-green mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pakistan-green to-emerald-600 bg-clip-text text-transparent">
              Pay Your Tax
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, transparent, and blockchain-verified tax payments for Pakistani citizens
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {paymentStatus === 'success' ? (
            /* Payment Success */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your {taxTypes.find(t => t.value === selectedTaxType)?.label} payment has been processed successfully.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">PKR {parseFloat(paymentAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Type:</span>
                    <span className="font-medium">{taxTypes.find(t => t.value === selectedTaxType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CNIC:</span>
                    <span className="font-medium">{taxpayerInfo.cnic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction:</span>
                    <span className="font-mono text-xs">{transactionHash}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => window.print()}
                  className="bg-pakistan-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-pakistan-dark transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={resetForm}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Pay Another Tax
                </button>
              </div>
            </motion.div>
          ) : (
            /* Payment Form */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tax Type Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Select Tax Type</h2>
                  <div className="space-y-3">
                    {taxTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setSelectedTaxType(type.value)}
                          className={`w-full p-4 rounded-lg border-2 transition-all ${
                            selectedTaxType === type.value
                              ? 'border-pakistan-green bg-pakistan-green/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-5 h-5 ${
                              selectedTaxType === type.value ? 'text-pakistan-green' : 'text-gray-400'
                            }`} />
                            <div className="text-left">
                              <p className="font-medium text-gray-800">{type.label}</p>
                              <p className="text-sm text-gray-500">{type.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Payment Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
                  
                  <div className="space-y-6">
                    {/* Taxpayer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CNIC Number
                        </label>
                        <input
                          type="text"
                          value={taxpayerInfo.cnic}
                          onChange={(e) => handleInputChange('cnic', e.target.value)}
                          placeholder="12345-1234567-1"
                          maxLength="13"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={taxpayerInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={taxpayerInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="03XX-XXXXXXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <select
                          value={taxpayerInfo.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                        >
                          {pakistaniCities.map((city) => (
                            <option key={city.value} value={city.value}>
                              {city.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Payment Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Amount (PKR)
                      </label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount in PKR"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => setPaymentMethod('blockchain')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            paymentMethod === 'blockchain'
                              ? 'border-pakistan-green bg-pakistan-green/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Wallet className={`w-5 h-5 ${
                              paymentMethod === 'blockchain' ? 'text-pakistan-green' : 'text-gray-400'
                            }`} />
                            <div className="text-left">
                              <p className="font-medium text-gray-800">Blockchain Payment</p>
                              <p className="text-sm text-gray-500">Secure, transparent</p>
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('bank')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            paymentMethod === 'bank'
                              ? 'border-pakistan-green bg-pakistan-green/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className={`w-5 h-5 ${
                              paymentMethod === 'bank' ? 'text-pakistan-green' : 'text-gray-400'
                            }`} />
                            <div className="text-left">
                              <p className="font-medium text-gray-800">Bank Transfer</p>
                              <p className="text-sm text-gray-500">Traditional method</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Wallet Connection Status */}
                    {paymentMethod === 'blockchain' && (
                      <div className={`p-4 rounded-lg border ${
                        isConnected ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {isConnected ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            isConnected ? 'text-green-800' : 'text-yellow-800'
                          }`}>
                            {isConnected ? `Wallet Connected: ${address?.substring(0, 6)}...${address?.substring(38)}` : 'Please connect your wallet'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Payment Button */}
                    <button
                      onClick={processPayment}
                      disabled={isProcessing || (paymentMethod === 'blockchain' && !isConnected)}
                      className="w-full bg-gradient-to-r from-pakistan-green to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          <span>Pay PKR {paymentAmount ? parseFloat(paymentAmount).toLocaleString() : '0'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose PakTaxChain?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-pakistan-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-pakistan-green" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Secure & Transparent</h3>
                <p className="text-sm text-gray-600">All payments are recorded on blockchain for complete transparency and security.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pakistan-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-pakistan-green" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Fast Processing</h3>
                <p className="text-sm text-gray-600">Instant payment processing with immediate confirmation and receipt generation.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pakistan-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-pakistan-green" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Government Approved</h3>
                <p className="text-sm text-gray-600">Officially recognized by FBR and integrated with government systems.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayTax;
