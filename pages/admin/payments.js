import React from 'react';
import { useState, useEffect } from 'react';

export default function PaymentsPage() {
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch for payments
    setTimeout(() => {
      setPaymentsList([
        { id: 1, date: '2025-01-15', amount: 25000, cnic: '12345-1234567-1', status: 'Completed' },
        { id: 2, date: '2025-01-14', amount: 15000, cnic: '23456-1234567-2', status: 'Pending' },
        { id: 3, date: '2025-01-13', amount: 45000, cnic: '34567-1234567-3', status: 'Completed' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Payments Management</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
            <ul>
              {paymentsList.map(payment => (
                <li key={payment.id} className="mb-2">
                  {payment.date} - ₨{payment.amount.toLocaleString()} - {payment.cnic} - {payment.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

