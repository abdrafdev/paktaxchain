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
