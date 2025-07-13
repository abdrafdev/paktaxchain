import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { getPakTaxChainContract, getTaxpayerNFTContract, getProvider, getSigner, formatEther, parseEther, hashCNIC } from '../contracts'
import toast from 'react-hot-toast'

export const useContract = () => {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalTax: 0,
    totalCities: 0,
    totalTaxpayers: 0,
    topCity: 'Karachi'
  })
  const [cities, setCities] = useState([])
  const [taxpayerProfile, setTaxpayerProfile] = useState(null)

  // Get contract instances
  const getContracts = useCallback(async () => {
    try {
      const provider = getProvider()
      const signer = isConnected ? await getSigner() : provider
      
      const pakTaxChain = getPakTaxChainContract(signer)
      const taxpayerNFT = getTaxpayerNFTContract(signer)
      
      return { pakTaxChain, taxpayerNFT, provider, signer }
    } catch (error) {
      console.error('Error getting contracts:', error)
      return null
    }
  }, [isConnected])

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const contracts = await getContracts()
      if (!contracts) return

      const { pakTaxChain } = contracts

      // Get registered cities
      const registeredCities = await pakTaxChain.getRegisteredCities()
      setCities(registeredCities)

      // Get total tax collected
      const totalTaxCollected = await pakTaxChain.totalTaxCollected()
      
      // Get city stats
      const cityStats = await Promise.all(
        registeredCities.map(async (city) => {
          const stats = await pakTaxChain.getCityStats(city)
          return {
            name: city,
            totalTaxCollected: formatEther(stats.totalTaxCollected),
            taxpayerCount: stats.taxpayerCount.toString(),
            percentage: await pakTaxChain.getCityTaxPercentage(city)
          }
        })
      )

      // Find top city
      const topCity = cityStats.reduce((prev, current) => 
        parseFloat(current.totalTaxCollected) > parseFloat(prev.totalTaxCollected) ? current : prev
      )

      setStats({
        totalTax: formatEther(totalTaxCollected),
        totalCities: registeredCities.length,
        totalTaxpayers: cityStats.reduce((sum, city) => sum + parseInt(city.taxpayerCount), 0),
        topCity: topCity?.name || 'Karachi'
      })

      // Get taxpayer profile if connected
      if (isConnected && address) {
        const profile = await pakTaxChain.getTaxpayerProfile(address)
        setTaxpayerProfile({
          city: profile.city,
          totalTaxPaid: formatEther(profile.totalTaxPaid),
          paymentCount: profile.paymentCount.toString(),
          reputationScore: profile.reputationScore.toString(),
          hasNFT: profile.hasNFT
        })
      }

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load blockchain data')
    } finally {
      setLoading(false)
    }
  }, [getContracts, isConnected, address])

  // Pay tax function
  const payTax = useCallback(async (city, cnic, amount) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setLoading(true)
      const contracts = await getContracts()
      if (!contracts) return

      const { pakTaxChain } = contracts
      const hashedCNIC = hashCNIC(cnic)
      const amountInWei = parseEther(amount.toString())

      const tx = await pakTaxChain.payTax(city, hashedCNIC, { value: amountInWei })
      
      toast.loading('Processing tax payment...', { id: 'tax-payment' })
      
      await tx.wait()
      
      toast.success('Tax payment successful!', { id: 'tax-payment' })
      
      // Reload data
      await loadData()
      
      return tx
    } catch (error) {
      console.error('Error paying tax:', error)
      toast.error('Tax payment failed: ' + error.message, { id: 'tax-payment' })
    } finally {
      setLoading(false)
    }
  }, [getContracts, isConnected, loadData])

  // Get city stats
  const getCityStats = useCallback(async (city) => {
    try {
      const contracts = await getContracts()
      if (!contracts) return null

      const { pakTaxChain } = contracts
      const stats = await pakTaxChain.getCityStats(city)
      
      return {
        totalTaxCollected: formatEther(stats.totalTaxCollected),
        totalFundsAllocated: formatEther(stats.totalFundsAllocated),
        totalFundsWithdrawn: formatEther(stats.totalFundsWithdrawn),
        taxpayerCount: stats.taxpayerCount.toString(),
        isRegistered: stats.isRegistered
      }
    } catch (error) {
      console.error('Error getting city stats:', error)
      return null
    }
  }, [getContracts])

  // Allocate funds (admin only)
  const allocateFunds = useCallback(async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setLoading(true)
      const contracts = await getContracts()
      if (!contracts) return

      const { pakTaxChain } = contracts
      const tx = await pakTaxChain.allocateFunds()
      
      toast.loading('Allocating funds...', { id: 'allocate-funds' })
      
      await tx.wait()
      
      toast.success('Funds allocated successfully!', { id: 'allocate-funds' })
      
      // Reload data
      await loadData()
      
      return tx
    } catch (error) {
      console.error('Error allocating funds:', error)
      toast.error('Fund allocation failed: ' + error.message, { id: 'allocate-funds' })
    } finally {
      setLoading(false)
    }
  }, [getContracts, isConnected, loadData])

  // Load data on mount and when connection changes
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    loading,
    stats,
    cities,
    taxpayerProfile,
    payTax,
    getCityStats,
    allocateFunds,
    loadData
  }
}
