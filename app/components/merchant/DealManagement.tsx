'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Edit, Trash2, Eye, Users, Clock, DollarSign } from 'lucide-react';

export default function DealManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const deals = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      type: 'group-buy',
      status: 'active',
      participants: 847,
      targetParticipants: 1000,
      originalPrice: 1199,
      currentPrice: 999,
      revenue: 847000,
      timeLeft: '2d 14h',
      createdAt: '2024-01-05'
    },
    {
      id: 2,
      title: 'MacBook Air M3 13-inch',
      type: 'group-buy',
      status: 'active',
      participants: 234,
      targetParticipants: 500,
      originalPrice: 1299,
      currentPrice: 1099,
      revenue: 257000,
      timeLeft: '5d 8h',
      createdAt: '2024-01-03'
    },
    {
      id: 3,
      title: 'Samsung 65" QLED TV',
      type: 'instant',
      status: 'active',
      orders: 89,
      originalPrice: 1499,
      currentPrice: 899,
      cashback: 50,
      revenue: 80000,
      timeLeft: '3d 12h',
      createdAt: '2024-01-04'
    },
    {
      id: 4,
      title: 'Sony WH-1000XM5 Headphones',
      type: 'group-buy',
      status: 'completed',
      participants: 500,
      targetParticipants: 500,
      originalPrice: 399,
      currentPrice: 279,
      revenue: 139500,
      completedAt: '2024-01-02'
    },
    {
      id: 5,
      title: 'Nintendo Switch OLED',
      type: 'instant',
      status: 'paused',
      orders: 45,
      originalPrice: 349,
      currentPrice: 299,
      cashback: 15,
      revenue: 13455,
      pausedAt: '2024-01-06'
    }
  ];

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'completed': return 'bg-blue-100 text-blue-600';
      case 'paused': return 'bg-yellow-100 text-yellow-600';
      case 'draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Deal Management</h2>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Deal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Performance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Revenue</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.map((deal, index) => (
                <motion.tr
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{deal.title}</h4>
                      <p className="text-sm text-gray-600">
                        ${deal.currentPrice} <span className="line-through text-gray-400">${deal.originalPrice}</span>
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                      deal.type === 'group-buy' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {deal.type === 'group-buy' ? <Users className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                      {deal.type === 'group-buy' ? 'Group Buy' : 'Instant'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deal.status)}`}>
                      {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {deal.type === 'group-buy' ? (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          {deal.participants}/{deal.targetParticipants} joined
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-[#F3AF7B] h-1 rounded-full"
                            style={{ width: `${(deal.participants! / deal.targetParticipants!) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">{deal.orders} orders</p>
                        <p className="text-gray-600">${deal.cashback} cashback</p>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">
                      ${deal.revenue.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {deal.status === 'active' && deal.timeLeft && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {deal.timeLeft}
                      </div>
                    )}
                    {deal.status === 'completed' && deal.completedAt && (
                      <span>Completed {new Date(deal.completedAt).toLocaleDateString()}</span>
                    )}
                    {deal.status === 'paused' && deal.pausedAt && (
                      <span>Paused {new Date(deal.pausedAt).toLocaleDateString()}</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="cursor-pointer p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="cursor-pointer p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No deals found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredDeals.length} of {deals.length} deals
        </p>
        <div className="flex items-center gap-2">
          <button className="cursor-pointer px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="cursor-pointer px-4 py-2 bg-[#F3AF7B] text-white rounded-lg hover:bg-[#F3AF7B]/90 transition-colors">
            1
          </button>
          <button className="cursor-pointer px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="cursor-pointer px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}