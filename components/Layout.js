import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Users,
  MapPin,
  Award,
  Activity,
  Calculator,
  UserPlus,
  User,
  Bell,
  LogOut,
  FileText,
  Shield,
  Database,
  AlertTriangle,
  Download,
  Building,
  GraduationCap,
  ChevronDown,
  HelpCircle,
  Phone,
  BookOpen,
  TrendingUp,
  Eye,
  Hash,
  Gift,
  History,
  CreditCard as BillingIcon,
  Key,
  Plus
} from 'lucide-react'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, userRole, logout } = useAuth()
  
  // Mock user data - replace with actual auth context
  const mockUser = {
    name: 'Ahmed Ali Khan',
    email: 'ahmed@example.com',
    avatar: null,
    notifications: 3
  }

  // Navigation configs for different user roles
  const getNavigation = () => {
    if (!isAuthenticated) {
      // For Logged-Out Visitors (Public Users)
      return [
        { name: 'Home', href: '/', icon: Home },
        { name: 'How It Works', href: '/about', icon: BookOpen },
        { name: 'Cities', href: '/cities', icon: MapPin },
        { name: 'Leaderboard', href: '/leaderboard', icon: Award },
        { name: 'FAQs', href: '/faq', icon: HelpCircle },
        { name: 'Contact', href: '/contact', icon: Phone },
      ]
    }

    if (userRole === 'admin') {
      // For Admin Users Only
      return [
        { name: 'Admin Panel', href: '/admin-dashboard', icon: Settings },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle },
        { name: 'Export', href: '/admin/export', icon: Download },
      ]
    }

    if (userRole === 'subscriber') {
      // For Subscriber Accounts (Media / NGO / Govt)
      return [
        { name: 'Dashboard', href: '/subscriber/dashboard', icon: BarChart3 },
        { name: 'City Insights', href: '/subscriber/city-insights', icon: TrendingUp },
        { name: 'Fraud Log', href: '/subscriber/fraud-log', icon: Shield },
        { name: 'API Docs', href: '/subscriber/api-docs', icon: Database },
      ]
    }

    // For Logged-In Citizen Users
    return [
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
      { name: 'Pay Tax', href: '/calculator', icon: Calculator },
      { name: 'Rewards', href: '/rewards', icon: Gift },
      { name: 'Leaderboard', href: '/leaderboard', icon: Award },
      { name: 'Cities', href: '/cities', icon: MapPin },
      { name: 'Blockchain Log', href: '/blockchain-log', icon: Hash },
    ]
  }

  const getProfileDropdown = () => {
    if (userRole === 'admin') {
      return [
        { name: 'Admin Profile', href: '/admin/profile', icon: User },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    }

    if (userRole === 'subscriber') {
      return [
        { name: 'My Access', href: '/subscriber/profile', icon: Key },
        { name: 'Subscription Plan', href: '/subscriber/billing', icon: BillingIcon },
        { name: 'Settings', href: '/subscriber/settings', icon: Settings },
      ]
    }

    // For citizens
    return [
      { name: 'My Profile', href: '/profile', icon: User },
      { name: 'Tax History', href: '/dashboard#history', icon: History },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }

  // Mobile navigation (key pages only)
  const getMobileNavigation = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Cities', href: '/cities', icon: MapPin },
        { name: 'Leaderboard', href: '/leaderboard', icon: Award },
      ]
    }

    if (userRole === 'citizen') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Pay Tax', href: '/calculator', icon: Calculator },
        { name: 'Rewards', href: '/rewards', icon: Gift },
      ]
    }

    return getNavigation().slice(0, 3)
  }

  const isActivePath = (path) => {
    return router.pathname === path || router.pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-pakistan-green via-pakistan-dark to-emerald-800 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-pakistan-green font-bold text-lg">P</span>
              </div>
              <span className="text-white font-bold text-xl">PakTaxChain</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {getNavigation().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.href)
                      ? 'bg-white text-pakistan-green'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Get Data Access CTA for non-subscribers */}
              {!isAuthenticated && (
                <Link
                  href="/data-access"
                  className="hidden md:flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/20"
                >
                  <Database className="w-4 h-4" />
                  <span>Get Data Access</span>
                </Link>
              )}

              {/* Auth buttons for logged out users */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-pakistan-green hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Notifications for authenticated users */}
                  <Link
                    href={userRole === 'citizen' ? '/dashboard#alerts' : '/notifications'}
                    className="relative text-white hover:text-gray-200 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {mockUser.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {mockUser.notifications}
                      </span>
                    )}
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-pakistan-green" />
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                          <p className="text-xs text-gray-500">{mockUser.email}</p>
                        </div>
                        {getProfileDropdown().map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-pakistan-dark/50">
                {getMobileNavigation().map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-white text-pakistan-green'
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {/* Mobile auth buttons */}
                {!isAuthenticated && (
                  <div className="pt-2 border-t border-white/20">
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/20 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-2 px-3 py-2 bg-white text-pakistan-green rounded-md mt-2 font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Floating Pay Tax CTA for mobile (citizens only) */}
      {isAuthenticated && userRole === 'citizen' && (
        <div className="fixed bottom-20 right-4 lg:hidden z-40">
          <Link
            href="/calculator"
            className="bg-gradient-to-r from-pakistan-green to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Calculator className="w-6 h-6" />
            <span className="font-semibold">Pay Tax</span>
          </Link>
        </div>
      )}

      {/* Bottom Navigation for Mobile (citizens only) */}
      {isAuthenticated && userRole === 'citizen' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
          <div className="grid grid-cols-3 gap-1">
            <Link
              href="/dashboard"
              className={`flex flex-col items-center py-2 px-1 ${
                isActivePath('/dashboard') ? 'text-pakistan-green' : 'text-gray-600'
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-medium">Dashboard</span>
            </Link>
            <Link
              href="/profile"
              className={`flex flex-col items-center py-2 px-1 ${
                isActivePath('/profile') ? 'text-pakistan-green' : 'text-gray-600'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
            <Link
              href="/dashboard#alerts"
              className={`flex flex-col items-center py-2 px-1 relative ${
                router.asPath.includes('#alerts') ? 'text-pakistan-green' : 'text-gray-600'
              }`}
            >
              <Bell className="w-6 h-6" />
              {mockUser.notifications > 0 && (
                <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {mockUser.notifications}
                </span>
              )}
              <span className="text-xs font-medium">Notifications</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About PakTaxChain</h3>
              <p className="text-gray-300 text-sm">
                Pakistan&apos;s first blockchain-based transparent tax system,
                bringing accountability and fairness to public finance.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="text-gray-300 hover:text-white">Documentation</Link></li>
                <li><Link href="/api" className="text-gray-300 hover:text-white">API</Link></li>
                <li><Link href="/whitepaper" className="text-gray-300 hover:text-white">Whitepaper</Link></li>
                <li><Link href="/github" className="text-gray-300 hover:text-white">GitHub</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="text-gray-300 hover:text-white">Security</Link></li>
                <li><Link href="/compliance" className="text-gray-300 hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 PakTaxChain. All rights reserved. Built with ❤️ for Pakistan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
