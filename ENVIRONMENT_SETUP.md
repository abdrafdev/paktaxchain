# PakTaxChain Environment Variables Setup

## Overview
This guide explains the environment variables needed for PakTaxChain to function properly.

## Current Environment Variables

### ✅ Required (Already Set)
```env
# Local Development Environment Variables
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_PAKTAXCHAIN_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_TAXPAYER_NFT_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NODE_ENV=development
```

### ⚠️ Optional (Will Enhance Functionality)
```env
# WalletConnect Project ID (For real wallet connections)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here

# Supabase Configuration (For real database storage)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## What Each Variable Does

### 1. `NEXT_PUBLIC_CHAIN_ID`
- **Purpose**: Defines the blockchain network ID
- **Current Value**: `31337` (Hardhat local network)
- **Production**: Change to mainnet/testnet ID when deploying

### 2. `NEXT_PUBLIC_PAKTAXCHAIN_CONTRACT_ADDRESS`
- **Purpose**: Main PakTaxChain smart contract address
- **Current Value**: Local Hardhat deployment address
- **Production**: Update after mainnet deployment

### 3. `NEXT_PUBLIC_TAXPAYER_NFT_CONTRACT_ADDRESS`
- **Purpose**: Taxpayer NFT contract address
- **Current Value**: Local Hardhat deployment address
- **Production**: Update after mainnet deployment

### 4. `NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS`
- **Purpose**: Tax logging contract address (for analytics)
- **Current Value**: Local Hardhat deployment address
- **Production**: Update after mainnet deployment

### 5. `NEXT_PUBLIC_RPC_URL`
- **Purpose**: Blockchain RPC endpoint
- **Current Value**: Local Hardhat node
- **Production**: Use Alchemy, Infura, or other provider

### 6. `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- **Purpose**: Enables WalletConnect for mobile wallets
- **How to Get**: 
  1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
  2. Create a free account
  3. Create a new project
  4. Copy the Project ID

### 7. `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Purpose**: Enable real database storage for user data
- **How to Get**:
  1. Go to [Supabase](https://supabase.com/)
  2. Create a free account
  3. Create a new project
  4. Go to Settings → API
  5. Copy the URL and anon key

## Current App Status

### ✅ Working Features (Without Optional Keys)
- Tax calculator
- Analytics dashboard (demo data)
- City comparisons
- Leaderboard
- All UI components
- Basic wallet connection

### 🚀 Enhanced Features (With Optional Keys)
- Real wallet connections via WalletConnect
- Persistent user data storage
- Real-time updates
- Cross-device sync

## Next Steps

### For Local Development
Your app is **fully functional** with current setup! No additional keys needed.

### For Production Deployment
1. **Get WalletConnect Project ID** (5 minutes)
   - Improves wallet connection reliability
   - Enables mobile wallet support

2. **Set up Supabase** (10 minutes)
   - Enables real user data storage
   - Allows user preferences and history

3. **Deploy Smart Contracts** (Advanced)
   - Deploy to testnet/mainnet
   - Update contract addresses

## Environment Files

### `.env.local` (Current)
```env
# Local Development Environment Variables
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_PAKTAXCHAIN_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_TAXPAYER_NFT_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# WalletConnect Project ID (OPTIONAL)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here

# Supabase Configuration (OPTIONAL)
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Development mode
NODE_ENV=development
```

### `.env.production` (For Production)
```env
# Production Environment Variables
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_PAKTAXCHAIN_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_TAXPAYER_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/your-key

# Required for production
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-key

NODE_ENV=production
```

## Troubleshooting

### Analytics Page Not Loading
- ✅ **Fixed**: Added `NEXT_PUBLIC_PAK_TAX_LOG_ADDRESS` to environment
- ✅ **Fixed**: Removed problematic import
- ✅ **Fixed**: Added proper loading states

### Wallet Connection Issues
- Add WalletConnect Project ID for better reliability
- Ensure RPC URL is accessible

### Data Not Persisting
- Add Supabase credentials for real database storage
- Currently using demo data (works fine for testing)

## Support

The app is designed to work perfectly with demo data even without optional API keys. All core features are functional with the current environment setup.

For questions or issues, check:
1. Environment variables are correctly set
2. Development server is running (`npm run dev`)
3. No console errors in browser
