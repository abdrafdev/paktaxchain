import React, { useState, useEffect } from 'react';
import { supabase, dbHelpers } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [topTaxpayers, setTopTaxpayers] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadLeaderboardData();
  }, [selectedPeriod]);

  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      // Get all tax payments
      const payments = await dbHelpers.getRecentPayments(1000);
      
      // Group by CNIC and calculate totals
      const taxpayerTotals = {};
      payments.forEach(payment => {
        if (payment.status === 'completed') {
          if (!taxpayerTotals[payment.cnic]) {
            taxpayerTotals[payment.cnic] = {
              cnic: payment.cnic,
              name: payment.users?.name || 'Anonymous',
              phone: payment.users?.phone || 'N/A',
              city: payment.city,
              totalAmount: 0,
              paymentCount: 0,
              lastPayment: null
            };
          }
          taxpayerTotals[payment.cnic].totalAmount += payment.amount_pkr;
          taxpayerTotals[payment.cnic].paymentCount += 1;
          if (!taxpayerTotals[payment.cnic].lastPayment || 
              new Date(payment.created_at) > new Date(taxpayerTotals[payment.cnic].lastPayment)) {
            taxpayerTotals[payment.cnic].lastPayment = payment.created_at;
          }
        }
      });

      // Sort by total amount and take top 20
      const sortedTaxpayers = Object.values(taxpayerTotals)
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 20);

      setTopTaxpayers(sortedTaxpayers);

      // Generate monthly stats (simulated)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const stats = months.map((month, index) => ({
        month,
        totalCollected: Math.floor(Math.random() * 50000000) + 10000000,
        totalPayments: Math.floor(Math.random() * 1000) + 500,
        avgPayment: Math.floor(Math.random() * 50000) + 20000
      }));
      setMonthlyStats(stats);

    } catch (error) {
      console.error('Error loading leaderboard data:', error);
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const getNFTLevel = (totalAmount) => {
    if (totalAmount >= 1000000) return { level: 5, name: 'Diamond', color: '#8B5CF6' };
    if (totalAmount >= 500000) return { level: 4, name: 'Platinum', color: '#6B7280' };
    if (totalAmount >= 200000) return { level: 3, name: 'Gold', color: '#F59E0B' };
    if (totalAmount >= 100000) return { level: 2, name: 'Silver', color: '#9CA3AF' };
    return { level: 1, name: 'Bronze', color: '#CD7F32' };
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Taxpayer Leaderboard</h1>
                <p className="text-gray-600">Top contributors to Pakistan's development</p>
              </div>
              <div className="flex space-x-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {topTaxpayers.slice(0, 3).map((taxpayer, index) => {
              const nftLevel = getNFTLevel(taxpayer.totalAmount);
              const rank = index + 1;
              const isTop3 = rank <= 3;
              
              return (
                <div
                  key={taxpayer.cnic}
                  className={`bg-white rounded-lg shadow-lg p-6 text-center transform transition-all hover:scale-105 ${
                    rank === 1 ? 'ring-4 ring-yellow-400' :
                    rank === 2 ? 'ring-4 ring-gray-300' :
                    rank === 3 ? 'ring-4 ring-orange-400' : ''
                  }`}
                >
                  <div className="text-4xl mb-2">{getRankIcon(rank)}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{taxpayer.name}</div>
                  <div className="text-lg font-semibold text-blue-600 mb-2">
                    PKR {taxpayer.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {taxpayer.paymentCount} payments • {taxpayer.city}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                       style={{ backgroundColor: `${nftLevel.color}20`, color: nftLevel.color }}>
                    {nftLevel.name} NFT
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Statistics */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Collection Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {monthlyStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    PKR {stat.totalCollected.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{stat.month}</div>
                  <div className="text-xs text-gray-500">
                    {stat.totalPayments} payments • Avg: PKR {stat.avgPayment.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Complete Leaderboard</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxpayer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NFT Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topTaxpayers.map((taxpayer, index) => {
                    const nftLevel = getNFTLevel(taxpayer.totalAmount);
                    const rank = index + 1;
                    
                    return (
                      <tr key={taxpayer.cnic} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg font-semibold text-gray-900 mr-2">
                              {getRankIcon(rank)}
                            </span>
                            <span className="text-sm text-gray-500">#{rank}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{taxpayer.name}</div>
                          <div className="text-sm text-gray-500">{taxpayer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-600">
                            PKR {taxpayer.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {taxpayer.paymentCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {taxpayer.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: `${nftLevel.color}20`, color: nftLevel.color }}>
                            {nftLevel.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {taxpayer.lastPayment ? 
                            new Date(taxpayer.lastPayment).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* NFT Rewards Info */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NFT Rewards System</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { level: 'Bronze', minAmount: 0, color: '#CD7F32', benefits: ['Basic NFT', 'Tax Certificate'] },
                { level: 'Silver', minAmount: 100000, color: '#9CA3AF', benefits: ['Silver NFT', 'Priority Support'] },
                { level: 'Gold', minAmount: 200000, color: '#F59E0B', benefits: ['Gold NFT', 'Exclusive Events'] },
                { level: 'Platinum', minAmount: 500000, color: '#6B7280', benefits: ['Platinum NFT', 'VIP Services'] },
                { level: 'Diamond', minAmount: 1000000, color: '#8B5CF6', benefits: ['Diamond NFT', 'Government Recognition'] }
              ].map((tier) => (
                <div key={tier.level} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold"
                       style={{ backgroundColor: tier.color }}>
                    {tier.level.charAt(0)}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{tier.level}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    PKR {tier.minAmount.toLocaleString()}+
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
