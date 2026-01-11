'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, Download, ChevronRight, CheckCircle, Clock, Filter } from 'lucide-react';

export default function CashbackHistory() {
  const [filter, setFilter] = useState('all');

  const cashbackHistory = [
    {
      id: 1,
      merchant: 'Nike Store',
      product: 'Air Max 270 Sneakers',
      amount: 15.00,
      status: 'completed',
      date: '2024-01-08',
      orderId: 'ORD-12345'
    },
    {
      id: 2,
      merchant: 'TechWorld',
      product: 'iPhone 15 Pro Case',
      amount: 8.50,
      status: 'pending',
      date: '2024-01-06',
      orderId: 'ORD-12344'
    },
    {
      id: 3,
      merchant: 'BookStore',
      product: 'Programming Books Bundle',
      amount: 12.75,
      status: 'completed',
      date: '2024-01-04',
      orderId: 'ORD-12343'
    },
    {
      id: 4,
      merchant: 'HomeDepot',
      product: 'Smart Home Kit',
      amount: 25.00,
      status: 'completed',
      date: '2024-01-02',
      orderId: 'ORD-12342'
    }
  ];

  const filteredHistory = filter === 'all' 
    ? cashbackHistory 
    : cashbackHistory.filter(item => item.status === filter);

  const totalCashback = cashbackHistory.reduce((sum, item) => sum + item.amount, 0);
  const pendingCashback = cashbackHistory
    .filter(item => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  const completedCashback = totalCashback - pendingCashback;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards - Horizontal Scroll on Mobile */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3">
        <div className="flex-shrink-0 w-[160px] lg:w-auto bg-gradient-to-br from-green-400 to-green-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
            <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 opacity-60" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold mb-0.5">${completedCashback.toFixed(2)}</h3>
          <p className="text-green-100 text-xs lg:text-sm">Total Earned</p>
        </div>

        <div className="flex-shrink-0 w-[160px] lg:w-auto bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <Calendar className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">This Month</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold mb-0.5">${(totalCashback * 0.4).toFixed(2)}</h3>
          <p className="text-orange-100 text-xs lg:text-sm">Monthly</p>
        </div>

        <div className="flex-shrink-0 w-[160px] lg:w-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <Clock className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold mb-0.5">${pendingCashback.toFixed(2)}</h3>
          <p className="text-yellow-100 text-xs lg:text-sm">Processing</p>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
          <h3 className="text-base lg:text-xl font-bold text-gray-900">Transaction History</h3>
          <div className="flex items-center gap-2">
            <button className="cursor-pointer hidden lg:flex items-center gap-2 text-[#F3AF7B] hover:text-[#F3AF7B]/80 font-medium text-sm transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filter Tabs - Mobile */}
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'completed', label: 'Completed' },
            { id: 'pending', label: 'Pending' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`cursor-pointer flex-shrink-0 px-4 lg:px-6 py-3 text-sm font-medium transition-colors touch-active ${
                filter === tab.id
                  ? 'text-[#F3AF7B] border-b-2 border-[#F3AF7B] bg-[#F3AF7B]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transaction List - Mobile Optimized */}
        <div className="divide-y divide-gray-50">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 hover:bg-gray-50 transition-colors touch-active"
            >
              {/* Icon */}
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {item.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{item.merchant}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'completed' ? 'Done' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{item.product}</p>
                <p className="text-xs text-gray-400 mt-0.5 lg:hidden">{formatDate(item.date)}</p>
              </div>

              {/* Amount & Date */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-green-600 text-sm lg:text-base">+${item.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-400 hidden lg:block">{formatDate(item.date)}</p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 hidden lg:block" />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}

        {/* Load More */}
        {filteredHistory.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center">
            <button className="cursor-pointer text-[#F3AF7B] hover:text-[#F3AF7B]/80 font-medium text-sm transition-colors touch-active">
              Load More Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
