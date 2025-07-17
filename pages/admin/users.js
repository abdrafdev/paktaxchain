import React from 'react'
import { useState, useEffect } from 'react'

export default function UsersPage() {
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetch for users
    setTimeout(() => {
      setUserList([
        { id: 1, cnic: '12345-1234567-1', name: 'Ahmed Ali', phone: '+92 300 1234567', city: 'Karachi' },
        { id: 2, cnic: '23456-1234567-2', name: 'Fatima Sheikh', phone: '+92 321 7654321', city: 'Lahore' },
        { id: 3, cnic: '34567-1234567-3', name: 'Hassan Raza', phone: '+92 333 9876543', city: 'Islamabad' },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
            <ul>
              {userList.map(user => (
                <li key={user.id} className="mb-2">
                  {user.name} - {user.cnic} - {user.phone}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

