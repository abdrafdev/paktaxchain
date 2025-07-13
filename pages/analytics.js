import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { toast } from 'react-hot-toast'
import { PAKISTANI_CITIES } from '../lib/pakistaniTaxCalculator'
import { ethers } from 'ethers'
import 'leaflet/dist/leaflet.css'
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
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(PAK_TAX_LOG_ADDRESS, PAK_TAX_LOG_ABI, provider)
        // Get all registered cities
        let cities = []
        if (contract.registeredCitiesLength) {
          const len = await contract.registeredCitiesLength()
          for (let i = 0; i < len; i++) {
            const city = await contract.registeredCities(i)
            cities.push(city)
          }
        } else {
          // fallback to static list
          cities = PAKISTANI_CITIES.map(c => c.name)
        }
        // Fetch stats for each city
        const stats = await Promise.all(
          cities.map(async (city) => {
            try {
              const s = await contract.cityStats(city)
              return {
                city,
                totalTax: Number(s.totalTaxCollectedPKR) / 100, // convert paisa to PKR
                allocated: Number(s.totalFundsAllocatedPKR) / 100,
                withdrawn: Number(s.totalFundsWithdrawnPKR || s.totalFundsUsedPKR || 0) / 100,
                taxpayers: Number(s.taxpayerCount)
              }
            } catch {
              return {
                city,
                totalTax: 0,
                allocated: 0,
                withdrawn: 0,
                taxpayers: 0
              }
            }
          })
        )
        setCityData(stats)
        setLastUpdated(new Date())
        setAllocationStatus('')
      } else {
        throw new Error('No wallet found')
      }
    } catch (err) {
      // fallback to mock/demo data
      toast.error('Could not fetch from blockchain, showing demo data')
      setCityData(PAKISTANI_CITIES.map((c, i) => ({
        city: c.name,
        totalTax: Math.floor(Math.random() * 1000000),
        allocated: Math.floor(Math.random() * 800000),
        withdrawn: Math.floor(Math.random() * 500000),
        taxpayers: Math.floor(Math.random() * 1000)
      })))
      setLastUpdated(new Date())
      setAllocationStatus('')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            City Dashboard & Fund Allocation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time analytics of tax collection and fund allocation for all major Pakistani cities.
          </p>
          <div className="mt-4 text-sm text-gray-500 flex flex-col items-center gap-2">
            <span>Last updated: {lastUpdated ? lastUpdated.toLocaleString('en-PK') : '...'}</span>
            <div className="flex gap-2">
              <button
                onClick={fetchCityStats}
                className="px-3 py-1 bg-pakistan-green text-white rounded hover:bg-pakistan-dark transition-colors"
                disabled={loading}
              >
                Refresh
              </button>
              {isConnected && (
                <button
                  onClick={handleAllocateFunds}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors"
                  disabled={allocating}
                >
                  {allocating ? 'Allocating...' : 'Allocate Funds (Admin)'}
                </button>
              )}
            </div>
            {allocationStatus && (
              <span className={`text-sm ${allocationStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{allocationStatus}</span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Total Tax Collected by City</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => v.toLocaleString()} />
                <Tooltip formatter={v => formatPKR(v)} />
                <Bar dataKey="Total Tax">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Fund Allocation % by City</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={v => formatPKR(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">City Map</h3>
            <div className="h-72 w-full rounded-lg overflow-hidden">
              <MapContainer center={[30.3753, 69.3451]} zoom={5.2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {cityData.map((c, i) =>
                  cityCoords[c.city] ? (
                    <Marker key={c.city} position={cityCoords[c.city]}>
                      <Popup>
                        <div className="font-semibold">{c.city}</div>
                        <div>Total Tax: {formatPKR(c.totalTax)}</div>
                        <div>Allocated: {formatPKR(c.allocated)}</div>
                        <div>Taxpayers: {c.taxpayers}</div>
                      </Popup>
                    </Marker>
                  ) : null
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Table/List */}
        <div className="bg-white rounded-lg shadow-xl p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">City Fund Allocation Table</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-right">Total Tax (PKR)</th>
                <th className="px-4 py-2 text-right">Allocated (PKR)</th>
                <th className="px-4 py-2 text-right">Withdrawn (PKR)</th>
                <th className="px-4 py-2 text-right">Taxpayers</th>
                <th className="px-4 py-2 text-center">Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {cityData.map((c, i) => (
                <tr key={c.city} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{c.city}</td>
                  <td className="px-4 py-2 text-right">{formatPKR(c.totalTax)}</td>
                  <td className="px-4 py-2 text-right">{formatPKR(c.allocated)}</td>
                  <td className="px-4 py-2 text-right">{formatPKR(c.withdrawn)}</td>
                  <td className="px-4 py-2 text-right">{c.taxpayers}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 bg-pakistan-green text-white rounded hover:bg-pakistan-dark text-xs"
                      onClick={() => setBreakdownCity(c)}
                      disabled={c.allocated === 0}
                    >
                      View Fund Breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fund Breakdown Modal */}
        {breakdownCity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setBreakdownCity(null)}
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-2 text-center">{breakdownCity.city} Fund Breakdown</h3>
              <div className="mb-4 text-center text-gray-500 text-sm">
                Total Allocated: <span className="font-semibold text-pakistan-green">{formatPKR(breakdownCity.allocated)}</span>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="w-full md:w-1/2 h-48">
                  <ReResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <RePie
                        data={getFundBreakdown(breakdownCity.allocated)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {getFundBreakdown(breakdownCity.allocated).map((entry, idx) => (
                          <ReCell key={entry.name} fill={entry.color} />
                        ))}
                      </RePie>
                      <ReLegend />
                      <ReTooltip formatter={v => formatPKR(v)} />
                    </RePieChart>
                  </ReResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <table className="w-full text-xs">
                    <tbody>
                      {getFundBreakdown(breakdownCity.allocated).map((item) => (
                        <tr key={item.name}>
                          <td className="py-1 pr-2 font-medium text-gray-700">{item.name}</td>
                          <td className="py-1 text-right font-mono">{formatPKR(item.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
