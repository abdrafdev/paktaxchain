import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, FileText, TrendingUp, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [taxType, setTaxType] = useState('income');
  const [city, setCity] = useState('karachi');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const taxTypes = [
    { value: 'income', label: 'Income Tax', description: 'Tax on salary and business income' },
    { value: 'property', label: 'Property Tax', description: 'Tax on property ownership' },
    { value: 'vehicle', label: 'Vehicle Tax', description: 'Annual registration tax' },
    { value: 'business', label: 'Business Tax', description: 'Tax on business operations' }
  ];

  const calculateTax = () => {
    if (!income || isNaN(income) || parseFloat(income) <= 0) {
      toast.error('Please enter a valid income amount');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const incomeAmount = parseFloat(income);
      let taxAmount = 0;
      let taxRate = 0;

      // Pakistani tax calculation (simplified)
      switch (taxType) {
        case 'income':
          if (incomeAmount <= 600000) {
            taxAmount = 0;
            taxRate = 0;
          } else if (incomeAmount <= 1200000) {
            taxAmount = (incomeAmount - 600000) * 0.05;
            taxRate = 5;
          } else if (incomeAmount <= 2400000) {
            taxAmount = 30000 + (incomeAmount - 1200000) * 0.15;
            taxRate = 15;
          } else if (incomeAmount <= 3600000) {
            taxAmount = 210000 + (incomeAmount - 2400000) * 0.25;
            taxRate = 25;
          } else {
            taxAmount = 510000 + (incomeAmount - 3600000) * 0.35;
            taxRate = 35;
          }
          break;
        case 'property':
          taxAmount = incomeAmount * 0.005; // 0.5% property tax
          taxRate = 0.5;
          break;
        case 'vehicle':
          taxAmount = Math.max(incomeAmount * 0.02, 5000); // 2% with minimum
          taxRate = 2;
          break;
        case 'business':
          taxAmount = incomeAmount * 0.12; // 12% business tax
          taxRate = 12;
          break;
        default:
          taxAmount = 0;
      }

      const afterTax = incomeAmount - taxAmount;
      const cityMultiplier = city === 'karachi' ? 1.1 : city === 'lahore' ? 1.05 : 1.0;
      const finalTax = taxAmount * cityMultiplier;

      setResults({
        grossIncome: incomeAmount,
        taxAmount: finalTax,
        taxRate: taxRate,
        afterTax: incomeAmount - finalTax,
        cityMultiplier: cityMultiplier,
        cityName: pakistaniCities.find(c => c.value === city)?.label,
        taxTypeLabel: taxTypes.find(t => t.value === taxType)?.label
      });

      setLoading(false);
      toast.success('Tax calculation completed!');
    }, 1500);
  };

  const resetCalculator = () => {
    setIncome('');
    setTaxType('income');
    setCity('karachi');
    setResults(null);
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
            <Calculator className="w-12 h-12 text-pakistan-green mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pakistan-green to-emerald-600 bg-clip-text text-transparent">
              Pakistan Tax Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your tax liability accurately according to Pakistani tax laws
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-pakistan-green" />
              Tax Calculation Form
            </h2>

            <div className="space-y-6">
              {/* Tax Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Type
                </label>
                <select
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                >
                  {taxTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Income Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {taxType === 'income' ? 'Annual Income' : 
                   taxType === 'property' ? 'Property Value' : 
                   taxType === 'vehicle' ? 'Vehicle Value' : 'Business Revenue'} (PKR)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter amount in PKR"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                />
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                >
                  {pakistaniCities.map((cityOption) => (
                    <option key={cityOption.value} value={cityOption.value}>
                      {cityOption.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={calculateTax}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pakistan-green to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Calculator className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Calculating...' : 'Calculate Tax'}
                </button>
                <button
                  onClick={resetCalculator}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-pakistan-green" />
              Tax Calculation Results
            </h2>

            {results ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-pakistan-green to-emerald-600 text-white p-4 rounded-lg">
                    <p className="text-sm opacity-90">Tax Amount</p>
                    <p className="text-2xl font-bold">PKR {results.taxAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <p className="text-sm opacity-90">After Tax</p>
                    <p className="text-2xl font-bold">PKR {results.afterTax.toLocaleString()}</p>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Type:</span>
                      <span className="font-medium">{results.taxTypeLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium">{results.cityName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-medium">PKR {results.grossIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Rate:</span>
                      <span className="font-medium">{results.taxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City Multiplier:</span>
                      <span className="font-medium">{results.cityMultiplier}x</span>
                    </div>
                  </div>
                </div>

                {/* Tax Efficiency */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Tax Efficiency
                  </h4>
                  <p className="text-sm text-blue-700">
                    Your effective tax rate is {((results.taxAmount / results.grossIncome) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Enter your information to calculate tax</p>
                <p className="text-gray-400 text-sm mt-2">Results will appear here once you click calculate</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tax Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Info className="w-6 h-6 mr-2 text-pakistan-green" />
            Pakistani Tax Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {taxTypes.map((type) => (
              <div key={type.value} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{type.label}</h3>
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                <div className="text-xs text-gray-500">
                  {type.value === 'income' && 'Progressive rates: 0-35%'}
                  {type.value === 'property' && 'Rate: 0.5% of value'}
                  {type.value === 'vehicle' && 'Rate: 2% minimum PKR 5,000'}
                  {type.value === 'business' && 'Rate: 12% of revenue'}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This calculator provides estimates based on simplified tax rules. 
              For accurate tax calculations, please consult with a qualified tax professional or the Federal Board of Revenue (FBR).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaxCalculator;
