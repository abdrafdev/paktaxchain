import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { MapPin, TrendingUp, Users, DollarSign, Activity, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
// import { PAKISTANI_CITIES } from '../lib/pakistaniTaxCalculator'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { PieChart as RePieChart, Pie as RePie, Cell as ReCell, Tooltip as ReTooltip, Legend as ReLegend, ResponsiveContainer as ReResponsiveContainer } from 'recharts'

// Smart contract ABI and address (update as needed)
const PAK_TAX_LOG_ABI = [
  // Only the cityStats mapping and registeredCities array
  "function cityStats(string city) view returns (uint256 totalTaxCollectedPKR, uint256 totalFundsAllocatedPKR, uint256 totalFundsWithdrawnPKR, uint256 taxpayerCount, bool isRegistered)",
  "function registeredCities(uint256) view returns (string)",
  "function registeredCitiesLength() view returns (uint256)"
]
const PAK_TAX_LOG_ADDRESS = process.env.NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS || "0xYourContractAddressHere"

const COLORS = ["#16a34a", "#2563eb", "#f59e42", "#a21caf", "#e11d48", "#0ea5e9", "#fbbf24", "#6366f1", "#f43f5e", "#10b981"]

export default function AnalyticsPage() {
  const { isConnected } = useAccount()
  const [cityData, setCityData] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allocating, setAllocating] = useState(false)
  const [allocationStatus, setAllocationStatus] = useState('')
  const [breakdownCity, setBreakdownCity] = useState(null)

  // Fetch city stats from blockchain
  const fetchCityStats = async () => {
    setLoading(true)
    try {
      // Always use demo data for now (until blockchain is set up)
      const demoData = [
        { city: 'Karachi', totalTax: 2500000, allocated: 2000000, withdrawn: 1500000, taxpayers: 1250 },
        { city: 'Lahore', totalTax: 1800000, allocated: 1400000, withdrawn: 1000000, taxpayers: 980 },
        { city: 'Islamabad', totalTax: 1200000, allocated: 1000000, withdrawn: 800000, taxpayers: 650 },
        { city: 'Rawalpindi', totalTax: 900000, allocated: 700000, withdrawn: 500000, taxpayers: 450 },
        { city: 'Faisalabad', totalTax: 750000, allocated: 600000, withdrawn: 400000, taxpayers: 380 },
        { city: 'Multan', totalTax: 650000, allocated: 500000, withdrawn: 350000, taxpayers: 320 },
        { city: 'Peshawar', totalTax: 550000, allocated: 450000, withdrawn: 300000, taxpayers: 280 },
        { city: 'Quetta', totalTax: 400000, allocated: 300000, withdrawn: 200000, taxpayers: 200 },
        { city: 'Sialkot', totalTax: 350000, allocated: 280000, withdrawn: 180000, taxpayers: 180 },
        { city: 'Gujranwala', totalTax: 300000, allocated: 250000, withdrawn: 150000, taxpayers: 150 }
      ]
      
      setCityData(demoData)
      setLastUpdated(new Date())
      setAllocationStatus('')
      
      // Show success message for demo
      toast.success('Demo data loaded successfully!')
    } catch (err) {
      console.error('Error loading demo data:', err)
      toast.error('Error loading data')
    }
    setLoading(false)
  }

  // Admin: Allocate funds
  const handleAllocateFunds = async () => {
    setAllocating(true)
    setAllocationStatus('')
    try {
      if (!window.ethereum) throw new Error('No wallet found')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(PAK_TAX_LOG_ADDRESS, [...PAK_TAX_LOG_ABI, "function allocateFunds() external"], signer)
      const tx = await contract.allocateFunds()
      toast.loading('Allocating funds on blockchain...', { id: 'allocating-funds' })
      await tx.wait()
      toast.success('Funds allocated successfully!', { id: 'allocating-funds' })
      setAllocationStatus('Funds allocated successfully!')
      await fetchCityStats()
    } catch (err) {
      toast.error('Fund allocation failed: ' + (err?.message || 'Unknown error'))
      setAllocationStatus('Fund allocation failed.')
    } finally {
      setAllocating(false)
    }
  }

  useEffect(() => {
    fetchCityStats()
    // eslint-disable-next-line
  }, [])

  // Prepare chart data
  const barData = cityData.map((c, i) => ({
    name: c.city,
    "Total Tax": c.totalTax
  }))
  const pieData = cityData.map((c, i) => ({
    name: c.city,
    value: c.allocated
  }))

  // Map city name to coordinates (for demo, use static data)
  const cityCoords = {
    Karachi: [24.8607, 67.0011],
    Lahore: [31.5497, 74.3436],
    Faisalabad: [31.4504, 73.1350],
    Rawalpindi: [33.6844, 73.0479],
    Gujranwala: [32.1877, 74.1945],
    Peshawar: [34.0151, 71.5249],
    Multan: [30.1575, 71.5249],
    Hyderabad: [25.3960, 68.3578],
    Islamabad: [33.6844, 73.0479],
    Quetta: [30.1798, 66.9750]
  }

  const formatPKR = (value) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(value);
  }

  // Fund allocation breakdown (fixed split)
  const getFundBreakdown = (allocated) => [
    { name: 'Infrastructure', value: Math.round(allocated * 0.4), color: '#3B82F6' },
    { name: 'Education', value: Math.round(allocated * 0.25), color: '#10B981' },
    { name: 'Healthcare', value: Math.round(allocated * 0.2), color: '#EF4444' },
    { name: 'Security', value: Math.round(allocated * 0.1), color: '#F59E0B' },
    { name: 'Environment', value: Math.round(allocated * 0.05), color: '#8B5CF6' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">Loading Analytics Dashboard</h3>
          <p className="text-gray-600 text-lg">Fetching real-time city data...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 flex items-center justify-center gap-4">
              <TrendingUp className="w-12 h-12" />
              Analytics Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Real-time analytics of tax collection and fund allocation for all major Pakistani cities.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-white text-sm font-medium">Live Data</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-white text-sm font-medium">Blockchain Verified</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-white text-sm font-medium">PKR Currency</span>
              </div>
            </div>
            <div className="text-blue-100 text-sm">
              <span>Last updated: {lastUpdated ? lastUpdated.toLocaleString('en-PK') : 'Never'}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={fetchCityStats}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {isConnected && (
              <button
                onClick={handleAllocateFunds}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                disabled={allocating}
              >
                <DollarSign className={`w-4 h-4 ${allocating ? 'animate-pulse' : ''}`} />
                {allocating ? 'Allocating...' : 'Allocate Funds (Admin)'}
              </button>
            )}
          </div>
          {allocationStatus && (
            <div className="text-center mt-3">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                allocationStatus.includes('success') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {allocationStatus}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tax Collected</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPKR(cityData.reduce((sum, city) => sum + city.totalTax, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allocated</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPKR(cityData.reduce((sum, city) => sum + city.allocated, 0))}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Taxpayers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {cityData.reduce((sum, city) => sum + city.taxpayers, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cities</p>
                <p className="text-2xl font-bold text-orange-600">{cityData.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Tax Collection by City</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>Live Data</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={v => v.toLocaleString()} />
                <Tooltip formatter={v => formatPKR(v)} contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="Total Tax" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Fund Allocation Distribution</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DollarSign className="w-4 h-4" />
                <span>PKR</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={v => formatPKR(v)} contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Enhanced Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              City Fund Allocation Overview
            </h3>
            <p className="text-sm text-gray-600 mt-1">Detailed breakdown of tax collection and fund allocation</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tax</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawn</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taxpayers</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cityData.map((c, i) => (
                  <tr key={c.city} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        <div className="text-sm font-medium text-gray-900">{c.city}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-green-600">{formatPKR(c.totalTax)}</div>
                      <div className="text-xs text-gray-500">{((c.totalTax / cityData.reduce((sum, city) => sum + city.totalTax, 0)) * 100).toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-blue-600">{formatPKR(c.allocated)}</div>
                      <div className="text-xs text-gray-500">{((c.allocated / c.totalTax) * 100).toFixed(1)}% of tax</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-purple-600">{formatPKR(c.withdrawn)}</div>
                      <div className="text-xs text-gray-500">{((c.withdrawn / c.allocated) * 100).toFixed(1)}% of allocated</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-gray-900">{c.taxpayers.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">avg: {formatPKR(c.totalTax / c.taxpayers)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setBreakdownCity(c)}
                        disabled={c.allocated === 0}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Enhanced Fund Breakdown Modal */}
        {breakdownCity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {breakdownCity.city} Fund Breakdown
                  </h3>
                  <button
                    className="text-white hover:text-gray-200 transition-colors"
                    onClick={() => setBreakdownCity(null)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-blue-100 text-sm">
                  Total Allocated: <span className="font-semibold text-white">{formatPKR(breakdownCity.allocated)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ReResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <RePie
                          data={getFundBreakdown(breakdownCity.allocated)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {getFundBreakdown(breakdownCity.allocated).map((entry, idx) => (
                            <ReCell key={entry.name} fill={entry.color} />
                          ))}
                        </RePie>
                        <ReTooltip formatter={v => formatPKR(v)} contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      </RePieChart>
                    </ReResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {getFundBreakdown(breakdownCity.allocated).map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="font-medium text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{formatPKR(item.value)}</div>
                          <div className="text-xs text-gray-500">{((item.value / breakdownCity.allocated) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
