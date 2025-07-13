import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
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
  Calculator
} from 'lucide-react'
import WalletConnect from './WalletConnect'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { isConnected } = useAccount()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Tax Calculator', href: '/tax-calculator', icon: Calculator },
    { name: 'Pay Tax', href: '/pay-tax', icon: CreditCard },
    { name: 'Analytics', href: '/analytics', icon: Activity },
    { name: 'Cities', href: '/cities', icon: MapPin },
    { name: 'Leaderboard', href: '/leaderboard', icon: Award },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
    { name: 'Admin', href: '/admin', icon: Settings, requiresAuth: true },
  ]

  const isActivePath = (path) => {
    return router.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-pakistan-flag shadow-lg sticky top-0 z-50">
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
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                // Skip auth-required items if not connected
                if (item.requiresAuth && !isConnected) {
                  return null
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-white text-pakistan-green'
                        : 'text-white hover:bg-pakistan-dark'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Connect Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <WalletConnect />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white hover:text-gray-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-pakistan-dark">
                {navigation.map((item) => {
                  // Skip auth-required items if not connected
                  if (item.requiresAuth && !isConnected) {
                    return null
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-white text-pakistan-green'
                          : 'text-white hover:bg-pakistan-green'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

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
