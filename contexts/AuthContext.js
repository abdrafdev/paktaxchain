import { createContext, useContext, useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock user data - in a real app, this would come from your backend
  const mockUser = {
    id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    cnic: '42101-1234567-8',
    city: 'Karachi',
    address: address,
    verified: true,
    registrationDate: new Date().toISOString(),
    totalTaxPaid: 25000,
    lastPayment: new Date().toISOString(),
    role: 'citizen' // citizen | admin | subscriber
  }

  // Function to determine user role based on user data
  const getUserRole = (userData) => {
    if (!userData) return null
    
    // Check if user is admin (based on email domain or specific IDs)
    if (userData.email?.endsWith('@admin.paktaxchain.com') || userData.id === 'admin-1') {
      return 'admin'
    }
    
    // Check if user is subscriber (based on subscription status)
    if (userData.subscriptionType || userData.organizationType) {
      return 'subscriber'
    }
    
    // Default to citizen
    return 'citizen'
  }

  useEffect(() => {
    setIsLoading(true)
    
    if (isConnected && address) {
      // In a real app, you would fetch user data from your backend using the wallet address
      // For now, we'll use mock data
      setUser(mockUser)
    } else {
      setUser(null)
    }
    
    setIsLoading(false)
  }, [isConnected, address])

  const login = async (userData) => {
    try {
      setIsLoading(true)
      // In a real app, you would authenticate with your backend
      // For now, we'll just set the user data
      setUser(userData || mockUser)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      // Disconnect wallet
      disconnect()
      // Clear user data
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setIsLoading(true)
      // In a real app, you would register with your backend
      const newUser = {
        ...mockUser,
        ...userData,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString(),
        totalTaxPaid: 0,
        lastPayment: null
      }
      setUser(newUser)
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updates) => {
    if (user) {
      setUser(prev => ({ ...prev, ...updates }))
    }
  }

  const value = {
    user,
    isAuthenticated: isConnected && !!user,
    userRole: getUserRole(user),
    isLoading,
    login,
    logout,
    register,
    updateUser,
    // Wallet-related data
    address,
    isConnected
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
