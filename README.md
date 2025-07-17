# PakTaxChain - Pakistan's Transparent Tax System

A blockchain-based transparent tax collection and allocation system for Pakistan built with Next.js, Ethereum smart contracts, and modern web technologies.

## 🚀 Features

- **Blockchain Transparency**: All tax payments and fund allocations recorded on Ethereum blockchain
- **Multiple Payment Methods**: Support for JazzCash, EasyPaisa, Bank Transfer, and 1Link
- **Real-time Analytics**: Live dashboard showing tax collection and fund allocation by city
- **NFT Rewards**: Taxpayer NFTs for consistent contributors
- **Pakistani Tax Calculator**: Built-in tax calculator for Pakistani tax laws
- **Multi-city Support**: Support for all major Pakistani cities
- **Admin Dashboard**: Fund allocation and management tools
- **Leaderboard**: Gamified tax payment system

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Blockchain**: Ethereum, Solidity, Hardhat
- **Database**: Supabase (PostgreSQL)
- **Wallet Integration**: Wagmi, Ethers.js
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Authentication**: Wallet-based authentication

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/paktaxchain.git
   cd paktaxchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID
   - `PRIVATE_KEY`: Your wallet private key for deployment
   - `SEPOLIA_URL`: Ethereum Sepolia testnet RPC URL
   - `POLYGON_URL`: Polygon mainnet RPC URL
   - `MUMBAI_URL`: Polygon Mumbai testnet RPC URL

4. **Set up Supabase Database**
   Create the following tables in your Supabase project:
   
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     cnic VARCHAR(15) UNIQUE NOT NULL,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(255),
     phone VARCHAR(20),
     city VARCHAR(50),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Tax payments table
   CREATE TABLE tax_payments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     cnic VARCHAR(15) NOT NULL REFERENCES users(cnic),
     amount_pkr INTEGER NOT NULL,
     tax_type VARCHAR(50) NOT NULL,
     payment_method VARCHAR(50) NOT NULL,
     payment_reference VARCHAR(100),
     blockchain_tx_hash VARCHAR(66),
     status VARCHAR(20) DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- OTP codes table
   CREATE TABLE otp_codes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     phone VARCHAR(20) NOT NULL,
     otp VARCHAR(6) NOT NULL,
     expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
     used BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## 🔧 Development

1. **Start Hardhat local network**
   ```bash
   npm run node
   ```

2. **Deploy smart contracts**
   ```bash
   npm run deploy
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🏗️ Smart Contracts

### PakTaxChain Contract
- **Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (local)
- **Features**:
  - Tax payment recording
  - City-based fund allocation
  - Taxpayer profiles
  - Fund withdrawal management
  - Emergency functions

### TaxpayerNFT Contract
- **Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (local)
- **Features**:
  - NFT minting for taxpayers
  - Level-based NFT upgrades
  - Metadata management

## 🎯 Usage

### For Taxpayers
1. **Register**: Complete CNIC registration
2. **Calculate Tax**: Use the built-in tax calculator
3. **Pay Tax**: Choose payment method and complete payment
4. **Track Progress**: View payment history and NFT rewards

### For Administrators
1. **Monitor Collections**: View real-time tax collection data
2. **Allocate Funds**: Distribute collected taxes to cities
3. **Manage Cities**: Add new cities or update existing ones
4. **Generate Reports**: Export data for analysis

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Smart Contracts (Polygon)
1. Update `hardhat.config.js` with Polygon network settings
2. Deploy to Polygon Mumbai testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```
3. Update contract addresses in `.env.local`

## 🔐 Security Features

- **CNIC Hashing**: Personal data is hashed before storing on blockchain
- **Wallet Authentication**: Secure wallet-based authentication
- **Reentrancy Protection**: Smart contracts protected against reentrancy attacks
- **Access Control**: Role-based access control for admin functions
- **Pausable Contracts**: Emergency pause functionality

## 📊 Analytics Dashboard

The analytics dashboard provides:
- Real-time tax collection by city
- Fund allocation charts
- Taxpayer leaderboard
- City-wise statistics
- Historical data analysis

## 🎖️ NFT Rewards System

Taxpayers earn NFTs based on their contribution levels:
- **Bronze**: Starting level
- **Silver**: PKR 100,000+ contributed
- **Gold**: PKR 200,000+ contributed
- **Platinum**: PKR 500,000+ contributed
- **Diamond**: PKR 1,000,000+ contributed

## 🌍 Supported Cities

- Karachi
- Lahore
- Islamabad
- Rawalpindi
- Faisalabad
- Multan
- Peshawar
- Quetta
- Sialkot
- Gujranwala
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@paktaxchain.com or join our Telegram channel.

## 🚨 Known Issues

1. **Supabase Configuration**: Ensure all environment variables are properly set
2. **Wallet Connection**: Some wallets may require manual network switching
3. **Mobile Responsive**: Some components may need optimization for mobile devices

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic tax payment functionality
- Smart contract deployment
- Analytics dashboard
- NFT rewards system

## 🛠️ Development Status

- ✅ Smart Contracts
- ✅ Frontend UI
- ✅ Database Integration
- ✅ Wallet Integration
- ✅ Analytics Dashboard
- ⚠️ Supabase Integration (requires setup)
- ⚠️ Production Deployment (needs API keys)
- ❌ Mobile App (future release)

---

**Built with ❤️ for Pakistan 🇵🇰**

# 🇵🇰 PakTaxChain - Pakistan's Transparent Tax System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.0-black.svg)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.19-blue.svg)](https://docs.soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.17.0-orange.svg)](https://hardhat.org/)

## 🎯 Vision

PakTaxChain is Pakistan's first blockchain-based transparent tax system that revolutionizes how citizens pay taxes and track government fund allocation. Built on the principles of **transparency**, **accountability**, and **fairness**.

