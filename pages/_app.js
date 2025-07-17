import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import Layout from '../components/Layout'
import { AuthProvider } from '../contexts/AuthContext'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon, polygonMumbai, hardhat } from 'wagmi/chains'
import { metaMask, injected } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

// Set up wagmi config (simplified to avoid WalletConnect ESM issues)
const config = createConfig({
  chains: [hardhat, polygon, polygonMumbai, mainnet],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster position="top-right" />
          </Layout>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
