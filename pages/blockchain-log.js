import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Hash,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function BlockchainLog() {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterAmount, setFilterAmount] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const transactionsPerPage = 20

  // Sample blockchain transactions (anonymized)
  const sampleTransactions = [
    {
      id: 1,
      txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef',
      amount: 25000,
      city: 'Karachi',
      taxType: 'Income Tax',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      blockNumber: 12345678,
      confirmations: 127,
      status: 'confirmed'
    },
    {
      id: 2,
      txHash: '0xf6e5d4c3b2a19087654321098765432109876543210',
      amount: 15000,
      city: 'Lahore',
      taxType: 'Property Tax',
      timestamp: new Date('2024-01-15T09:45:00Z'),
      blockNumber: 12345677,
      confirmations: 128,
      status: 'confirmed'
    },
    {
      id: 3,
      txHash: '0x123456789abcdef0123456789abcdef0123456789ab',
      amount: 45000,
      city: 'Islamabad',
      taxType: 'Business Tax',
      timestamp: new Date('2024-01-15T08:20:00Z'),
      blockNumber: 12345676,
      confirmations: 129,
      status: 'confirmed'
    },
    {
      id: 4,
      txHash: '0x987654321fedcba0987654321fedcba0987654321fe',
      amount: 8000,
      city: 'Faisalabad',
      taxType: 'Income Tax',
      timestamp: new Date('2024-01-15T07:15:00Z'),
      blockNumber: 12345675,
      confirmations: 130,
      status: 'confirmed'
    },
    {
      id: 5,
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234',
      amount: 32000,
      city: 'Rawalpindi',
      taxType: 'Property Tax',
      timestamp: new Date('2024-01-15T06:30:00Z'),
      blockNumber: 12345674,
      confirmations: 131,
      status: 'confirmed'
    }
  ]

  useEffect(() => {
    // Simulate loading blockchain data
    setTimeout(() => {
      setTransactions(sampleTransactions)
      setFilteredTransactions(sampleTransactions)
      setIsLoading(false)
    }, 1500)
  }, [])

  useEffect(() => {
    let filtered = transactions.filter(tx => {
      const matchesSearch = tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.taxType.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCity = filterCity === '' || tx.city === filterCity
      const matchesAmount = filterAmount === '' || 
                           (filterAmount === 'low' && tx.amount < 15000) ||
                           (filterAmount === 'medium' && tx.amount >= 15000 && tx.amount < 30000) ||
                           (filterAmount === 'high' && tx.amount >= 30000)
      
      return matchesSearch && matchesCity && matchesAmount
    })
    
    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [searchTerm, filterCity, filterAmount, transactions])

  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction)
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)

  const cities = [...new Set(transactions.map(tx => tx.city))]
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const totalTransactions = transactions.length

  const handleExportData = () => {
    const csvData = filteredTransactions.map(tx => ({
      'Transaction Hash': tx.txHash,
      'Amount (PKR)': tx.amount,
      'City': tx.city,
      'Tax Type': tx.taxType,
      'Date': tx.timestamp.toISOString(),
      'Block Number': tx.blockNumber,
      'Confirmations': tx.confirmations,
      'Status': tx.status
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paktaxchain-transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatHash = (hash) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-pakistan-green via-pakistan-dark to-emerald-800 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pakistan-light opacity-10 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Blockchain{' '}
              <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                Transaction Log
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-light leading-relaxed">
              Complete transparency: Every tax payment recorded immutably on the blockchain
            </p>
            <div className="flex items-center justify-center gap-2 text-pakistan-light">
              <Shield className="w-5 h-5" />
              <span className="text-sm">All data is anonymized to protect citizen privacy</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-pakistan-green to-emerald-600 text-white p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">₨{totalAmount.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Tax Collected</div>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{totalTransactions}</div>
                  <div className="text-sm opacity-90">Total Transactions</div>
                </div>
                <Hash className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{cities.length}</div>
                  <div className="text-sm opacity-90">Active Cities</div>
                </div>
                <MapPin className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm opacity-90">Transparency Rate</div>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by transaction hash, city, or tax type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                
                <select
                  value={filterAmount}
                  onChange={(e) => setFilterAmount(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent"
                >
                  <option value="">All Amounts</option>
                  <option value="low">Under ₨15,000</option>
                  <option value="medium">₨15,000 - ₨30,000</option>
                  <option value="high">Above ₨30,000</option>
                </select>
                
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 bg-pakistan-green text-white px-6 py-3 rounded-lg hover:bg-pakistan-dark transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transactions Table */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Hash className="w-6 h-6" />
                Recent Transactions
              </h2>
              <p className="text-gray-600 mt-2">
                Showing {currentTransactions.length} of {filteredTransactions.length} transactions
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pakistan-green"></div>
                <span className="ml-4 text-gray-600">Loading blockchain data...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Hash className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="font-mono text-sm text-gray-800">
                              {formatHash(tx.txHash)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-pakistan-green">
                            ₨{tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-800">{tx.city}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-800">{tx.taxType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{tx.timestamp.toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button className="text-pakistan-green hover:text-pakistan-dark transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-pakistan-green hover:text-pakistan-dark transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-pakistan-green text-white rounded-lg">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