## 🔍 Problem Statement

Pakistan's current tax system suffers from:
- **Lack of Transparency**: Citizens don't know where their tax money goes
- **Corruption**: Funds are misallocated and mismanaged
- **Unfair Distribution**: Cities like Karachi pay more but receive less
- **Low Trust**: Citizens lose faith in the system
- **No Incentives**: No motivation for honest tax payment

## 💡 Solution

PakTaxChain solves these problems by providing:
- **Blockchain Transparency**: All transactions are publicly verifiable
- **Smart Contracts**: Automated fair fund allocation
- **Real-time Tracking**: Citizens can track their contributions
- **Incentive System**: NFT rewards for honest taxpayers
- **Public Dashboard**: Live analytics and insights

## 🚀 Features

### ✅ Core Features
- **Transparent Tax Payment**: Pay taxes directly on blockchain
- **Real-time Analytics**: Live dashboards and visualizations
- **Smart Fund Allocation**: Automatic distribution based on contributions
- **NFT Rewards**: Gamified system for honest taxpayers
- **City Comparison**: Compare tax contributions across cities
- **Public Leaderboard**: Recognize top contributing cities
- **Mobile Responsive**: Works on all devices

### 🔧 Technical Features
- **EVM Compatible**: Works on Ethereum and Polygon
- **IPFS Integration**: Decentralized metadata storage
- **Wallet Integration**: MetaMask, WalletConnect support
- **Progressive Web App**: Install as mobile app
- **Multi-language**: English and Urdu support

## 🏗️ Architecture

```
PakTaxChain/
├── contracts/           # Smart contracts
│   ├── PakTaxChain.sol     # Main tax contract
│   └── TaxpayerNFT.sol     # NFT rewards contract
├── scripts/             # Deployment scripts
├── test/               # Contract tests
├── pages/              # Next.js pages
├── components/         # React components
├── lib/               # Utility libraries
└── styles/            # CSS styles
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Recharts**: Data visualization
- **React Leaflet**: Maps

### Blockchain
- **Solidity**: Smart contracts
- **Hardhat**: Development environment
- **OpenZeppelin**: Security standards
- **Ethers.js**: Blockchain interaction

### Infrastructure
- **Vercel**: Hosting
- **Supabase**: Database
- **IPFS**: Decentralized storage
- **Alchemy**: Blockchain API

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MetaMask wallet
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/PakTaxChain.git
cd PakTaxChain
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start local blockchain**
```bash
npm run node
```

5. **Deploy contracts**
```bash
npm run compile
npm run deploy
```

6. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Environment Setup

Create a `.env` file with the following variables:

```bash
# Blockchain Networks
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY

# Private Keys (Keep secure!)
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key

# WalletConnect
WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🎨 Usage

### For Citizens
1. **Connect Wallet**: Connect your MetaMask wallet
2. **Pay Tax**: Enter CNIC, select city, and pay tax
3. **Track Contributions**: View your tax history and city stats
4. **Earn Rewards**: Get NFTs for consistent payments
5. **Monitor Impact**: See how your city uses allocated funds

### For Government
1. **Admin Dashboard**: View all tax collections and analytics
2. **Allocate Funds**: Trigger smart contract fund allocation
3. **Withdraw Funds**: Withdraw allocated funds for development
4. **Monitor Cities**: Track performance across all cities

## 🔐 Security

- **Audit**: Smart contracts follow OpenZeppelin standards
- **Privacy**: Personal data is hashed and encrypted
- **Transparency**: All transactions are publicly verifiable
- **Immutability**: Data cannot be altered once recorded

## 📊 Smart Contract Details

### PakTaxChain.sol
- **Tax Payment**: Accept and record tax payments
- **Fund Allocation**: Automatically distribute funds based on contribution
- **City Management**: Register and manage cities
- **Statistics**: Provide real-time analytics

### TaxpayerNFT.sol
- **NFT Rewards**: Mint NFTs for honest taxpayers
- **Levels**: Bronze, Silver, Gold, Platinum, Diamond
- **Metadata**: IPFS-based metadata storage

## 🌐 Deployment

### Testnets
- **Polygon Mumbai**: For testing
- **Ethereum Sepolia**: For testing

### Mainnet
- **Polygon**: Production deployment
- **Ethereum**: Alternative deployment

## 📈 Roadmap

### Phase 1: MVP (Current)
- ✅ Basic tax payment system
- ✅ Smart contract deployment
- ✅ Frontend interface
- ✅ Analytics dashboard

### Phase 2: Enhancement
- 🔄 Mobile app (React Native)
- 🔄 Government integration
- 🔄 Advanced analytics
- 🔄 Multi-language support

### Phase 3: Scale
- 🔄 National rollout
- 🔄 API for third parties
- 🔄 Advanced governance
- 🔄 Cross-chain support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pakistani Citizens**: For inspiring this project
- **Blockchain Community**: For technical guidance
- **OpenZeppelin**: For security standards
- **Ethereum Foundation**: For the technology

## 📞 Contact

- **Email**: contact@paktaxchain.com
- **Twitter**: [@PakTaxChain](https://twitter.com/PakTaxChain)
- **Discord**: [Join our community](https://discord.gg/paktaxchain)
- **Website**: [paktaxchain.com](https://paktaxchain.com)

## 🔗 Links

- [Live Demo](https://paktaxchain.vercel.app)
- [Documentation](https://docs.paktaxchain.com)
- [Whitepaper](https://whitepaper.paktaxchain.com)
- [API Documentation](https://api.paktaxchain.com)

---

**Built with ❤️ for Pakistan 🇵🇰**

*"Transparency is the first step toward accountability, and accountability is the foundation of good governance."*
