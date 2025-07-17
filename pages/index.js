import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  Award,
  BarChart3,
  Globe,
  CreditCard,
  FileText,
  CheckCircle,
  Eye,
  Github,
  Zap,
  Calculator,
  Receipt,
  Building,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import StatCard from '../components/StatCard'
import CityMap from '../components/CityMap'
import TaxChart from '../components/TaxChart'
import RecentTransactions from '../components/RecentTransactions'
import Link from 'next/link'

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const stats = {
    totalTax: 2548750, // PKR
    totalCities: 12,
    totalTaxpayers: 1247,
    topCity: 'Karachi'
  }

  const steps = [
    {
      icon: Users,
      title: 'Register & Scan CNIC',
      description: 'Create your account and verify your Pakistani identity with CNIC scanning'
    },
    {
      icon: Calculator,
      title: 'Calculate Your Tax',
      description: 'Use our smart calculator to determine your exact tax amount in PKR'
    },
    {
      icon: CreditCard,
      title: 'Pay in PKR',
      description: 'Pay your taxes securely using Pakistani Rupees through our payment gateway'
    },
    {
      icon: Receipt,
      title: 'Get Blockchain Receipt',
      description: 'Receive your transparent, immutable tax receipt on the blockchain'
    },
    {
      icon: Eye,
      title: 'Track City Contribution',
      description: 'See how your payment contributes to your city\'s development and rankings'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-pakistan-green via-pakistan-dark to-emerald-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pakistan-light opacity-10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400 to-pakistan-light opacity-5 rounded-full animate-ping"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Pakistan&apos;s Transparent Tax System,{' '}
                <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent animate-pulse">
                  Powered by Blockchain
                </span>
              </h1>
              <div className="w-32 h-2 bg-gradient-to-r from-pakistan-light to-emerald-300 mx-auto rounded-full mb-8 animate-pulse"></div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Pay your taxes in PKR. Track your city&apos;s contribution. See where every rupee goes.
              <span className="block mt-2 text-lg md:text-xl text-pakistan-light">
                Pakistan&apos;s first transparent tax ecosystem built on trust, not corruption.
              </span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={isAuthenticated ? "/calculator" : "/register"} 
                  className="bg-gradient-to-r from-white to-gray-100 text-pakistan-green px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
                >
                  <span>Pay Your Tax Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              {isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dashboard" className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-pakistan-green transition-all duration-300 flex items-center gap-3">
                    <span>Go to Dashboard</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-16"
            >
              <div className="text-sm opacity-90 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>CNIC Verified • Pakistani Citizens Only</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pakistan-green to-emerald-600 bg-clip-text text-transparent mb-6">
              Live Tax Statistics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time data from Pakistan&apos;s transparent tax ecosystem
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-gradient-to-br from-pakistan-green to-emerald-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-12 h-12 text-white/80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">₨{stats.totalTax.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Tax Collected</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Building className="w-12 h-12 text-white/80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.totalCities}</div>
                  <div className="text-sm opacity-90">Active Cities</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-12 h-12 text-white/80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.totalTaxpayers.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Taxpayers</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-pakistan-green to-emerald-600 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Simple steps to pay your taxes transparently and track your contribution to Pakistan&apos;s development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-pakistan-green/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon with animated background */}
                <div className="relative z-10 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-pakistan-green transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm">
                    {step.description}
                  </p>
                </div>
                
                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pakistan-green/20 rounded-2xl transition-all duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* City Contribution Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              City Contribution Rankings
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              See how your city compares and contributes to Pakistan&apos;s development
            </p>
            <Link href="/cities" className="inline-flex items-center gap-2 bg-gradient-to-r from-pakistan-green to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              <span>View Full City Rankings</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Tax Distribution by City
              </h3>
              <TaxChart />
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                Interactive City Map
              </h3>
              <CityMap />
            </div>
          </div>
        </div>
      </section>

      {/* Sample Tax Receipt Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Transparent Tax Receipts
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Every payment gets a secure, blockchain-verified receipt
            </p>
          </motion.div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Tax Receipt</h3>
                    <p className="text-gray-600 text-sm">Blockchain Verified</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-pakistan-green">₨25,000</div>
                  <div className="text-sm text-gray-600">Paid in PKR</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxpayer CNIC:</span>
                  <span className="font-mono text-sm">42101-1234567-8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-semibold">Karachi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Hash:</span>
                  <span className="font-mono text-sm text-pakistan-green">0x1234...5678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Built on Trust & Transparency
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Open source, secure, and validated by trusted Pakistani institutions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Open Source</h3>
              <p className="text-gray-600">Fully transparent code available on GitHub for public review</p>
              <a href="https://github.com" className="inline-flex items-center gap-2 mt-4 text-pakistan-green font-semibold hover:underline">
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">NADRA Validation</h3>
              <p className="text-gray-600">CNIC verification through official NADRA systems</p>
              <div className="inline-flex items-center gap-2 mt-4 text-orange-600 font-semibold">
                <Zap className="w-4 h-4" />
                Coming Soon
              </div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Blockchain Secured</h3>
              <p className="text-gray-600">All transactions recorded on immutable blockchain ledger</p>
              <div className="inline-flex items-center gap-2 mt-4 text-green-600 font-semibold">
                <CheckCircle className="w-4 h-4" />
                Active
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-pakistan-flag">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Pakistan&apos;s Tax System?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of Pakistani citizens who are already contributing to a transparent, 
              fair, and accountable tax system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isAuthenticated ? "/calculator" : "/register"} className="bg-white text-pakistan-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center">
                <span>Start Paying Tax</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/cities" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pakistan-green transition-colors flex items-center gap-2 justify-center">
                <span>View City Rankings</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
