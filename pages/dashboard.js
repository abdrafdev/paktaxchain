import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Receipt, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Calendar,
  Eye,
  Download,
  ExternalLink,
  BarChart3,
  PieChart,
  Shield,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState({
    totalTaxPaid: 125000,
    paymentsCount: 8,
    taxpayerId: 'TXP-AK47B2X9',
    city: 'Karachi',
    registrationDate: '2024-01-15',
    currentYear: 2024
  })
  
  const [cityStats, setCityStats] = useState({
    totalCollected: 4500000,
    developmentFund: 2250000,
    fundAllocation: 50,
    cityRank: 2,
    totalCities: 15
  })

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 'TXN-2024-001',
      type: 'Income Tax',
      amount: 25000,
      date: '2024-01-20',
      status: 'completed',
      blockchainTx: '0x1234...5678'
    },
    {
      id: 'TXN-2024-002',
      type: 'Property Tax',
      amount: 15000,
      date: '2024-01-18',
      status: 'completed',
      blockchainTx: '0x2345...6789'
    },
    {
      id: 'TXN-2024-003',
      type: 'Vehicle Tax',
      amount: 8000,
      date: '2024-01-15',
      status: 'completed',
      blockchainTx: '0x3456...7890'
    }
  ])

  const [cityComparison, setCityComparison] = useState([
    { city: 'Lahore', collected: 5200000, rank: 1 },
    { city: 'Karachi', collected: 4500000, rank: 2 },
    { city: 'Islamabad', collected: 3800000, rank: 3 },
    { city: 'Rawalpindi', collected: 2900000, rank: 4 },
    { city: 'Faisalabad', collected: 2400000, rank: 5 }
  ])

  const [monthlyData, setMonthlyData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Tax Payments (PKR)',
      data: [25000, 15000, 0, 8000, 12000, 18000],
      borderColor: 'rgb(20, 83, 45)',
      backgroundColor: 'rgba(20, 83, 45, 0.1)',
      tension: 0.1
    }]
  })

  const [taxTypeData, setTaxTypeData] = useState({
    labels: ['Income Tax', 'Property Tax', 'Vehicle Tax', 'Business Tax'],
    datasets: [{
      data: [45000, 35000, 25000, 20000],
      backgroundColor: [
        'rgba(20, 83, 45, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ],
      borderColor: [
        'rgb(20, 83, 45)',
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(168, 85, 247)'
      ],
      borderWidth: 2
    }]
  })

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'PKR ' + value.toLocaleString()
          }
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': PKR ' + context.parsed.toLocaleString()
          }
        }
      }
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'payments', label: 'Tax Payments', icon: Receipt },
    { id: 'city', label: 'City Stats', icon: MapPin },
    { id: 'transparency', label: 'Transparency', icon: Shield }
  ]

  const handleDownloadReceipt = (transaction) => {
    // In a real application, this would generate and download a PDF receipt
    console.log('Downloading receipt for:', transaction.id)
  }

  const handleViewOnBlockchain = (txHash) => {
    window.open(`https://polygonscan.com/tx/${txHash}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Taxpayer!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Taxpayer ID</p>
              <p className="font-mono font-bold text-pakistan-green">{userStats.taxpayerId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tax Paid</p>
                <p className="text-2xl font-bold text-pakistan-green">
                  PKR {userStats.totalTaxPaid.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-pakistan-green" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Payments</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.paymentsCount}</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">City Rank</p>
                <p className="text-2xl font-bold text-orange-600">
                  #{cityStats.cityRank} of {cityStats.totalCities}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Date(userStats.registrationDate).toLocaleDateString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pakistan-green text-pakistan-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Tax Payments</h3>
                    <div className="h-64">
                      <Line data={monthlyData} options={chartOptions} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tax Types Distribution</h3>
                    <div className="h-64">
                      <Pie data={taxTypeData} options={pieOptions} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentTransactions.slice(0, 3).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-pakistan-green rounded-full flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.type}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">PKR {transaction.amount.toLocaleString()}</p>
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Tax Payment History</h3>
                  <button className="bg-pakistan-green text-white px-4 py-2 rounded-lg hover:bg-pakistan-dark transition-colors">
                    Download All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Transaction ID</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{transaction.id}</td>
                          <td className="py-3 px-4">{transaction.type}</td>
                          <td className="py-3 px-4 font-medium">
                            PKR {transaction.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDownloadReceipt(transaction)}
                                className="text-pakistan-green hover:text-pakistan-dark"
                                title="Download Receipt"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleViewOnBlockchain(transaction.blockchainTx)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View on Blockchain"
                              >
                                <ExternalLink size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* City Stats Tab */}
            {activeTab === 'city' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-pakistan-green to-emerald-600 p-6 rounded-xl text-white">
                    <h4 className="text-lg font-semibold mb-2">City Total</h4>
                    <p className="text-3xl font-bold">
                      PKR {cityStats.totalCollected.toLocaleString()}
                    </p>
                    <p className="text-sm opacity-90">Total tax collected</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <h4 className="text-lg font-semibold mb-2">Development Fund</h4>
                    <p className="text-3xl font-bold">
                      PKR {cityStats.developmentFund.toLocaleString()}
                    </p>
                    <p className="text-sm opacity-90">{cityStats.fundAllocation}% allocation</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                    <h4 className="text-lg font-semibold mb-2">National Rank</h4>
                    <p className="text-3xl font-bold">#{cityStats.cityRank}</p>
                    <p className="text-sm opacity-90">Out of {cityStats.totalCities} cities</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">City Comparison</h3>
                  <div className="space-y-3">
                    {cityComparison.map((city) => (
                      <div
                        key={city.city}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          city.city === userStats.city
                            ? 'bg-pakistan-green/5 border-pakistan-green'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-pakistan-green rounded-full flex items-center justify-center text-white font-bold">
                            {city.rank}
                          </div>
                          <div>
                            <p className="font-medium">{city.city}</p>
                            {city.city === userStats.city && (
                              <p className="text-sm text-pakistan-green">Your City</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">PKR {city.collected.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Total collected</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Transparency Tab */}
            {activeTab === 'transparency' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-pakistan-green to-emerald-600 p-6 rounded-xl text-white">
                    <h4 className="text-lg font-semibold mb-2">Blockchain Verified</h4>
                    <p className="text-3xl font-bold">{userStats.paymentsCount}</p>
                    <p className="text-sm opacity-90">All your payments are on blockchain</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <h4 className="text-lg font-semibold mb-2">Fund Allocation</h4>
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-sm opacity-90">Transparent fund distribution</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Blockchain Transactions</h3>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.type}</p>
                            <p className="text-sm text-gray-500 font-mono">
                              {transaction.blockchainTx}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">PKR {transaction.amount.toLocaleString()}</p>
                          <button
                            onClick={() => handleViewOnBlockchain(transaction.blockchainTx)}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            View on Polygonscan <ExternalLink className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Transparency Features
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      All payments recorded on Polygon blockchain
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Real-time fund allocation tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      City-wise spending transparency
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Immutable payment records
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
