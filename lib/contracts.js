import { ethers } from 'ethers'

// Contract addresses from deployment
export const CONTRACTS = {
  PAKTAXCHAIN: process.env.NEXT_PUBLIC_PAKTAXCHAIN_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  TAXPAYER_NFT: process.env.NEXT_PUBLIC_TAXPAYER_NFT_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
}

// Network configuration
export const NETWORK_CONFIG = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337'),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545',
  name: 'Hardhat Local',
  currency: 'ETH'
}

// PakTaxChain contract ABI (simplified for demo)
export const PAKTAXCHAIN_ABI = [
  "function payTax(string memory city, string memory hashedCNIC) external payable",
  "function getCityStats(string memory city) external view returns (tuple(uint256 totalTaxCollected, uint256 totalFundsAllocated, uint256 totalFundsWithdrawn, uint256 taxpayerCount, bool isRegistered))",
  "function getTaxpayerProfile(address taxpayer) external view returns (tuple(string cnic, string city, uint256 totalTaxPaid, uint256 paymentCount, uint256 reputationScore, bool hasNFT))",
  "function getRegisteredCities() external view returns (string[] memory)",
  "function totalTaxCollected() external view returns (uint256)",
  "function getCityTaxPercentage(string memory city) external view returns (uint256)",
  "function allocateFunds() external",
  "function owner() external view returns (address)",
  "event TaxPaymentMade(address indexed taxpayer, uint256 indexed paymentId, uint256 amount, string city, uint256 timestamp)"
]

// TaxpayerNFT contract ABI
export const TAXPAYER_NFT_ABI = [
  "function mintTaxpayerNFT(address taxpayer, uint256 level) external",
  "function getTaxpayerLevel(address taxpayer) external view returns (uint256)",
  "function hasTaxpayerNFT(address taxpayer) external view returns (bool)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)"
]

// Get contract instance
export const getContract = (address, abi, signerOrProvider) => {
  return new ethers.Contract(address, abi, signerOrProvider)
}

// Get provider
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl)
}

// Get signer
export const getSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return await provider.getSigner()
  }
  throw new Error('No wallet connected')
}

// Get PakTaxChain contract instance
export const getPakTaxChainContract = (signerOrProvider) => {
  return getContract(CONTRACTS.PAKTAXCHAIN, PAKTAXCHAIN_ABI, signerOrProvider)
}

// Get TaxpayerNFT contract instance
export const getTaxpayerNFTContract = (signerOrProvider) => {
  return getContract(CONTRACTS.TAXPAYER_NFT, TAXPAYER_NFT_ABI, signerOrProvider)
}

// Format ETH values
export const formatEther = ethers.formatEther
export const parseEther = ethers.parseEther

// Hash CNIC for privacy
export const hashCNIC = (cnic) => {
  return ethers.keccak256(ethers.toUtf8Bytes(cnic))
}
