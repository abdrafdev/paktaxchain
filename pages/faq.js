import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openItems, setOpenItems] = useState(new Set())
  
  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }
  
  const faqs = [
    {
      category: 'CNIC & Registration',
      items: [
        {
          question: 'What is CNIC and why do I need it?',
          answer: 'CNIC (Computerized National Identity Card) is your Pakistani national ID card. We use it to verify your identity and ensure only Pakistani citizens can pay taxes through our platform. This prevents fraud and maintains the integrity of our system.'
        },
        {
          question: 'How does CNIC scanning work?',
          answer: 'Our system uses OCR (Optical Character Recognition) technology to scan your CNIC card. Simply upload a clear photo of your CNIC, and our system will extract your details automatically. We verify this information against our database to ensure authenticity.'
        },
        {
          question: 'What if my CNIC scan fails?',
          answer: 'If scanning fails, ensure your CNIC photo is clear, well-lit, and all text is visible. Try taking the photo on a flat surface with good lighting. If problems persist, contact our support team for manual verification.'
        },
        {
          question: 'Can I use someone else\'s CNIC?',
          answer: 'No, absolutely not. Each CNIC can only be used once for registration. Our system detects duplicate CNICs and will flag accounts for fraud. Using someone else\'s CNIC is illegal and will result in account suspension.'
        }
      ]
    },
    {
      category: 'Tax Calculations & Payments',
      items: [
        {
          question: 'What types of taxes can I pay?',
          answer: 'You can pay Income Tax, Property Tax, Business Tax, and other applicable Pakistani taxes. Our calculator helps determine the exact amount based on your income, property value, or business revenue.'
        },
        {
          question: 'How do I calculate my tax amount?',
          answer: 'Use our smart tax calculator by selecting your tax type and entering relevant information (income, property value, etc.). The system will automatically calculate your tax obligation in Pakistani Rupees (PKR) according to current tax rates.'
        },
        {
          question: 'Can I pay taxes in USD or other currencies?',
          answer: 'No, all tax payments must be made in Pakistani Rupees (PKR) only. You can pay using JazzCash, EasyPaisa, or direct bank transfer. This ensures compliance with Pakistani tax regulations.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept JazzCash, EasyPaisa, and direct bank transfers. All payments are processed in PKR. Credit card payments may be added in future updates.'
        }
      ]
    },
    {
      category: 'Blockchain & Receipts',
      items: [
        {
          question: 'Why do you use blockchain for receipts?',
          answer: 'Blockchain provides immutable, transparent records that cannot be altered or deleted. This ensures your tax payment proof is permanent and verifiable, eliminating disputes and providing complete transparency in the tax system.'
        },
        {
          question: 'What is Polygon blockchain?',
          answer: 'Polygon is a fast, low-cost blockchain network that we use to store tax receipts. It\'s environmentally friendly and provides secure, transparent record-keeping without high transaction fees.'
        },
        {
          question: 'How do I view my blockchain receipt?',
          answer: 'After payment, you\'ll receive a unique transaction ID. Use this ID to view your receipt on our platform or directly on the Polygon blockchain explorer. You can also download a PDF version for your records.'
        },
        {
          question: 'Can blockchain receipts be faked?',
          answer: 'No, blockchain receipts cannot be faked or altered. Each receipt is cryptographically secured and verified by the blockchain network. This makes fraud virtually impossible.'
        }
      ]
    },
    {
      category: 'Data & Privacy',
      items: [
        {
          question: 'How is my personal data protected?',
          answer: 'We use bank-level encryption to protect your data. Your CNIC and personal information are stored securely and never shared with third parties without your consent. We comply with all Pakistani data protection regulations.'
        },
        {
          question: 'Who can access my tax payment data?',
          answer: 'Only you can access your complete tax payment history. Government officials and verified media/NGO subscribers can access anonymized aggregate data for transparency purposes, but never your personal information.'
        },
        {
          question: 'What data do you share with NGOs and media?',
          answer: 'We share only anonymized, aggregated data like city-wise tax collection, payment trends, and regional statistics. No personal information, CNICs, or individual payment details are ever shared.'
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can request account deletion. However, blockchain receipts are permanent and cannot be deleted (this is a feature, not a bug). We can remove your personal data from our servers while preserving anonymized tax records.'
        }
      ]
    },
    {
      category: 'NFTs & Rewards',
      items: [
        {
          question: 'What are NFT rewards?',
          answer: 'NFT rewards are unique digital badges you earn for consistent tax payments. These badges represent your contribution to Pakistan\'s development and can be displayed on your profile or shared on social media.'
        },
        {
          question: 'How do I earn NFT badges?',
          answer: 'You earn NFT badges by paying taxes regularly, reaching payment milestones, and contributing to your city\'s development. Different badges are awarded for different achievements and contribution levels.'
        },
        {
          question: 'Can I sell my NFT badges?',
          answer: 'These NFT badges are non-transferable and cannot be sold. They are personal achievements tied to your tax contribution history and are meant to recognize your civic responsibility, not as financial instruments.'
        },
        {
          question: 'Do NFT badges have monetary value?',
          answer: 'No, NFT badges have no monetary value and cannot be traded. They are purely recognition tokens that represent your contribution to Pakistan\'s tax system and civic engagement.'
        }
      ]
    },
    {
      category: 'City Rankings & Transparency',
      items: [
        {
          question: 'How do city rankings work?',
          answer: 'Cities are ranked based on total tax contributions, number of active taxpayers, and per-capita tax payments. Rankings are updated in real-time and help citizens see how their city compares to others across Pakistan.'
        },
        {
          question: 'How can I see where tax money is spent?',
          answer: 'Our platform shows city-wise budget allocation and spending. You can track how much tax your city collected and how much development funding it received, promoting transparency in government spending.'
        },
        {
          question: 'What if my city receives less funding than it contributes?',
          answer: 'Our transparency tools help highlight such disparities. This data can be used by citizens, media, and NGOs to advocate for fair budget allocation and hold government accountable for equitable development spending.'
        },
        {
          question: 'Are city statistics real-time?',
          answer: 'Yes, all city statistics including tax collection, rankings, and fund allocation are updated in real-time as payments are processed and recorded on the blockchain.'
        }
      ]
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-pakistan-green via-pakistan-dark to-emerald-800 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pakistan-light opacity-10 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-light leading-relaxed">
              Everything you need to know about PakTaxChain, CNIC verification, blockchain receipts, and tax payments.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.items.map((faq, itemIndex) => {
                    const globalIndex = categoryIndex * 1000 + itemIndex
                    const isOpen = openItems.has(globalIndex)
                    
                    return (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                        className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                        >
                          <span className="text-lg font-semibold text-gray-800">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-pakistan-green" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-pakistan-green" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-4"
                          >
                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-pakistan-green to-emerald-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Can't find the answer you're looking for? Contact our support team for personalized assistance.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-pakistan-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  )
}
