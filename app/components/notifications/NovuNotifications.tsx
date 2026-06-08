'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, DollarSign, Package, Star, TrendingUp, Zap, Clock } from 'lucide-react';

interface NovuNotificationsProps {
  variant?: 'header-desktop' | 'header-mobile' | 'dashboard-desktop' | 'dashboard-mobile' | 'seller-desktop';
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'success' | 'info' | 'sale' | 'system';
}

const BUYER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'b1',
    title: '🎉 Group Buy Succeeded!',
    description: 'The iPhone 15 Pro Max deal reached its goal. Your order is processed!',
    time: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: 'b2',
    title: '💰 Cashback Processed',
    description: 'You earned $15.00 cashback on Nike Air Max 270.',
    time: '1 day ago',
    read: false,
    type: 'info'
  },
  {
    id: 'b3',
    title: '🔥 Price Drop Alert',
    description: 'Samsung 65" QLED TV in your saved list dropped by 10%.',
    time: '2 days ago',
    read: true,
    type: 'system'
  }
];

const SELLER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 's1',
    title: '📦 New Order Received',
    description: 'Order #ORD-4821 was placed by Alice K. for $89.00.',
    time: '5 mins ago',
    read: false,
    type: 'sale'
  },
  {
    id: 's2',
    title: '⭐ New Review Received',
    description: 'Alice K. left a 5-star review: "Amazing quality, very happy!"',
    time: '1 hour ago',
    read: false,
    type: 'success'
  },
  {
    id: 's3',
    title: '📈 Weekly Digest Ready',
    description: 'Your sales performance report for last week is now available.',
    time: '1 day ago',
    read: true,
    type: 'info'
  }
];

export default function NovuNotifications({ variant = 'header-desktop' }: NovuNotificationsProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSeller = variant === 'seller-desktop';
  const initialNotifications = isSeller ? SELLER_NOTIFICATIONS : BUYER_NOTIFICATIONS;
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Sync notifications with variant
  useEffect(() => {
    setNotifications(isSeller ? SELLER_NOTIFICATIONS : BUYER_NOTIFICATIONS);
  }, [isSeller]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status !== 'loading' && !session?.user?.id) {
    return null;
  }

  // Class names for different variants
  let buttonClass = "";
  let iconClass = "w-5 h-5";

  if (variant === 'header-desktop') {
    buttonClass = "relative flex items-center p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 cursor-pointer";
    iconClass = "w-5 h-5";
  } else if (variant === 'header-mobile') {
    buttonClass = "p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors rounded-full hover:bg-gray-100 cursor-pointer relative";
    iconClass = "w-5 h-5";
  } else if (variant === 'dashboard-mobile') {
    buttonClass = "cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors relative touch-active rounded-full hover:bg-gray-100 flex items-center justify-center";
    iconClass = "w-5 h-5";
  } else if (variant === 'dashboard-desktop') {
    buttonClass = "cursor-pointer p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors touch-active text-white flex items-center justify-center relative";
    iconClass = "w-5 h-5 text-white";
  } else if (variant === 'seller-desktop') {
    buttonClass = "p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/10 cursor-pointer flex items-center justify-center relative";
    iconClass = "w-5 h-5";
  }

  if (status === 'loading') {
    return (
      <div className={`${buttonClass} animate-pulse`}>
        <Bell className={`${iconClass} text-gray-300`} />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'info':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'sale':
        return <Package className="w-4 h-4 text-[#F3AF7B]" />;
      default:
        return <Zap className="w-4 h-4 text-orange-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-100';
      case 'info':
        return 'bg-blue-50 border-blue-100';
      case 'sale':
        return 'bg-orange-50 border-orange-100';
      default:
        return 'bg-yellow-50 border-yellow-100';
    }
  };

  return (
    <div className="relative flex items-center justify-center" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={buttonClass} 
        title="Notifications"
      >
        <Bell className={iconClass} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className="font-bold text-gray-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#F3AF7B] hover:text-[#e09153] font-semibold transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`w-full flex items-start gap-3 p-3.5 hover:bg-gray-50 transition-colors text-left relative ${
                      !notification.read ? 'bg-orange-50/10' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getIconBg(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-xs font-semibold truncate ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {notification.description}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#F3AF7B] rounded-full" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
