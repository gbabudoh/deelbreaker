'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, HelpCircle, Sparkles } from 'lucide-react';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    role: 'Buyer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request submitting to contact@deelbreaker.com
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-br from-[#df874e]/15 via-white to-[#cc6855]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153]">
              <Sparkles className="w-3 h-3" />
              Contact Us
            </span>
            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
              Get in <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-base text-gray-600 sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Have questions about group buys, cashbacks, or partner opportunities? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900">Contact Information</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Reach out to us directly through any of the channels below. We look forward to hearing from you.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  {
                    icon: Mail,
                    title: 'Email Address',
                    detail: 'contact@deelbreaker.com',
                    href: 'mailto:contact@deelbreaker.com',
                    color: 'text-orange-500 bg-orange-50 border-orange-100'
                  },
                  {
                    icon: Phone,
                    title: 'Phone Number',
                    detail: '+1 (555) 123-4567',
                    href: 'tel:+15551234567',
                    color: 'text-blue-500 bg-blue-50 border-blue-100'
                  },
                  {
                    icon: MapPin,
                    title: 'Headquarters',
                    detail: '100 Smart Commerce Way, London, UK',
                    href: 'https://maps.google.com',
                    color: 'text-green-500 bg-green-50 border-green-100'
                  }
                ].map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.icon === MapPin ? '_blank' : undefined}
                    rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.title}</p>
                      <p className="text-sm font-bold text-gray-800 hover:text-[#F3AF7B] transition-colors">{item.detail}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Support Notice */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white border border-gray-800">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#F3AF7B]" />
                Looking for Help?
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                Before submitting a request, check your personal Dashboard for active deals status, cashback payouts, or orders.
              </p>
              <a 
                href="/consumer/dashboard"
                className="text-xs font-bold text-[#F3AF7B] hover:underline flex items-center gap-1"
              >
                Go to Dashboard
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs h-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Message Sent!</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for contacting us. Your submission has been securely routed to <strong className="text-gray-700">contact@deelbreaker.com</strong>. One of our specialists will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '', role: 'Buyer' });
                      }}
                      className="mt-6 px-6 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm rounded-xl transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Send us a Message</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                        <input
                          required
                          type="text"
                          placeholder="Alice Kim"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                        <input
                          required
                          type="email"
                          placeholder="alice@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Subject</label>
                        <input
                          required
                          type="text"
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">I am a...</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm bg-white"
                        >
                          <option>Buyer</option>
                          <option>Merchant / Seller</option>
                          <option>Partner / Affiliation</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write your message details here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send to contact@deelbreaker.com
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* Footer pushes to bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
