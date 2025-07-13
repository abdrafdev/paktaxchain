import { useState } from 'react'
import { ExternalLink, ArrowUpRight } from 'lucide-react'

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      hash: '0x1234...5678',
      city: 'Karachi',
      amount: '0.05 ETH',
      timestamp: '2 minutes ago',
      status: 'confirmed'
    },
    {
      id: 2,
      hash: '0x9876...5432',
      city: 'Lahore',
      amount: '0.03 ETH',
      timestamp: '5 minutes ago',
      status: 'confirmed'
    },
    {
      id: 3,
      hash: '0x5555...1111',
      city: 'Islamabad',
      amount: '0.02 ETH',
      timestamp: '8 minutes ago',
      status: 'confirmed'
    },
    {
      id: 4,
      hash: '0x7777...3333',
      city: 'Rawalpindi',
      amount: '0.01 ETH',
      timestamp: '12 minutes ago',
      status: 'confirmed'
    },
    {
      id: 5,
      hash: '0x9999...7777',
      city: 'Faisalabad',
      amount: '0.025 ETH',
      timestamp: '15 minutes ago',
      status: 'confirmed'
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg animate-fadeIn">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Tax Payments</h3>
        <p className="text-sm text-gray-500">Latest transactions on PakTaxChain</p>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {tx.hash}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tx.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tx.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-pakistan-green hover:text-pakistan-dark flex items-center space-x-1">
                    <ExternalLink className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 text-center">
        <button className="text-pakistan-green hover:text-pakistan-dark font-medium text-sm flex items-center justify-center space-x-1 mx-auto">
          <span>View All Transactions</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
