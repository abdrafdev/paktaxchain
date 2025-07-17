import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  BarChart3, 
  Shield, 
  Users, 
  Building, 
  GraduationCap, 
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Lock,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function DataAccess() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  
  const plans = [
    {
      id: 'ngo',
      name: 'NGO Basic',
      price: 35,
      target: 'NGOs & Watchdog Organizations',
      icon: Users,
      color: 'from-green-500 to-green-600',
      features: [
        'City-wise tax collection data',
        'Fund allocation tracking',
        'Monthly transparency reports',
        'Corruption pattern analysis',
        'Basic dashboard access',
        'CSV export functionality'
      ],
      description: 'Perfect for NGOs monitoring government transparency and fighting corruption'
    },
    {
      id: 'media',
      name: 'Media Pro',
      price: 99,
      target: 'Journalists & Media Houses',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Real-time data access',
        'Advanced analytics dashboard',
        'Story-ready reports',
        'Interactive charts & graphs',
        'API access',
        'Historical data (2+ years)',
        'Priority support'
      ],
      description: 'Comprehensive tools for investigative journalism and media reporting',
      popular: true
    },
    {
      id: 'government',
      name: 'Government Enterprise',
      price: 499,
      target: 'Government Bodies & FBR',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Full database access',
        'Real-time monitoring',
        'Advanced fraud detection',
        'Custom report generation',
        'Multi-user accounts',
        'Integration support',
        'Dedicated support team'
      ],
      description: 'Enterprise-grade access for government institutions and policy makers'
    },
    {
      id: 'academic',
      name: 'Academic Access',
      price: 19,
      target: 'Universities & Researchers',
      icon: GraduationCap,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Research-grade datasets',
        'Historical trend analysis',
        'Student account management',
        'Academic reports',
        'Citation-ready data',
        'Educational discounts'
      ],
      description: 'Special pricing for academic institutions and research purposes'
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: 'Complete Transparency',
      description: 'Access to all anonymized tax data with full blockchain verification'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Powerful dashboards with real-time insights and trend analysis'
    },
    {
      icon: Globe,
      title: 'API Access',
      description: 'Programmatic access to data for custom integrations and applications'
    },
    {
      icon: Lock,
      title: 'Secure & Compliant',
      description: 'Bank-level security with full privacy protection for citizen data'
    }
  ]

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId)
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
              Pakistan's Tax Data{' '}
              <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                Transparency API
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-light leading-relaxed">
              Access comprehensive tax collection data, city-wise analytics, and transparency insights for Pakistan.
            </p>
            <div className="flex items-center justify-center gap-2 text-pakistan-light mb-8">
              <Database className="w-5 h-5" />
              <span className="text-sm">Real-time • Verified • Anonymized</span>
            </div>
            <Link 
              href="#plans" 
              className="inline-flex items-center gap-2 bg-white text-pakistan-green px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              <span>View Subscription Plans</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pakistan-green to-emerald-600 bg-clip-text text-transparent mb-6">
              Why Choose PakTaxChain Data?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most comprehensive and trusted source for Pakistani tax transparency data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Choose Your Access Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From NGO monitoring to government enterprise solutions, we have the right plan for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                  plan.popular ? 'ring-2 ring-pakistan-green' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-pakistan-green text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.target}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      selectedPlan === plan.id
                        ? 'bg-pakistan-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Documentation Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Developer-Friendly API
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RESTful API with comprehensive documentation and code examples
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 ml-4 text-sm">API Example</span>
            </div>
            
            <div className="text-green-400 font-mono text-sm">
              <div className="mb-2">GET /api/v1/tax-data/cities</div>
              <div className="mb-2">Authorization: Bearer YOUR_API_KEY</div>
              <div className="mb-4">Content-Type: application/json</div>
              
              <div className="text-gray-300 mb-2">Response:</div>
              <pre className="text-xs">{`{
  "cities": [
    {
      "name": "Karachi",
      "totalTax": 4500000,
      "fundAllocated": 2250000,
      "taxpayers": 1247,
      "rank": 2
    },
    {
      "name": "Lahore", 
      "totalTax": 5200000,
      "fundAllocated": 2800000,
      "taxpayers": 1456,
      "rank": 1
    }
  ]
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-pakistan-green to-emerald-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Access Pakistan's Tax Data?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join NGOs, media houses, and researchers already using our platform to promote transparency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/subscriber/login" 
              className="inline-flex items-center gap-2 bg-white text-pakistan-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pakistan-green transition-colors"
            >
              <span>Contact Sales</span>
              <Zap className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
