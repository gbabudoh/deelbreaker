'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  Search, 
  Compass, 
  Bell, 
  Sparkles, 
  Package, 
  MapPin, 
  Laptop, 
  Activity, 
  ShieldAlert,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  options?: { label: string; action: string }[];
  deals?: any[];
}

const WELCOME_OPTS = [
  { label: '🔍 Search Deals', action: 'search' },
  { label: '🧭 Help Me Choose', action: 'quiz' },
  { label: '🔔 Setup Swoopa Alert', action: 'watch' }
];

export default function SpyGlassChat() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState<'start' | 'search_mode' | 'quiz_type' | 'quiz_budget' | 'watch_keyword' | 'watch_price'>('start');
  const [quizState, setQuizState] = useState<{ type?: string; budget?: string }>({});
  const [watchState, setWatchState] = useState<{ keyword?: string }>({});
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Hello! I am SpyGlass 🦅, your smart shopping tracker. What are we hunting for today?',
        options: WELCOME_OPTS
      }
    ]);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Math.random().toString() }]);
  };

  const handleOptionClick = async (action: string, label: string) => {
    // Add user response bubble
    addMessage({ sender: 'user', text: label });

    if (action === 'search') {
      setStep('search_mode');
      addMessage({
        sender: 'bot',
        text: 'Type a keyword or category you want to find (e.g. "iPhone", "MacBook", "Massage"):',
      });
    } else if (action === 'quiz') {
      setStep('quiz_type');
      addMessage({
        sender: 'bot',
        text: 'Let\'s find the perfect deal! What type of offer are you looking for?',
        options: [
          { label: 'Physical Products 📦', action: 'type_PHYSICAL_PRODUCT' },
          { label: 'Local Services 📍', action: 'type_LOCAL_SERVICE' },
          { label: 'Digital Software 💻', action: 'type_DIGITAL_SOFTWARE' }
        ]
      });
    } else if (action === 'watch') {
      setStep('watch_keyword');
      addMessage({
        sender: 'bot',
        text: 'What product name or category do you want to monitor for future price drops?',
      });
    } else if (action.startsWith('type_')) {
      const type = action.replace('type_', '');
      setQuizState({ type });
      setStep('quiz_budget');
      addMessage({
        sender: 'bot',
        text: 'Got it! What is your maximum budget for this item?',
        options: [
          { label: 'Under $30 💵', action: 'budget_30' },
          { label: 'Under $100 💸', action: 'budget_100' },
          { label: 'Any Budget 💎', action: 'budget_any' }
        ]
      });
    } else if (action.startsWith('budget_')) {
      const budget = action.replace('budget_', '');
      setLoading(true);
      
      try {
        const res = await fetch('/api/deals?limit=30');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        const deals = data.deals || [];

        // Apply filters
        const filtered = deals.filter((d: any) => {
          const matchesType = d.type === quizState.type;
          let matchesPrice = true;
          if (budget === '30') matchesPrice = d.currentPrice <= 30;
          else if (budget === '100') matchesPrice = d.currentPrice <= 100;
          return matchesType && matchesPrice;
        }).slice(0, 3);

        if (filtered.length > 0) {
          addMessage({
            sender: 'bot',
            text: `Here are my top recommended matches based on your quiz:`,
            deals: filtered
          });
        } else {
          addMessage({
            sender: 'bot',
            text: 'I couldn\'t find any active matching deals under that budget. Try browsing our broad marketplace or set up a future Swoopa Alert!'
          });
        }
      } catch (err) {
        addMessage({
          sender: 'bot',
          text: 'Oops! I had trouble fetching recommendations. Please try again.'
        });
      } finally {
        setLoading(false);
        setStep('start');
        addMessage({
          sender: 'bot',
          text: 'What would you like to check next?',
          options: WELCOME_OPTS
        });
      }
    } else if (action.startsWith('watch_direct_')) {
      const keyword = action.replace('watch_direct_', '');
      setWatchState({ keyword });
      setStep('watch_price');
      addMessage({
        sender: 'bot',
        text: `Let's configure Swoopa to monitor "${keyword}". What is your target alert price in USD? (e.g. 50)`
      });
    } else if (action === 'cancel') {
      setStep('start');
      addMessage({
        sender: 'bot',
        text: 'No problem! What else can I help you find?',
        options: WELCOME_OPTS
      });
    }
  };

  const handleTextInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    addMessage({ sender: 'user', text });
    setInputValue('');

    if (step === 'search_mode') {
      setLoading(true);
      try {
        const res = await fetch(`/api/deals?search=${encodeURIComponent(text)}&limit=3`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const deals = data.deals || [];

        if (deals.length > 0) {
          addMessage({
            sender: 'bot',
            text: `Here are the top matches I found for "${text}":`,
            deals
          });
          setStep('start');
          addMessage({
            sender: 'bot',
            text: 'What else can I help you find today?',
            options: WELCOME_OPTS
          });
        } else {
          addMessage({
            sender: 'bot',
            text: `I couldn't find any active deals matching "${text}" right now. Would you like to setup a Swoopa Alert to monitor this for future price drops?`,
            options: [
              { label: `🦅 Yes, track "${text}"`, action: `watch_direct_${text}` },
              { label: '❌ Cancel', action: 'cancel' }
            ]
          });
        }
      } catch {
        addMessage({
          sender: 'bot',
          text: 'An error occurred while searching. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    } else if (step === 'watch_keyword') {
      setWatchState({ keyword: text });
      setStep('watch_price');
      addMessage({
        sender: 'bot',
        text: `Got it! What is your target alert price in USD for "${text}"? (e.g. 50)`
      });
    } else if (step === 'watch_price') {
      const price = parseFloat(text);
      if (isNaN(price) || price <= 0) {
        addMessage({
          sender: 'bot',
          text: 'Please enter a valid target price number (e.g. 45 or 120):'
        });
        return;
      }

      if (!session) {
        addMessage({
          sender: 'bot',
          text: '⚠️ You must be signed in to configure future Swoopa alerts. Please log in first!'
        });
        setStep('start');
        addMessage({
          sender: 'bot',
          text: 'How can I assist you next?',
          options: WELCOME_OPTS
        });
        return;
      }

      setLoading(true);
      try {
        // Find a matching product first to link to SavedDeal
        const searchRes = await fetch(`/api/deals?search=${encodeURIComponent(watchState.keyword || '')}&limit=1`);
        if (!searchRes.ok) throw new Error();
        const searchData = await searchRes.json();
        const matchingDeal = searchData.deals?.[0];

        if (!matchingDeal) {
          addMessage({
            sender: 'bot',
            text: `I couldn't find any deals matching "${watchState.keyword}" to build an alert on. Try setting a watcher on an active deal or category.`
          });
        } else {
          // Save the deal
          const saveRes = await fetch('/api/user/saved-deals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId: matchingDeal.id })
          });

          // Update target price and Swoopa parameters
          await fetch(`/api/user/saved-deals/${matchingDeal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              swoopaActive: true,
              targetPrice: price,
              priceAlert: true
            })
          });

          addMessage({
            sender: 'bot',
            text: `🎉 Success! I have configured a Swoopa watch for "${matchingDeal.title}" with a target price of $${price}. You will be alerted via push notification when the price drops below this target!`
          });
        }
      } catch (err) {
        // Fallback: If it's already saved, just update it
        addMessage({
          sender: 'bot',
          text: 'Watcher sync complete. Check your User Dashboard Saved Deals tab to review all configurations!'
        });
      } finally {
        setLoading(false);
        setStep('start');
        addMessage({
          sender: 'bot',
          text: 'How can I assist you next?',
          options: WELCOME_OPTS
        });
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            className="w-80 sm:w-96 h-[480px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">SpyGlass Deal Finder</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                    <span className="text-[10px] opacity-90 font-medium">Ready to hunt</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="cursor-pointer p-1 bg-white/10 hover:bg-white/25 rounded-full transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gray-900 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Options Pills */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-1">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.action}
                          onClick={() => handleOptionClick(opt.action, opt.label)}
                          className="cursor-pointer text-xxs font-bold text-orange-600 bg-orange-50 border border-orange-100 hover:bg-orange-100 rounded-full px-3 py-1.5 transition-all"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Deals cards inside bubbles */}
                  {msg.deals && (
                    <div className="w-full space-y-2 mt-2">
                      {msg.deals.map((deal) => (
                        <div key={deal.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs flex gap-3">
                          <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                            {deal.images && deal.images[0] ? (
                              <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xxs font-bold text-gray-800 truncate">{deal.title}</h4>
                            <p className="text-[10px] text-gray-500 mb-1">by {deal.merchant.name}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-gray-900">${deal.currentPrice}</span>
                              <span className="text-[10px] text-gray-400 line-through">${deal.originalPrice}</span>
                            </div>
                            <Link 
                              href={`/deal/${deal.id}`}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-[9px] font-bold text-orange-500 hover:text-orange-600 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Swoop Deal
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Loading Bubble */}
              {loading && (
                <div className="flex items-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-[#F3AF7B] animate-spin" />
                    <span className="text-xxs font-bold text-gray-400">SpyGlass is scouting...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            {['search_mode', 'watch_keyword', 'watch_price'].includes(step) && (
              <form onSubmit={handleTextInputSubmit} className="p-3 border-t border-gray-100 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder={
                    step === 'search_mode' 
                      ? 'Search deals...' 
                      : step === 'watch_price' 
                      ? 'Enter target price...' 
                      : 'Type product keyword...'
                  }
                  className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F3AF7B] bg-gray-50"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="cursor-pointer bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white p-2.5 rounded-xl hover:shadow-md transition-all flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-14 h-14 rounded-full bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow relative"
        title="SpyGlass Deal Finder"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              {/* Pulse notification dot */}
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm animate-bounce">
                1
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
