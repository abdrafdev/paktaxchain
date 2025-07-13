import React, { useState, useEffect } from 'react';
import { supabase, dbHelpers } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import CityMap from '../components/CityMap';
import TaxChart from '../components/TaxChart';
import toast from 'react-hot-toast';

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
      const cityData = await dbHelpers.getCityStats();
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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading city data...</p>
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
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">City Dashboards</h1>
              <p className="text-gray-600">Live tax collection and fund allocation by city</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* City Map */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pakistan Tax Collection Map</h2>
            <CityMap cityStats={cityStats} onCityClick={setSelectedCity} />
          </div>

          {/* City Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cityStats.map((city) => (
              <div
                key={city.city}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedCity === city.city ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCity(city.city)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{city.city}</h3>
                  <span className="text-sm text-gray-500">{city.paymentCount} payments</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      PKR {city.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Tax Collected</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg. Payment:</span>
                    <span className="font-medium">
                      PKR {Math.round(city.totalAmount / city.paymentCount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected City Details */}
          {selectedCity && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCity} Dashboard</h2>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tax Collection Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Collection Trend</h3>
                  <TaxChart data={cityStats.filter(c => c.city === selectedCity)} />
                </div>

                {/* Fund Allocation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Allocation</h3>
                  <div className="space-y-4">
                    {getFundAllocationData(selectedCity).map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            PKR {item.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(item.value / cityStats.find(c => c.city === selectedCity)?.totalAmount) * 100}%`,
                              backgroundColor: item.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* City Projects */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Road Infrastructure', status: 'In Progress', budget: 'PKR 50M', completion: 65 },
                    { name: 'School Renovation', status: 'Planning', budget: 'PKR 25M', completion: 15 },
                    { name: 'Hospital Equipment', status: 'Completed', budget: 'PKR 30M', completion: 100 },
                    { name: 'Security Cameras', status: 'In Progress', budget: 'PKR 15M', completion: 80 },
                    { name: 'Green Spaces', status: 'Planning', budget: 'PKR 10M', completion: 0 },
                    { name: 'Water Supply', status: 'In Progress', budget: 'PKR 40M', completion: 45 }
                  ].map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{project.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            project.status === 'Completed' ? 'text-green-600' :
                            project.status === 'In Progress' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">{project.budget}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Completion:</span>
                          <span className="font-medium">{project.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${project.completion}%`,
                              backgroundColor: project.completion === 100 ? '#10B981' : '#3B82F6'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cities;
