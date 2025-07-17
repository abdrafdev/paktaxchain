import { NextApiRequest, NextApiResponse } from 'next'
import { hashCNIC, formatPKR } from '../../lib/pakistaniTaxCalculator'
import { ethers } from 'ethers'
import { getPakTaxChainContract, getProvider, parseEther, CONTRACTS } from '../../lib/contracts'

// Mock PKR payment processing function
function processPKRPayment({ amount, cnic, city, taxType, paymentMethod, reference }) {
  // Simulate processing payment via JazzCash/EasyPaisa/Bank
  // In reality, call respective APIs and confirm transactions
  return {
    success: true,
    transactionId: `TXN-${Date.now()}`,
    amount,
    cnic: hashCNIC(cnic),
    city,
    taxType,
    paymentMethod,
    reference,
    timestamp: Date.now()
  }
}

// Record payment on blockchain
async function recordPaymentOnBlockchain(payment, amountInEth) {
  try {
    // Get provider and signer
    const provider = getProvider()
    
    // For server-side operations, you'd need a private key
    // In production, use a secure key management service
    const privateKey = process.env.ADMIN_PRIVATE_KEY
    if (!privateKey) {
      console.warn('No admin private key configured, skipping blockchain logging')
      return {
        success: false,
        transactionHash: null,
        message: 'Blockchain logging not configured'
      }
    }
    
    const wallet = new ethers.Wallet(privateKey, provider)
    const contract = getPakTaxChainContract(wallet)
    
    // Hash the CNIC for privacy
    const hashedCNIC = ethers.keccak256(ethers.toUtf8Bytes(payment.cnic))
    
    // Convert amount to wei for blockchain transaction
    const amountInWei = parseEther(amountInEth.toString())
    
    // Call the payTax function on the smart contract
    const tx = await contract.payTax(
      payment.city,
      hashedCNIC,
      {
        value: amountInWei,
        gasLimit: 500000 // Set appropriate gas limit
      }
    )
    
    // Wait for transaction confirmation
    const receipt = await tx.wait()
    
    console.log(`Blockchain transaction successful: ${receipt.hash}`)
    
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      contractAddress: CONTRACTS.PAKTAXCHAIN
    }
  } catch (error) {
    console.error('Error recording payment on blockchain:', error)
    return {
      success: false,
      transactionHash: null,
      error: error.message
    }
  }
}

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, cnic, city, taxType, paymentMethod, reference } = req.body

    // Validate required fields
    if (!amount || !cnic || !city || !taxType || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      })
    }

    try {
      // Process PKR payment first
      const payment = processPKRPayment({ amount, cnic, city, taxType, paymentMethod, reference })

      if (payment.success) {
        console.log(`Payment successful: ${formatPKR(amount)} for CNIC ${cnic} in ${city}`)
        
        // Log payment to blockchain
        // Convert PKR to ETH for blockchain (simplified conversion)
        // In production, use real exchange rates
        const ethAmount = parseFloat(amount) / 5000000 // Rough PKR to ETH conversion
        
        const blockchainResult = await recordPaymentOnBlockchain(payment, ethAmount)
        
        // Return payment result with blockchain info
        res.status(200).json({ 
          success: true, 
          payment,
          blockchain: blockchainResult
        })
      } else {
        res.status(500).json({ success: false, message: 'Payment failed' })
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      res.status(500).json({ 
        success: false, 
        message: 'Payment processing failed',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
