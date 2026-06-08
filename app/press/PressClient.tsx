'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, FileText, Download, Mail, ArrowRight, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface PressRelease {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  content: string[];
}

const PRESS_RELEASES: PressRelease[] = [
  {
    id: '1',
    title: 'Deelbreaker Launches AI-Powered Group Buying Marketplace to Combat Retail Inflation',
    date: 'June 1, 2026',
    location: 'London, UK',
    summary: 'Deelbreaker officially exits beta with the launch of its innovative platform combining group buying mechanics and direct cashback rewards.',
    content: [
      'LONDON — June 1, 2026 — Deelbreaker today announced the public launch of its AI-powered group-buying marketplace, designed to enable everyday consumers to unlock wholesale discounts on physical goods and local services.',
      'As inflation continues to impact household budgets, Deelbreaker offers a community-driven alternative. The platform pools consumer demand to negotiate discounts directly with verified brands, lowering the unit price as more participants commit to the purchase.',
      '"We believe retail markets are fundamentally skewed against the individual buyer," said the CEO of Deelbreaker. "By aggregating demand in real time, we give consumers the collective bargaining leverage usually reserved for large corporations, while providing merchants with guaranteed bulk orders."',
      'Deelbreaker launches with over 500 verified merchant partners across electronics, fashion, and local wellness services. The platform features an automated wallet tracking system for cashbacks and integrated notifications to keep users updated on deal thresholds.'
    ]
  },
  {
    id: '2',
    title: 'Deelbreaker Surpasses 50,000 Active Shoppers and Partners with 500+ Verified Brands',
    date: 'April 15, 2026',
    location: 'London, UK',
    summary: 'Rapid user adoption drives total consumer savings past $2.5 million in the first half of the year.',
    content: [
      'LONDON — April 15, 2026 — Deelbreaker today shared key growth milestones, announcing that its consumer network has grown past 50,000 active shoppers within months of its soft launch.',
      'The platform has processed over 150,000 completed deals, resulting in more than $2.5 million in cumulative savings for users. Popular categories include premium electronics and wellness voucher bundles.',
      'In addition to shopper milestones, the merchant directory has expanded to include over 500 verified businesses. Merchants report up to a 40% reduction in customer acquisition costs when utilizing Deelbreaker\'s bulk preorder model compared to traditional digital marketing channels.'
    ]
  },
  {
    id: '3',
    title: 'Deelbreaker Named Top Commerce Startup to Watch in 2026',
    date: 'February 10, 2026',
    location: 'San Francisco, CA',
    summary: 'Industry analysts recognize Deelbreaker\'s innovative cashback engine and demand pooling algorithms.',
    content: [
      'SAN FRANCISCO — February 10, 2026 — Deelbreaker has been selected as one of the top commerce startups to watch in 2026 by the Retail Tech Syndicate.',
      'The syndication highlighted Deelbreaker\'s unique hybrid model of instant cashbacks and group buys, noting its potential to restructure standard digital e-commerce flows.',
      '"Deelbreaker represents the natural evolution of social commerce," commented the lead retail analyst. "Instead of simply socializing shopping, they are financializing community purchasing power to drive tangible savings."'
    ]
  }
];

export default function PressClient() {
  const [readingRelease, setReadingRelease] = useState<PressRelease | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadKit = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <AnimatePresence mode="wait">
        {readingRelease ? (
          // PRESS RELEASE DETAIL VIEW
          <motion.div
            key="read-release"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 max-w-4xl mx-auto px-4 sm:px-6"
          >
            <button
              onClick={() => setReadingRelease(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#F3AF7B] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Press Room
            </button>

            <article className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {readingRelease.date}</span>
                <span>{readingRelease.location}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                {readingRelease.title}
              </h1>

              <p className="text-base sm:text-lg text-gray-500 font-medium italic border-l-4 border-[#F3AF7B] pl-4 py-1 leading-relaxed">
                {readingRelease.summary}
              </p>

              <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                {readingRelease.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
          </motion.div>
        ) : (
          // MAIN PRESS DIRECTORY
          <motion.div
            key="press-directory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-[#df874e]/15 via-white to-[#cc6855]/15">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="max-w-3xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153]">
                    <Sparkles className="w-3 h-3" />
                    Press Room
                  </span>
                  <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
                    Deelbreaker <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Newsroom</span>
                  </h1>
                  <p className="text-base text-gray-600 sm:text-xl leading-relaxed max-w-2xl mx-auto">
                    The latest official announcements, media resources, and brand guidelines.
                  </p>
                </div>
              </div>
            </section>

            {/* Media Resources and Contact Info */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* News Release List */}
                <div className="lg:col-span-8 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Press Releases</h2>
                  
                  {PRESS_RELEASES.map((release) => (
                    <motion.div
                      key={release.id}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setReadingRelease(release)}
                    >
                      <div className="flex items-center gap-3 text-xs font-semibold text-gray-400 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{release.date}</span>
                        <span>·</span>
                        <span>{release.location}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug hover:text-[#F3AF7B] transition-colors">
                        {release.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {release.summary}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#F3AF7B]">
                        Read Release <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sidebar Media Kit & Contact */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Media Kit Download */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#F3AF7B]" />
                      Media Kit
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                      Download official logos, screenshots of the dashboard interface, and executive headshots.
                    </p>
                    <button
                      onClick={handleDownloadKit}
                      className="w-full py-3 bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      {downloaded ? (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Downloaded!
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Brand Assets
                        </>
                      )}
                    </button>
                  </div>

                  {/* Press Contact */}
                  <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xs">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-[#F3AF7B]" />
                      Media Contact
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed mb-4">
                      Are you a journalist or analyst working on a story about smart shopping, fintech cashback, or retail trends?
                    </p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Email</p>
                      <a href="mailto:press@deelbreaker.com" className="text-sm font-bold text-[#F3AF7B] hover:underline">
                        press@deelbreaker.com
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer pushes to bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
