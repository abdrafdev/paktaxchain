import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  Award,
  BarChart3,
  Globe
} from 'lucide-react'
import StatCard from '../components/StatCard'
import CityMap from '../components/CityMap'
import TaxChart from '../components/TaxChart'
import RecentTransactions from '../components/RecentTransactions'
import WalletConnect from '../components/WalletConnect'
import Link from 'next/link'

export default function Home() {
  const { isConnected } = useAccount()
  const stats = {
    totalTax: 1.23,
    totalCities: 10,
    totalTaxpayers: 45,
    topCity: 'Karachi'
  }

  const features = [
    {
      icon: ShieldCheck,
      title: 'Transparent & Secure',
      description: 'All transactions are recorded on blockchain for complete transparency'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Tracking',
      description: 'Track your tax contributions and city allocations in real-time'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Citizens can see how their city compares with others'
    },
    {
      icon: Award,
      title: 'Taxpayer Rewards',
      description: 'Earn NFTs and badges for consistent tax contributions'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 bg-pakistan-flag">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-pakistan-light">PakTaxChain</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Pakistan&apos;s first blockchain-based transparent tax system.
              Track your contributions, see fair fund allocation, and help build a better Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WalletConnect />
              {isConnected && (
                <Link href="/dashboard" className="bg-white text-pakistan-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <StatCard
              icon={DollarSign}
              title="Total Tax Collected"
              value={`${stats.totalTax.toFixed(2)} ETH`}
              color="text-green-600"
            />
            <StatCard
              icon={MapPin}
              title="Active Cities"
              value={stats.totalCities}
              color="text-blue-600"
            />
            <StatCard
              icon={Users}
              title="Total Taxpayers"
              value={stats.totalTaxpayers}
              color="text-purple-600"
            />
            <StatCard
              icon={TrendingUp}
              title="Top Contributing City"
              value={stats.topCity}
              color="text-orange-600"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose PakTaxChain?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionary features that make tax payment transparent, fair, and rewarding
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-pakistan-green mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Data Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Live Tax Data
            </h2>
            <p className="text-xl text-gray-600">
              Real-time insights into Pakistan&apos;s tax ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Tax Distribution by City
              </h3>
              <TaxChart />
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                City Map
              </h3>
              <CityMap />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              Recent Transactions
            </h2>
            <RecentTransactions />
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-pakistan-flag">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
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
              <Link href="/pay-tax" className="bg-white text-pakistan-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Pay Your Tax
              </Link>
              <Link href="/analytics" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pakistan-green transition-colors">
                View Analytics
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
