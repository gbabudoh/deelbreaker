'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Sparkles, Send, X, ArrowRight, ShieldCheck, Heart, Coffee, Laptop } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: 'Engineering' | 'Product' | 'Marketing' | 'Operations';
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

const OPEN_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer (Next.js & React)',
    department: 'Engineering',
    location: 'Remote (US/Europe)',
    type: 'Full-time',
    salary: '$130k - $160k + Equity',
    description: 'We are looking for a Senior Frontend Engineer to build high-performance web applications, optimize Web Vitals, and design polished user interfaces with Next.js and Tailwind CSS.',
    requirements: [
      '5+ years of production experience with React/Next.js and TypeScript.',
      'Strong eye for design and performance optimizations (Lighthouse/CWV).',
      'Experience with state management, layout architectures, and motion libraries (Framer Motion).'
    ]
  },
  {
    id: '2',
    title: 'Full Stack Engineer (Node.js & Postgres)',
    department: 'Engineering',
    location: 'Remote (US/Europe)',
    type: 'Full-time',
    salary: '$120k - $150k + Equity',
    description: 'Join our core platform team to scale backend APIs, database architecture, and integration with real-time systems (Novu, Stripe, etc.).',
    requirements: [
      '4+ years of backend development using Node.js, Express, and PostgreSQL.',
      'Experience designing robust REST & GraphQL APIs.',
      'Familiarity with serverless environments, Next.js API routing, and Prisma ORM.'
    ]
  },
  {
    id: '3',
    title: 'Product Designer',
    department: 'Product',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$90k - $115k + Equity',
    description: 'Lead design lifecycle from discovery to delivery. Shape how buyers and sellers interact with Deelbreaker\'s marketplace, group buying engines, and cashback features.',
    requirements: [
      '3+ years of experience in Product/UX design for consumer web apps.',
      'Stunning portfolio demonstrating clean typography, layout, and UX process.',
      'Proficiency in Figma and interactive prototyping.'
    ]
  },
  {
    id: '4',
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$85k - $110k + Equity',
    description: 'Drive growth, user acquisition, and merchant signups using SEO, content strategy, performance marketing, and community-driven initiatives.',
    requirements: [
      '3+ years of growth marketing experience in e-commerce or marketplace start-ups.',
      'Proven track record with paid search/social, SEO tools, and analytics (Google Analytics, Mixpanel).',
      'Strong copywriting and conversion rate optimization (CRO) skills.'
    ]
  }
];

export default function CareersClient() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);

  const filteredJobs = OPEN_JOBS.filter(job => selectedDept === 'All' || job.department === selectedDept);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-[#df874e]/15 via-white to-[#cc6855]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153] mb-4">
              <Sparkles className="w-3 h-3" />
              Careers at Deelbreaker
            </span>
            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl mb-6">
              Build the Future of <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Smart Commerce</span>
            </h1>
            <p className="text-base text-gray-600 sm:text-xl leading-relaxed mb-8">
              Join a fast-growing, remote-first team committed to disrupting retail models and making commerce fairer, smarter, and community-driven.
            </p>
            <a 
              href="#jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-200/50 transition-all cursor-pointer"
            >
              View Open Roles
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Culture & Perks Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why You'll Love Working Here
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We empower our team with maximum autonomy, remote flexibility, and the support needed to achieve career-defining milestones.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Laptop,
                title: '100% Remote-First',
                desc: 'Work from wherever you are most productive. We build asynchronous processes to respect your deep focus time.',
              },
              {
                icon: Heart,
                title: 'Health & Wellness',
                desc: 'Comprehensive health coverage, mental health support, and monthly wellness stipends for gym or sports.',
              },
              {
                icon: Coffee,
                title: 'Stipends & Perks',
                desc: 'Generous home-office setups, high-performance equipment allowance, and unlimited coffee/snack budgets.',
              },
              {
                icon: ShieldCheck,
                title: 'Ownership & Equity',
                desc: 'Everyone is a stakeholder. Every package includes attractive early-stage startup stock options.',
              }
            ].map((perk, idx) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-[#F3AF7B] flex items-center justify-center mx-auto mb-5">
                  <perk.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{perk.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Listings Section */}
      <section id="jobs" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Open Positions
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Explore our current opportunities and find where you can make the biggest impact.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex justify-center gap-2 flex-wrap mb-10">
            {['All', 'Engineering', 'Product', 'Marketing'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center bg-white border border-gray-200 rounded-2xl p-10 text-gray-500 font-medium">
                No open roles in this department at the moment. Check back soon!
              </div>
            ) : (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layoutId={`job-${job.id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#F3AF7B] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md mb-2 inline-block">
                      {job.department}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {job.type}</span>
                      <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" /> {job.salary}</span>
                    </div>
                  </div>
                  <button className="shrink-0 flex items-center gap-1.5 self-start md:self-auto px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal Job Application Detail */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedJob(null); setApplied(false); }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs flex items-center justify-center p-4"
            />
            <motion.div
              layoutId={`job-${selectedJob.id}`}
              className="fixed inset-x-4 max-w-2xl mx-auto top-[10%] bottom-[10%] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F3AF7B] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md mb-1 inline-block">
                    {selectedJob.department}
                  </span>
                  <h2 className="text-xl lg:text-2xl font-black text-gray-900">{selectedJob.title}</h2>
                </div>
                <button
                  onClick={() => { setSelectedJob(null); setApplied(false); }}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {selectedJob.type}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" /> {selectedJob.salary}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-gray-900">About the Role</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-gray-900">Requirements</h4>
                  <ul className="space-y-2 list-disc list-inside text-sm text-gray-600">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  {applied ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-5 text-center"
                    >
                      <h4 className="font-bold text-lg mb-1">🎉 Application Sent Successfully!</h4>
                      <p className="text-sm">Thank you for applying. Our recruiting team will review your profile and get back to you shortly.</p>
                    </motion.div>
                  ) : (
                    <form 
                      onSubmit={(e) => { e.preventDefault(); setApplied(true); }}
                      className="space-y-4"
                    >
                      <h4 className="font-extrabold text-gray-900 mb-2">Apply for this Position</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                          <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                          <input required type="email" placeholder="john@example.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Portfolio or Resume Link</label>
                        <input required type="url" placeholder="https://linkedin.com/in/johndoe or resume url" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800" />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        Submit Application
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer pushes to bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
