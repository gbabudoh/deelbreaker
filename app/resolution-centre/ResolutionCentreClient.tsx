'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Send, FileText, CheckCircle2, ChevronRight, HelpCircle, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

interface DisputeCase {
  id: string;
  orderId: string;
  reason: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  date: string;
  amount: string;
}

const MOCK_CASES: DisputeCase[] = [
  {
    id: 'DS-4821',
    orderId: '#ORD-4817',
    reason: 'Voucher Code Rejected by Merchant',
    status: 'Resolved',
    date: 'June 3, 2026',
    amount: '$34.99'
  },
  {
    id: 'DS-4820',
    orderId: '#ORD-4799',
    reason: 'Item Arrived Damaged',
    status: 'Under Review',
    date: 'May 28, 2026',
    amount: '$89.00'
  }
];

export default function ResolutionCentreClient() {
  const [cases, setCases] = useState<DisputeCase[]>(MOCK_CASES);
  const [formData, setFormData] = useState({
    orderId: '',
    reason: 'Voucher Code Rejected by Merchant',
    description: '',
    resolution: 'Full Refund'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newCaseId, setNewCaseId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API case submission
    setTimeout(() => {
      const generatedCaseId = `DS-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCase: DisputeCase = {
        id: generatedCaseId,
        orderId: formData.orderId,
        reason: formData.reason,
        status: 'Open',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        amount: 'Pending'
      };
      
      setCases([newCase, ...cases]);
      setNewCaseId(generatedCaseId);
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
              <ShieldAlert className="w-3.5 h-3.5" />
              Resolution Centre
            </span>
            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
              Dispute & <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Claim Solutions</span>
            </h1>
            <p className="text-base text-gray-600 sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Open a dispute, track active claims, and get resolutions for your order issues.
            </p>
          </div>
        </div>
      </section>

      {/* Resolution Centre Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Dispute Case Tracker */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Active Cases</h2>
            
            <div className="space-y-4">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-gray-400">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-100' :
                        c.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-100'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm truncate max-w-xs">{c.reason}</h3>
                    <p className="text-xs text-gray-500 mt-1">Order: {c.orderId} · {c.date}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                </div>
              ))}
            </div>

            {/* Quick mediation policy */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white border border-gray-800 space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#F3AF7B]" />
                Resolution Guarantee
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Deelbreaker acts as an independent mediator for all transactions. If a merchant fails to fulfill a group buy order or rejects a valid voucher, our support team will enforce a full refund within 48 hours of verification.
              </p>
            </div>
          </div>

          {/* Right Column: Open a Dispute Form */}
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
                    <h3 className="text-2xl font-black text-gray-900">Case Filed Successfully</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                      Your case has been successfully logged with ID <strong className="text-gray-900">{newCaseId}</strong>. We have sent a confirmation copy to <strong className="text-gray-900">contact@deelbreaker.com</strong>. One of our resolution experts will mediate your claim shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ orderId: '', reason: 'Voucher Code Rejected by Merchant', description: '', resolution: 'Full Refund' });
                      }}
                      className="mt-6 px-6 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm rounded-xl transition-colors"
                    >
                      File Another Dispute
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
                    <h3 className="text-2xl font-black text-gray-900 mb-2">File a New Dispute Case</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Order Number</label>
                        <input
                          required
                          type="text"
                          placeholder="#ORD-XXXX"
                          value={formData.orderId}
                          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Dispute Reason</label>
                        <select
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm bg-white"
                        >
                          <option>Voucher Code Rejected by Merchant</option>
                          <option>Item Not Received</option>
                          <option>Item Damaged or Incorrect</option>
                          <option>Cashback Missing or Unprocessed</option>
                          <option>Other merchant issue</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Desired Outcome</label>
                      <select
                        value={formData.resolution}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 text-sm bg-white"
                      >
                        <option>Full Refund</option>
                        <option>Replacement Shipment</option>
                        <option>Manual Cashback Credit</option>
                        <option>Other / General Mediation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Case Explanation Details</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Provide full description of the transaction issue to support resolution..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                          File Dispute Case
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
