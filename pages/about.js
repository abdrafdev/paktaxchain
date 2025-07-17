import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Eye, 
  CheckCircle,
  FileText,
  Github,
  Award,
  Zap
} from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'CNIC Verification',
      description: 'Secure identity verification through Pakistani CNIC scanning and OCR technology'
    },
    {
      icon: TrendingUp,
      title: 'Tax Transparency',
      description: 'Real-time tracking of tax collection and distribution across Pakistani cities'
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Gamified tax payment system with leaderboards and NFT rewards'
    },
    {
      icon: Eye,
      title: 'Blockchain Receipts',
      description: 'Immutable proof of tax payments recorded on Polygon blockchain'
    }
  ]

  const mission = [
    {
      title: 'Transparency',
      description: 'Every rupee tracked from collection to city development funds'
    },
    {
      title: 'Trust',
      description: 'Blockchain-verified receipts eliminate corruption and fraud'
    },
    {
      title: 'Gamification',
      description: 'NFT rewards and leaderboards make tax payment engaging'
    },
    {
      title: 'Pakistani Identity',
      description: 'Built specifically for Pakistani citizens with CNIC verification'
    }
  ]

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
              About{' '}
              <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                PakTaxChain
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-light leading-relaxed">
              Pakistan's first blockchain-powered transparent tax system. Built by Pakistanis, for Pakistanis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pakistan-green to-emerald-600 bg-clip-text text-transparent mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To create a transparent, trustworthy, and engaging tax system that connects Pakistani citizens 
              with their government through blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mission.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PakTaxChain combines traditional Pakistani tax processes with cutting-edge blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern, secure, and scalable technologies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Frontend</h3>
              <p className="text-gray-600 mb-4">Next.js with Tailwind CSS for responsive Pakistani-themed UI</p>
              <div className="text-sm text-gray-500">Next.js • React • Tailwind CSS</div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Backend</h3>
              <p className="text-gray-600 mb-4">Supabase with PostgreSQL for secure data management</p>
              <div className="text-sm text-gray-500">Supabase • PostgreSQL • Tesseract.js</div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Blockchain</h3>
              <p className="text-gray-600 mb-4">Polygon network for transparent receipt storage</p>
              <div className="text-sm text-gray-500">Polygon • Solidity • ERC721</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-br from-pakistan-green to-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Every decision we make is guided by our commitment to Pakistan's development and citizens' trust.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Open Source</h3>
              <p className="opacity-90">Complete transparency with open-source code available for public review</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pakistani First</h3>
              <p className="opacity-90">Built specifically for Pakistani citizens with CNIC verification</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="opacity-90">Combining traditional tax systems with modern blockchain technology</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
