import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Receipt as ReceiptIcon } from 'lucide-react';
import { formatPKR } from '../../lib/pakistaniTaxCalculator';

export default function ReceiptPage() {
  const router = useRouter();
  const { txid } = router.query;
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (txid) {
      const data = sessionStorage.getItem('receiptData');
      if (data) {
        setReceiptData(JSON.parse(data));
      }
    }
  }, [txid]);

  if (!receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading receipt...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your tax payment receipt is below.</p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-pakistan-green">Tax Receipt</h3>
            <p className="text-sm text-gray-500">PakTaxChain - Pakistan's Transparent Tax System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Taxpayer Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {receiptData.fullName}</div>
                <div><span className="font-medium">CNIC:</span> {receiptData.cnic}</div>
                <div><span className="font-medium">City:</span> {receiptData.city}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Payment Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Amount:</span> {formatPKR(parseInt(receiptData.amount))}</div>
                <div><span className="font-medium">Tax Type:</span> {receiptData.taxType}</div>
                <div><span className="font-medium">Payment Reference:</span> {receiptData.paymentReference}</div>
                <div><span className="font-medium">Date:</span> {new Date(receiptData.paidAt).toLocaleString('en-PK')}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold text-gray-800 mb-3">Blockchain Information</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Transaction Hash:</span> <a href={`https://mumbai.polygonscan.com/tx/${receiptData.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">{receiptData.txHash}</a></div>
              <div><span className="font-medium">Network:</span> Polygon Mumbai Testnet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

