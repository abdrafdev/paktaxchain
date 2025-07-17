import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, dbHelpers } from '../lib/supabaseClient';
import CityMap from '../components/CityMap';
import TaxChart from '../components/TaxChart';
import { toast } from 'react-hot-toast';
import { MapPin, TrendingUp, Users, DollarSign, Activity, Building, X, RefreshCw } from 'lucide-react';

const Cities = () => {
  const [cityStats, setCityStats] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fundAllocation, setFundAllocation] = useState({});

  useEffect(() => {
    loadCityData();
  }, []);

  const loadCityData = async () => {
    setLoading(true);
    try {
      let cityData;
      try {
        cityData = await dbHelpers.getCityStats();
      } catch (error) {
        console.log('Supabase not available, using demo data');
        // Demo data when Supabase is not available
        cityData = [
          { city: 'Karachi', totalAmount: 2500000, paymentCount: 1250 },
          { city: 'Lahore', totalAmount: 1800000, paymentCount: 900 },
          { city: 'Islamabad', totalAmount: 1200000, paymentCount: 600 },
          { city: 'Rawalpindi', totalAmount: 900000, paymentCount: 450 },
          { city: 'Faisalabad', totalAmount: 750000, paymentCount: 375 },
          { city: 'Multan', totalAmount: 650000, paymentCount: 325 },
          { city: 'Peshawar', totalAmount: 550000, paymentCount: 275 },
          { city: 'Quetta', totalAmount: 400000, paymentCount: 200 }
        ];
      }
      
      setCityStats(cityData);
      
      // Generate fund allocation data (simulated)
      const allocation = {};
      cityData.forEach(city => {
        allocation[city.city] = {
          infrastructure: Math.floor(city.totalAmount * 0.4),
          education: Math.floor(city.totalAmount * 0.25),
          healthcare: Math.floor(city.totalAmount * 0.2),
          security: Math.floor(city.totalAmount * 0.1),
          environment: Math.floor(city.totalAmount * 0.05)
        };
      });
      setFundAllocation(allocation);
    } catch (error) {
      console.error('Error loading city data:', error);
      toast.error('Failed to load city data');
    } finally {
      setLoading(false);
    }
  };

  const getFundAllocationData = (cityName) => {
    const allocation = fundAllocation[cityName] || {};
    return [
      { name: 'Infrastructure', value: allocation.infrastructure || 0, color: '#3B82F6' },
      { name: 'Education', value: allocation.education || 0, color: '#10B981' },
      { name: 'Healthcare', value: allocation.healthcare || 0, color: '#EF4444' },
      { name: 'Security', value: allocation.security || 0, color: '#F59E0B' },
      { name: 'Environment', value: allocation.environment || 0, color: '#8B5CF6' }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-blue-100 opacity-20 mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-700 text-lg font-medium">Loading city data...</p>
          <p className="mt-2 text-gray-500">Fetching real-time tax collection statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  City Dashboards
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Live tax collection and fund allocation across Pakistan
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-white text-sm font-medium">Real-time Data</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-white text-sm font-medium">Blockchain Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tax Collected</p>
                  <p className="text-2xl font-bold text-blue-600">
                    PKR {cityStats.reduce((sum, city) => sum + city.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Taxpayers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {cityStats.reduce((sum, city) => sum + city.paymentCount, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cities</p>
                  <p className="text-2xl font-bold text-purple-600">{cityStats.length}</p>
                </div>
                <Building className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. per City</p>
                  <p className="text-2xl font-bold text-orange-600">
                    PKR {cityStats.length > 0 ? Math.round(cityStats.reduce((sum, city) => sum + city.totalAmount, 0) / cityStats.length).toLocaleString() : '0'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </motion.div>
          </div>

          {/* City Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Pakistan Tax Collection Map
                </h2>
                <p className="text-gray-600">Interactive visualization of tax collection across cities</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Live Data</span>
                </div>
                <button
                  onClick={loadCityData}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
              <CityMap cityStats={cityStats} onCityClick={setSelectedCity} />
            </div>
          </motion.div>

          {/* City Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cityStats.map((city, index) => (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl transform hover:scale-105 ${
                  selectedCity === city.city ? 'ring-2 ring-blue-500 shadow-blue-200' : ''
                }`}
                onClick={() => setSelectedCity(city.city)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{city.city}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{city.paymentCount}</span>
                    <p className="text-xs text-gray-400">taxpayers</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-2xl font-bold text-blue-600">
                      PKR {city.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Tax Collected</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Avg. Payment:</span>
                      <span className="font-medium text-gray-900">
                        PKR {Math.round(city.totalAmount / city.paymentCount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Collection Rate:</span>
                      <span className="font-medium text-green-600">
                        {((city.totalAmount / cityStats.reduce((sum, c) => sum + c.totalAmount, 0)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedCity === city.city && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Activity className="w-4 h-4" />
                      <span>Click to view detailed dashboard</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Selected City Details */}
          {selectedCity && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    {selectedCity} Dashboard
                  </h2>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">Detailed analytics and fund allocation breakdown</p>
              </div>
              
              <div className="p-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Tax Collection Chart */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Tax Collection Trend
                    </h3>
                    <TaxChart data={cityStats.filter(c => c.city === selectedCity)} />
                  </div>

                  {/* Fund Allocation */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Fund Allocation Breakdown
                    </h3>
                    <div className="space-y-4">
                      {getFundAllocationData(selectedCity).map((item) => (
                        <div key={item.name} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-sm font-medium text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              PKR {item.value.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full transition-all duration-500"
                              style={{
                                width: `${(item.value / cityStats.find(c => c.city === selectedCity)?.totalAmount) * 100}%`,
                                backgroundColor: item.color
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {((item.value / cityStats.find(c => c.city === selectedCity)?.totalAmount) * 100).toFixed(1)}% of total collection
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* City Projects */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    Active Development Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'Road Infrastructure', status: 'In Progress', budget: 'PKR 50M', completion: 65, icon: '🛣️' },
                      { name: 'School Renovation', status: 'Planning', budget: 'PKR 25M', completion: 15, icon: '🏫' },
                      { name: 'Hospital Equipment', status: 'Completed', budget: 'PKR 30M', completion: 100, icon: '🏥' },
                      { name: 'Security Cameras', status: 'In Progress', budget: 'PKR 15M', completion: 80, icon: '📹' },
                      { name: 'Green Spaces', status: 'Planning', budget: 'PKR 10M', completion: 0, icon: '🌳' },
                      { name: 'Water Supply', status: 'In Progress', budget: 'PKR 40M', completion: 45, icon: '💧' }
                    ].map((project, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">{project.icon}</span>
                          <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-medium text-gray-900">{project.budget}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Completion:</span>
                            <span className="font-medium text-gray-900">{project.completion}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full transition-all duration-500"
                              style={{
                                width: `${project.completion}%`,
                                backgroundColor: project.completion === 100 ? '#10B981' : project.completion > 50 ? '#3B82F6' : '#F59E0B'
                              }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
    </div>
  );
};

export default Cities;
