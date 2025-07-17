import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Building,
  Users,
  FileText,
  GraduationCap
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function SubscriberLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful login
      toast.success('Login successful! Redirecting to dashboard...')
      
      setTimeout(() => {
        router.push('/subscriber/dashboard')
      }, 1000)
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const subscriberTypes = [
    {
      icon: Users,
      title: 'NGO Access',
      description: 'Transparency monitoring and corruption tracking'
    },
    {
      icon: FileText,
      title: 'Media Access',
      description: 'Investigative journalism and story development'
    },
    {
      icon: Building,
      title: 'Government Access',
      description: 'Policy analysis and performance monitoring'
    },
    {
      icon: GraduationCap,
      title: 'Academic Access',
      description: 'Research and educational purposes'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-pakistan-green via-pakistan-dark to-emerald-800 overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Subscriber{' '}
              <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
            <p className="text-xl mb-6 max-w-2xl mx-auto font-light">
              Access Pakistan's most comprehensive tax transparency platform
            </p>
            <div className="flex items-center justify-center gap-2 text-pakistan-light">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure • Verified • Trusted</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Login Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to your subscriber account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent transition-colors"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-pakistan-green border-gray-300 rounded focus:ring-pakistan-green focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-pakistan-green hover:text-pakistan-dark transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pakistan-green to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      href="/data-access" 
                      className="text-pakistan-green font-semibold hover:text-pakistan-dark transition-colors"
                    >
                      View subscription plans
                    </Link>
                  </p>
                </div>
              </motion.div>

              {/* Subscriber Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Subscriber Access Types
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Different subscription tiers provide tailored access to Pakistan's tax transparency data
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {subscriberTypes.map((type, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{type.title}</h4>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-pakistan-green to-emerald-600 text-white p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    What You Get
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time tax collection data</li>
                    <li>• City-wise budget allocation insights</li>
                    <li>• Fraud detection and alerts</li>
                    <li>• API access for custom integrations</li>
                    <li>• Historical data and trend analysis</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-pakistan-green text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Active Subscribers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-sm opacity-90">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
