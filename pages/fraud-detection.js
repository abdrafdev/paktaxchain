import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Search, 
  Flag, 
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Filter,
  Download
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const fraudAlerts = [
  {
    id: 1,
    type: 'CNIC Duplicate',
    severity: 'High',
    description: 'CNIC 42101-1234567-8 used by multiple accounts',
    location: 'Karachi',
    timestamp: '2024-01-15 14:30:00',
    status: 'investigating',
    details: {
      cnic: '42101-1234567-8',
      accounts: ['user123', 'user456'],
      totalTransactions: 5,
      totalAmount: 125000
    }
  },
  {
    id: 2,
    type: 'Anomalous Payment',
    severity: 'Medium',
    description: 'Unusually high payment amount detected',
    location: 'Lahore',
    timestamp: '2024-01-15 12:15:00',
    status: 'resolved',
    details: {
      amount: 2500000,
      average: 45000,
      user: 'user789',
      deviation: '5.5x above average'
    }
  },
  {
    id: 3,
    type: 'Rapid Payments',
    severity: 'Medium',
    description: 'Multiple payments from same user within 1 hour',
    location: 'Islamabad',
    timestamp: '2024-01-15 10:45:00',
    status: 'pending',
    details: {
      payments: 8,
      timeframe: '45 minutes',
      user: 'user321',
      totalAmount: 180000
    }
  },
  {
    id: 4,
    type: 'Ghost City',
    severity: 'Critical',
    description: 'Suspicious activity patterns in small city',
    location: 'Mianwali',
    timestamp: '2024-01-15 09:20:00',
    status: 'investigating',
    details: {
      population: 15000,
      taxpayers: 8500,
      suspiciousRatio: '56.7%',
      flagReason: 'Too many taxpayers for city size'
    }
  },
  {
    id: 5,
    type: 'OCR Mismatch',
    severity: 'Low',
    description: 'CNIC text does not match uploaded image',
    location: 'Rawalpindi',
    timestamp: '2024-01-15 08:10:00',
    status: 'resolved',
    details: {
      uploadedText: '42101-1234567-8',
      ocrResult: '42101-1234567-3',
      confidence: 0.85
    }
  }
]

const anomalyPatterns = [
  {
    pattern: 'CNIC Fraud',
    detected: 15,
    resolved: 12,
    investigating: 3,
    trend: '+5%',
    description: 'Duplicate or fake CNIC usage'
  },
  {
    pattern: 'Payment Anomalies',
    detected: 42,
    resolved: 38,
    investigating: 4,
    trend: '-12%',
    description: 'Unusual payment amounts or patterns'
  },
  {
    pattern: 'Location Spoofing',
    detected: 8,
    resolved: 6,
    investigating: 2,
    trend: '+3%',
    description: 'Fake city or location information'
  },
  {
    pattern: 'Rapid Transactions',
    detected: 23,
    resolved: 20,
    investigating: 3,
    trend: '-8%',
    description: 'Too many transactions in short time'
  }
]

const cityRiskScores = [
  { city: 'Karachi', risk: 'Low', score: 2.1, taxpayers: 125000, flagged: 45 },
  { city: 'Lahore', risk: 'Low', score: 1.8, taxpayers: 98000, flagged: 32 },
  { city: 'Islamabad', risk: 'Medium', score: 3.2, taxpayers: 65000, flagged: 28 },
  { city: 'Rawalpindi', risk: 'Low', score: 2.5, taxpayers: 45000, flagged: 18 },
  { city: 'Faisalabad', risk: 'Medium', score: 3.8, taxpayers: 38000, flagged: 22 },
  { city: 'Multan', risk: 'High', score: 6.2, taxpayers: 32000, flagged: 35 },
  { city: 'Peshawar', risk: 'Medium', score: 4.1, taxpayers: 28000, flagged: 19 },
  { city: 'Quetta', risk: 'High', score: 7.8, taxpayers: 20000, flagged: 28 }
]

export default function FraudDetection() {
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredAlerts = fraudAlerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesSearch = alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSeverity && matchesSearch
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'investigating': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-600'
      case 'Medium': return 'text-yellow-600'
      case 'Low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const handleResolveAlert = (alertId) => {
    toast.success('Alert marked as resolved')
    // In real implementation, update the alert status
  }

  const handleInvestigateAlert = (alertId) => {
    toast.info('Alert marked for investigation')
    // In real implementation, update the alert status
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 shadow-xl">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-4">
              <Shield className="w-12 h-12" />
              Fraud Detection
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Advanced AI-powered fraud detection system to maintain tax system integrity
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{fraudAlerts.length}</div>
                <div className="text-sm opacity-90">Total Alerts</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{fraudAlerts.filter(a => a.status === 'investigating').length}</div>
                <div className="text-sm opacity-90">Investigating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{fraudAlerts.filter(a => a.status === 'resolved').length}</div>
                <div className="text-sm opacity-90">Resolved</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Detection Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Fraud Detection Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time monitoring of suspicious activities and anomalies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {anomalyPatterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{pattern.pattern}</h3>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    pattern.trend.startsWith('+') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {pattern.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{pattern.description}</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{pattern.detected}</div>
                    <div className="text-xs text-gray-500">Detected</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{pattern.investigating}</div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{pattern.resolved}</div>
                    <div className="text-xs text-gray-500">Resolved</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Fraud Alerts */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Fraud Alerts
              </h2>
              <p className="text-sm text-gray-600 mt-1">Real-time fraud detection alerts</p>
            </div>

            {/* Filters */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Severity</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Alerts List */}
            <div className="divide-y divide-gray-200">
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{alert.type}</h3>
                      <p className="text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </span>
                        <span>ID: {alert.id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'investigating' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleResolveAlert(alert.id)
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                      {alert.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInvestigateAlert(alert.id)
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Investigate
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* City Risk Assessment */}
        <section>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                City Risk Assessment
              </h2>
              <p className="text-sm text-gray-600 mt-1">Risk scores based on fraud patterns and anomalies</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cityRiskScores.map((city, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{city.city}</h3>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        city.risk === 'High' ? 'bg-red-100 text-red-600' :
                        city.risk === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {city.risk}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Risk Score:</span>
                        <span className={`font-bold ${getRiskColor(city.risk)}`}>{city.score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxpayers:</span>
                        <span className="font-medium">{city.taxpayers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Flagged:</span>
                        <span className="font-medium text-red-600">{city.flagged}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alert Details
                </h3>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getSeverityColor(selectedAlert.severity)}`}>
                    {selectedAlert.severity}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(selectedAlert.status)}`}>
                    {selectedAlert.status}
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedAlert.type}</h4>
                <p className="text-gray-600 mb-4">{selectedAlert.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2">{selectedAlert.location}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Timestamp:</span>
                    <span className="ml-2">{selectedAlert.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-3">Details</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  {Object.entries(selectedAlert.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                      <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleResolveAlert(selectedAlert.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => handleInvestigateAlert(selectedAlert.id)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Investigate Further
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
