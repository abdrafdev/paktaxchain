import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Star, 
  Trophy, 
  Crown, 
  Shield, 
  Target, 
  Calendar,
  TrendingUp,
  Users,
  Lock,
  CheckCircle
} from 'lucide-react';

export default function RewardsPage() {
  const [userStats, setUserStats] = useState({
    totalTaxPaid: 125000,
    paymentsCount: 8,
    currentLevel: 'Silver',
    nextLevel: 'Gold',
    progressToNext: 75,
    city: 'Karachi',
    joinDate: '2024-01-15'
  });

  const [userBadges, setUserBadges] = useState([
    { id: 1, name: 'First Payment', description: 'Made your first tax payment', icon: Trophy, earned: true, earnedDate: '2024-01-15' },
    { id: 2, name: 'On-Time Payer', description: 'Paid taxes on time for 3 months', icon: CheckCircle, earned: true, earnedDate: '2024-02-15' },
    { id: 3, name: 'Silver Citizen', description: 'Paid over PKR 100,000 in taxes', icon: Star, earned: true, earnedDate: '2024-03-01' },
    { id: 4, name: 'Monthly Contributor', description: 'Paid taxes every month for 6 months', icon: Calendar, earned: false, requiredAmount: 6 },
    { id: 5, name: 'Gold Citizen', description: 'Paid over PKR 200,000 in taxes', icon: Crown, earned: false, requiredAmount: 200000 },
    { id: 6, name: 'Top 10%', description: 'Ranked in top 10% of taxpayers', icon: TrendingUp, earned: false, requiredAmount: 10 },
    { id: 7, name: 'City Champion', description: 'Top taxpayer in your city', icon: Users, earned: false, requiredAmount: 1 },
    { id: 8, name: 'Platinum Citizen', description: 'Paid over PKR 500,000 in taxes', icon: Shield, earned: false, requiredAmount: 500000 }
  ]);

  const nftLevels = [
    { 
      name: 'Bronze', 
      minAmount: 0, 
      color: '#CD7F32', 
      description: 'Starting your tax journey',
      rewards: ['Basic NFT Certificate', 'Tax Payment History', 'Monthly Newsletter']
    },
    { 
      name: 'Silver', 
      minAmount: 100000, 
      color: '#9CA3AF', 
      description: 'Committed taxpayer',
      rewards: ['Silver NFT Badge', 'Priority Support', 'Tax Planning Guide', 'City Updates']
    },
    { 
      name: 'Gold', 
      minAmount: 200000, 
      color: '#F59E0B', 
      description: 'Dedicated contributor',
      rewards: ['Gold NFT Badge', 'VIP Support', 'Exclusive Events', 'Tax Optimization Tips']
    },
    { 
      name: 'Platinum', 
      minAmount: 500000, 
      color: '#6B7280', 
      description: 'Premium taxpayer',
      rewards: ['Platinum NFT Badge', 'Personal Tax Advisor', 'Government Meetings', 'Special Recognition']
    },
    { 
      name: 'Diamond', 
      minAmount: 1000000, 
      color: '#8B5CF6', 
      description: 'Elite contributor',
      rewards: ['Diamond NFT Badge', 'Government Recognition', 'Policy Consultation', 'Lifetime Benefits']
    }
  ];

  const getCurrentLevel = () => {
    return nftLevels.find(level => level.name === userStats.currentLevel) || nftLevels[0];
  };

  const getNextLevel = () => {
    const currentIndex = nftLevels.findIndex(level => level.name === userStats.currentLevel);
    return currentIndex < nftLevels.length - 1 ? nftLevels[currentIndex + 1] : null;
  };

  const getProgressPercentage = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    
    const progress = (userStats.totalTaxPaid - currentLevel.minAmount) / 
                    (nextLevel.minAmount - currentLevel.minAmount) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">🏆 Taxpayer Rewards</h1>
            <p className="text-xl text-blue-100 mb-8">
              Earn badges and NFTs for your contributions to Pakistan's development
            </p>
            
            {/* Current Level Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <div className="text-center">
                <div 
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: getCurrentLevel().color }}
                >
                  {getCurrentLevel().name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold mb-2">{getCurrentLevel().name} Level</h3>
                <p className="text-blue-100 mb-4">{getCurrentLevel().description}</p>
                
                {/* Progress Bar */}
                {getNextLevel() && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress to {getNextLevel().name}</span>
                      <span>{Math.round(getProgressPercentage())}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-100 mt-2">
                      {getNextLevel().minAmount - userStats.totalTaxPaid > 0 
                        ? `PKR ${(getNextLevel().minAmount - userStats.totalTaxPaid).toLocaleString()} to next level`
                        : 'Level unlocked!'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">PKR {userStats.totalTaxPaid.toLocaleString()}</h3>
            <p className="text-gray-600">Total Tax Paid</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <Target className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">{userStats.paymentsCount}</h3>
            <p className="text-gray-600">Payments Made</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <Award className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">{userBadges.filter(b => b.earned).length}</h3>
            <p className="text-gray-600">Badges Earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <Crown className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">{userStats.currentLevel}</h3>
            <p className="text-gray-600">Current Level</p>
          </motion.div>
        </div>

        {/* Badges Collection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Badge Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 ${
                  badge.earned 
                    ? 'border-2 border-green-200 hover:shadow-xl' 
                    : 'border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className="relative mb-4">
                  <badge.icon 
                    className={`w-16 h-16 mx-auto ${
                      badge.earned ? 'text-green-500' : 'text-gray-400'
                    }`} 
                  />
                  {badge.earned && (
                    <CheckCircle className="w-6 h-6 text-green-500 absolute -top-2 -right-2" />
                  )}
                  {!badge.earned && (
                    <Lock className="w-6 h-6 text-gray-400 absolute -top-2 -right-2" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                {badge.earned ? (
                  <p className="text-xs text-green-600 font-medium">
                    Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {typeof badge.requiredAmount === 'number' && badge.requiredAmount > 1000 
                      ? `Pay PKR ${badge.requiredAmount.toLocaleString()} to unlock`
                      : `Requirement: ${badge.requiredAmount}`
                    }
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* NFT Level System */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">NFT Level System</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {nftLevels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 ${
                  level.name === userStats.currentLevel
                    ? 'ring-4 ring-blue-400 transform scale-105'
                    : userStats.totalTaxPaid >= level.minAmount
                    ? 'border-2 border-green-200'
                    : 'border-2 border-gray-200 opacity-60'
                }`}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: level.color }}
                >
                  {level.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{level.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                <p className="text-sm font-medium text-gray-700 mb-4">
                  PKR {level.minAmount.toLocaleString()}+
                </p>
                <div className="space-y-1">
                  {level.rewards.map((reward, i) => (
                    <div key={i} className="flex items-center text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      <span>{reward}</span>
                    </div>
                  ))}
                </div>
                {userStats.totalTaxPaid >= level.minAmount && (
                  <div className="mt-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Unlocked
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* How to Earn More */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">How to Earn More Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Regular Payments</h3>
              <p className="text-gray-600">Make consistent monthly tax payments to unlock streak badges</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Increase Contributions</h3>
              <p className="text-gray-600">Pay higher amounts to reach new NFT levels and unlock rewards</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">City Leadership</h3>
              <p className="text-gray-600">Become a top taxpayer in your city to earn special recognition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
