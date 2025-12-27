'use client'

import { useState } from 'react'
import AvailabilityToggle from './AvailabilityToggle'

interface FiltersProps {
  availableItems: any[]
  soldItems: any[]
}

export default function ThriftFilters({ availableItems, soldItems }: FiltersProps) {
  const [activeFilter, setActiveFilter] = useState<'available' | 'sold'>('available')

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveFilter('available')}
              className={`py-2 px-1 text-sm font-medium ${
                activeFilter === 'available'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available ({availableItems.length})
            </button>
            <button
              onClick={() => setActiveFilter('sold')}
              className={`py-2 px-1 text-sm font-medium ${
                activeFilter === 'sold'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sold ({soldItems.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeFilter === 'available' ? (
        <AvailableItemsTab items={availableItems} />
      ) : (
        <SoldItemsTab items={soldItems} />
      )}
    </div>
  )
}

function AvailableItemsTab({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Items</h2>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-lg">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No available items</h3>
          <p className="text-gray-600 mb-4">List a new item to start selling</p>
          <a
            href="/dashboard/thrift/new"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            List your first item →
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function SoldItemsTab({ items }: { items: any[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Sold Items</h2>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-lg">✅</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sold items</h3>
          <p className="text-gray-600">Items you mark as sold will appear here</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <ItemCard key={item.id} item={item} isSold />
          ))}
        </div>
      )}
    </div>
  )
}

function ItemCard({ item, isSold = false }: { item: any; isSold?: boolean }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow ${isSold ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">{item.title}</h3>
        <AvailabilityToggle itemId={item.id} initialAvailable={item.is_available || false} />
      </div>

      <div className="mb-3">
        <span className={`text-2xl font-bold ${isSold ? 'text-gray-400' : 'text-purple-600'}`}>
          ${item.price}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span>Condition: {item.condition || 'Good'}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.is_available ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.is_available ? 'Available' : 'Sold'}
        </span>
      </div>

      <div className="flex justify-end">
        <a
          href={`/dashboard/thrift/${item.id}`}
          className={`${isSold ? 'text-gray-600 hover:text-gray-700' : 'text-purple-600 hover:text-purple-700'} font-medium text-sm`}
        >
          View Details →
        </a>
      </div>
    </div>
  )
}