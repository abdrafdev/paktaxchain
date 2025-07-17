import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight,
  Shield,
  Building,
  FileText,
  GraduationCap
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'citizen'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const userTypes = [
    { value: 'citizen', label: 'Citizen', icon: User, description: 'Pakistani taxpayers' },
    { value: 'subscriber', label: 'Subscriber', icon: FileText, description: 'NGO, Media, Academic' },
    { value: 'admin', label: 'Admin', icon: Shield, description: 'Government officials' }
  ]

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
      
      // Mock login based on user type
      const mockUserData = {
        citizen: {
          id: '1',
          name: 'Ahmed Ali Khan',
          email: formData.email,
          role: 'citizen',
          cnic: '42101-1234567-8',
          city: 'Karachi'
        },
        subscriber: {
          id: '2',
          name: 'Media Organization',
          email: formData.email,
          role: 'subscriber',
          subscriptionType: 'media-pro',
          organizationType: 'media'
        },
        admin: {
          id: 'admin-1',
          name: 'Admin User',
          email: formData.email,
          role: 'admin',
          department: 'FBR'
        }
      }

      const result = await login(mockUserData[formData.userType])
      
      if (result.success) {
        toast.success('Login successful!')
        
        // Redirect based on user type
        const redirectPaths = {
          citizen: '/dashboard',
          subscriber: '/subscriber/dashboard',
          admin: '/admin-dashboard'
        }
        
        router.push(redirectPaths[formData.userType])
      } else {
        toast.error('Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

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
              Welcome to{' '}
              <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                PakTaxChain
              </span>
            </h1>
            <p className="text-xl mb-6 max-w-2xl mx-auto font-light">
              Secure login to Pakistan's transparent tax system
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                <p className="text-gray-600">Choose your account type and login</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Account Type
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {userTypes.map((type) => (
                      <label key={type.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="userType"
                          value={type.value}
                          checked={formData.userType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.userType === type.value
                            ? 'border-pakistan-green bg-pakistan-green/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <type.icon className={`w-5 h-5 ${
                              formData.userType === type.value ? 'text-pakistan-green' : 'text-gray-500'
                            }`} />
                            <div>
                              <div className={`font-medium ${
                                formData.userType === type.value ? 'text-pakistan-green' : 'text-gray-900'
                              }`}>
                                {type.label}
                              </div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

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
                    href="/register" 
                    className="text-pakistan-green font-semibold hover:text-pakistan-dark transition-colors"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
