'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Shield, CreditCard, Smartphone, ChevronRight, Camera, LogOut, HelpCircle, FileText } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
}

interface NotificationSettings {
  deals: boolean;
  groupBuys: boolean;
  priceDrops: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  shareActivity: boolean;
  dataCollection: boolean;
}

interface ProfileSettingsProps {
  userData: UserData;
}

export default function ProfileSettings({ userData }: ProfileSettingsProps) {
  const [profile, setProfile] = useState({
    name: userData.name,
    email: userData.email,
    phone: '+1 (555) 123-4567',
    notifications: {
      deals: true,
      groupBuys: true,
      priceDrops: true,
      marketing: false
    } as NotificationSettings,
    privacy: {
      profileVisible: true,
      shareActivity: false,
      dataCollection: true
    } as PrivacySettings
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleNotificationToggle = (setting: keyof NotificationSettings) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handlePrivacyToggle = (setting: keyof PrivacySettings) => {
    setProfile(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-active ${
        enabled ? 'bg-[#F3AF7B]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const menuItems = [
    {
      id: 'payment',
      icon: CreditCard,
      label: 'Payment Methods',
      description: 'Manage cards & bank accounts',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: '2fa',
      icon: Smartphone,
      label: 'Two-Factor Auth',
      description: 'Extra security for your account',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'FAQs and contact support',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'terms',
      icon: FileText,
      label: 'Terms & Privacy',
      description: 'Legal information',
      color: 'bg-gray-100 text-gray-600'
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold shadow-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="cursor-pointer absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#F3AF7B] transition-colors touch-active border border-gray-100">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{profile.name}</h2>
              <p className="text-sm text-gray-500 truncate">{profile.email}</p>
              <p className="text-xs text-gray-400 mt-1">{profile.phone}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="cursor-pointer w-full py-3 px-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 font-medium hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-colors touch-active">
            Edit Profile Information
          </button>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 lg:p-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#F3AF7B]" />
          </div>
          <h3 className="text-base lg:text-lg font-bold text-gray-900">Notifications</h3>
        </div>

        <div className="divide-y divide-gray-50">
          {[
            { key: 'deals' as keyof NotificationSettings, label: 'New Deals', desc: 'Get notified about new deals' },
            { key: 'groupBuys' as keyof NotificationSettings, label: 'Group Buys', desc: 'Updates on group buy opportunities' },
            { key: 'priceDrops' as keyof NotificationSettings, label: 'Price Drops', desc: 'When saved items drop in price' },
            { key: 'marketing' as keyof NotificationSettings, label: 'Marketing', desc: 'Promotional emails & newsletters' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 lg:p-5">
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-medium text-gray-900 text-sm lg:text-base">{item.label}</h4>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{item.desc}</p>
              </div>
              <Toggle 
                enabled={profile.notifications[item.key]} 
                onToggle={() => handleNotificationToggle(item.key)} 
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 lg:p-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-base lg:text-lg font-bold text-gray-900">Privacy</h3>
        </div>

        <div className="divide-y divide-gray-50">
          {[
            { key: 'profileVisible' as keyof PrivacySettings, label: 'Profile Visibility', desc: 'Allow others to see your profile' },
            { key: 'shareActivity' as keyof PrivacySettings, label: 'Share Activity', desc: 'Share deal activity with friends' },
            { key: 'dataCollection' as keyof PrivacySettings, label: 'Personalization', desc: 'Allow data for recommendations' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 lg:p-5">
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-medium text-gray-900 text-sm lg:text-base">{item.label}</h4>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{item.desc}</p>
              </div>
              <Toggle 
                enabled={profile.privacy[item.key]} 
                onToggle={() => handlePrivacyToggle(item.key)} 
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="divide-y divide-gray-50">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="cursor-pointer w-full flex items-center gap-3 lg:gap-4 p-4 lg:p-5 hover:bg-gray-50 transition-colors touch-active text-left"
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm lg:text-base">{item.label}</h4>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <button className="cursor-pointer w-full flex items-center justify-center gap-2 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors touch-active">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        
        <button className="cursor-pointer w-full p-4 text-red-500 hover:text-red-600 text-sm font-medium transition-colors touch-active">
          Delete Account
        </button>
      </motion.div>

      {/* App Version */}
      <p className="text-center text-xs text-gray-400 pb-4">
        Deelbreaker v1.0.0
      </p>
    </div>
  );
}
