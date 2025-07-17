import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Shield, 
  Users, 
  BarChart3, 
  Globe, 
  Database,
  AlertTriangle,
  TrendingUp,
  FileText,
  Building,
  GraduationCap,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const subscriptionPlans = [
  {
    id: 'ngo-basic',
    name: 'NGO Basic',
    price: 25,
    currency: 'USD',
    billing: 'month',
    target: 'Local NGOs',
    description: 'Perfect for local NGOs tracking corruption and demanding transparency',
    icon: Users,
    color: 'from-green-500 to-green-600',
    features: [
      'City-wise tax collection data',
      'Basic fund allocation tracking',
      'Monthly corruption reports',
      'Email alerts for anomalies',
      'Basic dashboard access',
      'Export to CSV',
      'Community forum access'
    ],
    limitations: [
      'Limited to 5 cities',
      'Basic analytics only',
      'Monthly data refresh'
    ],
    popular: false
  },
  {
    id: 'media-pro',
    name: 'Media Pro',
    price: 99,
    currency: 'USD',
    billing: 'month',
    target: 'TV Channels, Newspapers',
    description: 'For journalists and media houses exposing corruption and reporting trends',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Real-time data access',
      'Advanced analytics dashboard',
      'Story-ready reports',
      'Interactive charts & graphs',
      'API access for integration',
      'Priority support',
      'White-label reports',
      'Social media assets',
      'Historical data (2+ years)'
    ],
    limitations: [
      'Limited API calls (10K/month)',
      'Standard refresh rate (hourly)'
    ],
    popular: true
  },
  {
    id: 'government-insights',
    name: 'Government Insights',
    price: 499,
    currency: 'USD',
    billing: 'month',
    target: 'City Governments, FBR',
    description: 'For government bodies to defend their performance and optimize policies',
    icon: Building,
    color: 'from-purple-500 to-purple-600',
    features: [
      'Full database access',
      'Real-time monitoring',
      'Advanced fraud detection',
      'Custom report generation',
      'Multi-user accounts',
      'Priority API access',
      'Dedicated support',
      'Policy impact analysis',
      'Predictive analytics',
      'Integration support'
    ],
    limitations: [
      'Requires government verification'
    ],
    popular: false
  },
  {
    id: 'academic-access',
    name: 'Academic Access',
    price: 19,
    currency: 'USD',
    billing: 'month',
    target: 'Universities, Researchers',
    description: 'For academic institutions studying Pakistan\'s economy and tax patterns',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    features: [
      'Research-grade data access',
      'Historical trends analysis',
      'Student account management',
      'Academic reports',
      'Citation-ready datasets',
      'Research collaboration tools',
      'Educational discounts'
    ],
    limitations: [
      'Academic verification required',
      'Non-commercial use only'
    ],
    popular: false
  }
]

const enterpriseFeatures = [
  'Unlimited API calls',
  'Real-time data streaming',
  'Custom integrations',
  'Dedicated infrastructure',
  'SLA guarantees',
  'Priority phone support',
  'Custom training',
  'White-label solutions'
]

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-pakistan-green via-emerald-600 to-green-700 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transparency as a Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Access Pakistan&apos;s most comprehensive tax transparency platform.
              For NGOs, media, government, and researchers.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Real-time Data</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">API Access</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Fraud Detection</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Custom Reports</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-pakistan-green text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly' 
                  ? 'bg-pakistan-green text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly <span className="text-sm text-green-600 ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden relative ${
                plan.popular ? 'ring-2 ring-pakistan-green' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-pakistan-green text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`bg-gradient-to-r ${plan.color} p-6 ${plan.popular ? 'pt-8' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <plan.icon className="w-8 h-8 text-white" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      ${billingCycle === 'yearly' ? Math.round(plan.price * 0.8) : plan.price}
                    </div>
                    <div className="text-sm text-white/80">per month</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/90 text-sm mb-4">{plan.target}</p>
                <p className="text-white/80 text-sm">{plan.description}</p>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="border-t pt-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Limitations</h4>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-pakistan-green text-white hover:bg-pakistan-dark'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-3xl font-bold">Enterprise</h3>
                </div>
                <p className="text-xl text-gray-300 mb-6">
                  For large organizations, government ministries, and international watchdogs
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {enterpriseFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Contact Sales
                  </button>
                  <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors">
                    Request Demo
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">Custom</div>
                <div className="text-xl text-gray-300 mb-4">Pricing</div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    Volume discounts available for government contracts and multi-year commitments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use Cases */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Uses PakTaxChain?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform serves diverse stakeholders in Pakistan&apos;s transparency ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "NGOs & Activists",
                description: "Expose corruption, demand fair budgets, and advocate for underfunded cities",
                icon: Users,
                examples: ["Transparency International", "PILDAT", "Local advocacy groups"]
              },
              {
                title: "Media & Journalists",
                description: "Report on tax trends, investigate anomalies, and create data-driven stories",
                icon: FileText,
                examples: ["Dawn News", "Express Tribune", "Independent journalists"]
              },
              {
                title: "Government Bodies",
                description: "Monitor performance, optimize policies, and defend allocation decisions",
                icon: Building,
                examples: ["FBR", "City Governments", "Planning Commission"]
              },
              {
                title: "Academic Institutions",
                description: "Research Pakistan's economy, analyze tax patterns, and educate students",
                icon: GraduationCap,
                examples: ["LUMS", "IBA", "Research institutes"]
              },
              {
                title: "International Watchdogs",
                description: "Audit governance, assess investment climate, and monitor development",
                icon: Globe,
                examples: ["World Bank", "IMF", "Development agencies"]
              },
              {
                title: "Private Sector",
                description: "Assess business climate, track regional development, and make investment decisions",
                icon: TrendingUp,
                examples: ["Consulting firms", "Investment banks", "MNCs"]
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <useCase.icon className="w-6 h-6 text-pakistan-green" />
                  <h3 className="text-xl font-bold text-gray-900">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="space-y-1">
                  {useCase.examples.map((example, idx) => (
                    <div key={idx} className="text-sm text-gray-500">• {example}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-pakistan-green py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Access Pakistan's Tax Data?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations already using PakTaxChain for transparency and accountability
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-pakistan-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pakistan-green transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
