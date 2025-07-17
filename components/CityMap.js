import { useState, useEffect } from 'react'
import { MapPin, TrendingUp, Users } from 'lucide-react'

export default function CityMap({ cityStats = [], onCityClick }) {
  const [selectedCity, setSelectedCity] = useState(null)
  
  // Use real data from props or fallback to demo data
  const cities = cityStats.length > 0 ? cityStats.map(city => ({
    name: city.city,
    totalAmount: city.totalAmount,
    paymentCount: city.paymentCount,
    taxContributed: cityStats.length > 0 ? `${((city.totalAmount / cityStats.reduce((sum, c) => sum + c.totalAmount, 0)) * 100).toFixed(1)}%` : '0%',
    taxAmount: `PKR ${city.totalAmount.toLocaleString()}`
  })) : [
    {
      name: 'Karachi',
      totalAmount: 2500000,
      paymentCount: 1250,
      taxContributed: '38%',
      taxAmount: 'PKR 2,500,000'
    },
    {
      name: 'Lahore',
      totalAmount: 1800000,
      paymentCount: 900,
      taxContributed: '24%',
      taxAmount: 'PKR 1,800,000'
    },
    {
      name: 'Islamabad',
      totalAmount: 1200000,
      paymentCount: 600,
      taxContributed: '15%',
      taxAmount: 'PKR 1,200,000'
    },
    {
      name: 'Rawalpindi',
      totalAmount: 900000,
      paymentCount: 450,
      taxContributed: '8%',
      taxAmount: 'PKR 900,000'
    },
    {
      name: 'Faisalabad',
      totalAmount: 750000,
      paymentCount: 375,
      taxContributed: '7%',
      taxAmount: 'PKR 750,000'
    }
  ]
  
  const handleCityClick = (city) => {
    setSelectedCity(city)
    if (onCityClick) {
      onCityClick(city.name)
    }
  }
  
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden animate-fadeIn bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Pakistan Tax Collection Map
        </h3>
        <p className="text-sm text-gray-600">Interactive visualization showing tax contributions by city</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 ${
              selectedCity?.name === city.name ? 'ring-2 ring-blue-500 shadow-blue-200' : ''
            }`}
            onClick={() => handleCityClick(city)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-800">{city.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">{city.taxContributed}</span>
                <p className="text-xs text-gray-400">of total</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Tax Collected:</span>
                </div>
                <span className="font-medium text-green-600">{city.taxAmount}</span>
              </div>
              
              {city.paymentCount && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Taxpayers:</span>
                  </div>
                  <span className="font-medium text-blue-600">{city.paymentCount.toLocaleString()}</span>
                </div>
              )}
              
              {city.totalAmount && city.paymentCount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Payment:</span>
                  <span className="font-medium text-purple-600">
                    PKR {Math.round(city.totalAmount / city.paymentCount).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            {selectedCity?.name === city.name && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-blue-600 text-center">
                  Click to view detailed dashboard
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          💡 Interactive map with real-time blockchain data • Click on any city for detailed view
        </p>
      </div>
    </div>
  )
}
