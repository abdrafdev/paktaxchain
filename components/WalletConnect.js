import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, ChevronDown, ExternalLink, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleConnect = (connector) => {
    connect({ connector })
    setIsDropdownOpen(false)
  }

  const handleDisconnect = () => {
    disconnect()
    setIsDropdownOpen(false)
    toast.success('Wallet disconnected')
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getExplorerUrl = (address) => {
    return `https://etherscan.io/address/${address}`
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 bg-white text-pakistan-green border-2 border-pakistan-green px-4 py-2 rounded-lg font-semibold hover:bg-pakistan-green hover:text-white transition-colors"
        >
          <Wallet className="w-4 h-4" />
          <span>{formatAddress(address)}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Connected Account</span>
                <button
                  onClick={copyAddress}
                  className="text-pakistan-green hover:text-pakistan-dark"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="font-mono text-sm text-gray-900 mt-1">{formatAddress(address)}</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => window.open(getExplorerUrl(address), '_blank')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Etherscan</span>
              </button>
              
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-white text-pakistan-green px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Connect Wallet</h3>
            <p className="text-sm text-gray-500 mt-1">Choose your preferred wallet to connect</p>
          </div>
          
          <div className="p-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={!connector.ready || isLoading}
                className="w-full flex items-center justify-between px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{connector.name}</span>
                </div>
                
                {isLoading && pendingConnector?.id === connector.id && (
                  <div className="w-4 h-4 border-2 border-pakistan-green border-t-transparent rounded-full animate-spin" />
                )}
                
                {!connector.ready && (
                  <span className="text-xs text-gray-400">Not Ready</span>
                )}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              New to Ethereum wallets?{' '}
              <a 
                href="https://ethereum.org/en/wallets/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pakistan-green hover:text-pakistan-dark"
              >
                Learn more
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
