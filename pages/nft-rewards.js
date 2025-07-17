import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Crown, 
  Trophy, 
  Shield, 
  Star, 
  Medal, 
  Zap,
  Gift,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Lock,
  Sparkles
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ethers } from 'ethers'
import Link from 'next/link'

const NFT_REWARDS_ABI = [
  "function mintReward(address to, uint256 rewardType) external",
  "function getUserRewards(address user) external view returns (uint256[])",
  "function getRewardMetadata(uint256 tokenId) external view returns (string, string, uint256)"
]

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "0xYourNFTContractAddress"

const rewardTiers = [
  {
    id: 1,
    name: "First Time Taxpayer",
    description: "Welcome to Pakistan's transparent tax system!",
    icon: Gift,
    requirement: "Pay your first tax",
    rarity: "Common",
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    points: 100,
    unlocked: true
  },
  {
    id: 2,
    name: "Consistent Contributor",
    description: "Paid taxes for 3 consecutive months",
    icon: Trophy,
    requirement: "3 consecutive payments",
    rarity: "Uncommon",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    points: 300,
    unlocked: true
  },
  {
    id: 3,
    name: "City Champion",
    description: "Top 100 taxpayer in your city",
    icon: Crown,
    requirement: "Top 100 in city rankings",
    rarity: "Rare",
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    points: 500,
    unlocked: false
  },
  {
    id: 4,
    name: "Transparency Advocate",
    description: "Shared transparency data 10 times",
    icon: Shield,
    requirement: "Share data 10 times",
    rarity: "Rare",
    color: "from-indigo-400 to-indigo-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-800",
    points: 400,
    unlocked: false
  },
  {
    id: 5,
    name: "National Pride",
    description: "Top 1000 taxpayer nationwide",
    icon: Medal,
    requirement: "Top 1000 nationally",
    rarity: "Epic",
    color: "from-yellow-400 to-orange-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    points: 1000,
    unlocked: false
  },
  {
    id: 6,
    name: "Pakistan's Finest",
    description: "Top 100 taxpayer nationwide",
    icon: Star,
    requirement: "Top 100 nationally",
    rarity: "Legendary",
    color: "from-pink-400 to-red-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-800",
    points: 2000,
    unlocked: false
  }
]

const achievements = [
  {
    id: 1,
    title: "Early Adopter",
    description: "Among the first 1000 users",
    icon: Zap,
    completed: true,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Monthly Contributor",
    description: "Paid taxes every month for 6 months",
    icon: TrendingUp,
    completed: true,
    date: "2024-06-01"
  },
  {
    id: 3,
    title: "Community Leader",
    description: "Referred 10 friends to PakTaxChain",
    icon: Users,
    completed: false,
    progress: 7,
    total: 10
  },
  {
    id: 4,
    title: "Transparency Hero",
    description: "Helped expose corruption through data sharing",
    icon: Shield,
    completed: false,
    progress: 3,
    total: 5
  }
]

export default function NFTRewards() {
  const [userRewards, setUserRewards] = useState([])
  const [userPoints, setUserPoints] = useState(2850)
  const [loading, setLoading] = useState(true)
  const [minting, setMinting] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)
  const [userRank, setUserRank] = useState(247)
  const [cityRank, setCityRank] = useState(12)

  useEffect(() => {
    loadUserRewards()
  }, [])

  const loadUserRewards = async () => {
    setLoading(true)
    try {
      // Simulate loading user NFT rewards
      setTimeout(() => {
        setUserRewards([1, 2]) // User has first two rewards
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading rewards:', error)
      setLoading(false)
    }
  }

  const mintNFTReward = async (rewardId) => {
    setMinting(true)
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask to mint NFT rewards')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_REWARDS_ABI, signer)

      toast.loading('Minting your NFT reward...', { id: 'mint-nft' })
      
      const tx = await contract.mintReward(await signer.getAddress(), rewardId)
      await tx.wait()

      toast.success('NFT reward minted successfully!', { id: 'mint-nft' })
      
      // Update user rewards
      setUserRewards(prev => [...prev, rewardId])
      
    } catch (error) {
      console.error('Error minting NFT:', error)
      toast.error('Failed to mint NFT reward')
    } finally {
      setMinting(false)
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600'
      case 'Uncommon': return 'text-blue-600'
      case 'Rare': return 'text-purple-600'
      case 'Epic': return 'text-yellow-600'
      case 'Legendary': return 'text-pink-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your rewards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 shadow-xl">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12" />
              NFT Rewards
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Earn exclusive NFT badges and rewards for your contributions to Pakistan&apos;s transparency
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{userPoints.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Points</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">#{userRank}</div>
                <div className="text-sm opacity-90">National Rank</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">#{cityRank}</div>
                <div className="text-sm opacity-90">City Rank</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* NFT Rewards Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Collect NFT Badges</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn unique NFT badges for your contributions to transparency and civic duty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rewardTiers.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                  userRewards.includes(reward.id) ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {userRewards.includes(reward.id) && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}

                <div className={`bg-gradient-to-r ${reward.color} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <reward.icon className="w-12 h-12 text-white" />
                    <div className="text-right">
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${reward.bgColor} ${reward.textColor}`}>
                        {reward.rarity}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                  <p className="text-white/90 text-sm">{reward.description}</p>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Requirement:</p>
                    <p className="text-sm font-medium text-gray-800">{reward.requirement}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Reward Points:</p>
                    <p className="text-lg font-bold text-purple-600">{reward.points} points</p>
                  </div>

                  {userRewards.includes(reward.id) ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      <span>Earned</span>
                    </div>
                  ) : reward.unlocked ? (
                    <button
                      onClick={() => mintNFTReward(reward.id)}
                      disabled={minting}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        minting 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      }`}
                    >
                      {minting ? 'Minting...' : 'Mint NFT'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Lock className="w-5 h-5" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Achievements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your progress and unlock special rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <achievement.icon className={`w-6 h-6 ${
                        achievement.completed ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.completed && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                {achievement.completed ? (
                  <div className="text-sm text-green-600 font-medium">
                    Completed on {achievement.date}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{achievement.progress}/{achievement.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leaderboard Preview */}
        <section>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Top Contributors
              </h2>
              <Link href="/leaderboard" className="text-purple-600 hover:text-purple-700 font-medium">
                View Full Leaderboard →
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { rank: 1, name: "Ahmad Khan", city: "Karachi", points: 15420, nfts: 6 },
                { rank: 2, name: "Fatima Ali", city: "Lahore", points: 13890, nfts: 5 },
                { rank: 3, name: "Hassan Sheikh", city: "Islamabad", points: 12340, nfts: 4 },
                { rank: 4, name: "Ayesha Malik", city: "Rawalpindi", points: 11120, nfts: 4 },
                { rank: 5, name: "Usman Ahmed", city: "Faisalabad", points: 10890, nfts: 3 }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">{user.points.toLocaleString()} pts</div>
                    <div className="text-sm text-gray-600">{user.nfts} NFTs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
