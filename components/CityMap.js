import dynamic from 'next/dynamic'
import { useState } from 'react'

// Load React Leaflet components only on client-side
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

export default function CityMap() {
  const [cities, setCities] = useState([
    {
      name: 'Karachi',
      position: [24.8607, 67.0011],
      taxContributed: '38%',
      taxAmount: '0.5 ETH'
    },
    {
      name: 'Lahore',
      position: [31.5497, 74.3436],
      taxContributed: '24%',
      taxAmount: '0.3 ETH'
    },
    {
      name: 'Islamabad',
      position: [33.6844, 73.0479],
      taxContributed: '15%',
      taxAmount: '0.2 ETH'
    }
  ])
  
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden animate-fadeIn">
      <MapContainer center={[30.3753, 69.3451]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {cities.map((city, index) => (
          <Marker key={index} position={city.position}>
            <Popup>
              <div>
                <h3 className="text-lg font-semibold">{city.name}</h3>
                <p className="text-sm text-gray-600">Tax Contributed: {city.taxContributed}</p>
                <p className="text-sm text-gray-600">Total Tax: {city.taxAmount}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
