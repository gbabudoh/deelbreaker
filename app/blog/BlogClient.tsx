'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, BookOpen, Search, X, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  category: 'Smart Shopping' | 'Group Buying' | 'Merchant Tips';
  summary: string;
  content: string[];
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Group Buying: How Demand Pooling Saves You 40%+',
    category: 'Group Buying',
    summary: 'Discover the mathematics and negotiation mechanics behind group buying, and learn how communities can leverage their shared volume to beat traditional retail pricing.',
    content: [
      'In traditional retail, individual consumers are price-takers. They walk into a store, look at a price tag, and have no choice but to pay whatever price the merchant sets. Merchants set these prices to cover high customer acquisition costs, storage fees, and waste margins. But what happens when consumers pool their demand?',
      'Demand pooling turns the tables. By bringing together hundreds or thousands of buyers who all commit to purchasing a product, buyers gain direct bargaining power. At Deelbreaker, our technology automates this negotiation process. We establish clear discount tiers: if 100 people buy, the price drops 15%; if 500 join, it drops 30%; and if 1,000 commit, the price drops by 45% or more.',
      'For merchants, this bulk volume is highly attractive. It allows them to clear inventory quickly, optimize their logistics pipelines, and secure guaranteed sales upfront. Instead of spending dollars trying to convince 1,000 individuals to buy throughout a month, they receive 1,000 orders simultaneously in a single day.',
      'To get the most out of group buys, shoppers can share active deal links with friends and online communities. When a deal is shared across social media or messaging groups, it gains momentum. Each new participant increases the likelihood of reaching the next discount threshold, creating a cooperative network where everyone saves together.'
    ],
    date: 'Jun 7, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: '2',
    title: 'Top 5 Smart Shopping Hacks for the Summer Season',
    category: 'Smart Shopping',
    summary: 'Beat inflation and shopping fatigue with our curated guide to saving on travel, apparel, and seasonal electronics.',
    content: [
      'Summer is one of the busiest shopping seasons of the year, second only to the holidays. From booking travel accommodations to upgrading outdoor equipment, expenses can accumulate fast. Here are five smart hacks to keep your budget balanced this summer.',
      '1. Leverage Stackable Rewards: Never settle for a single discount code. Optimize your savings by using a cashback credit card, activating your platform cashbacks on Deelbreaker, and layering active promotional coupon codes on checkout.',
      '2. Time Your Electronics Upgrades: Retailers tend to discount home electronics and older model smart devices in early summer to clear warehouse spaces for major late-summer manufacturer announcements. If you do not need the absolute newest device, wait until late June for the best deals.',
      '3. Use Incognito Bookings: Travel websites use cookies to track your search history. If you look at a flight or hotel repeatedly, prices often rise dynamically. Always search and book in private or incognito browser modes to secure baseline prices.',
      '4. Focus on Wholesale Bulk Services: For spas, gym packs, and local dining packages, look for group vouchers or bundle options. Buying multi-packs or split-cost services with friends routinely cuts rates in half.',
      '5. Monitor Price Drop Logs: Save items you are interested in directly to your Deelbreaker saved deals list. Our real-time trackers will automatically notify you when target items drop in price, ensuring you buy at the low point.'
    ],
    date: 'Jun 5, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    title: 'Why Merchants Love Deelbreaker: The Bulk Acquisition Model',
    category: 'Merchant Tips',
    summary: 'A deep dive into how platform partners utilize group purchases to minimize logistics costs and acquire highly engaged repeat customers.',
    content: [
      'For brands and retailers, customer acquisition is the single most expensive business line item. In highly competitive sectors, marketing budgets eat up to 50% of the total margin. Deelbreaker introduces a new paradigm: frictionless bulk acquisition.',
      'By listing product deals as group buys on our marketplace, merchants do not pay upfront advertising fees. Instead, they offer a discounted rate in exchange for guaranteed sales volume. Deelbreaker handles the promotion, payment processing, and distribution of vouchers.',
      'Logistics also becomes significantly cheaper. Fulfilling 500 identical items to a pre-defined list of group buyers is vastly more efficient than shipping single orders sporadic hours apart. Warehouses can batch package, negotiate lower cargo shipping rates, and save precious processing hours.',
      'Lastly, group buyers represent highly engaged consumers. A satisfied group buyer is highly likely to recommend the store to friends, lowering the merchant\'s organic acquisition costs for future sales. It is not just about clearing stock; it is about building brand loyalty.'
    ],
    date: 'May 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
  }
];

export default function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Smart Shopping', 'Group Buying', 'Merchant Tips'];

  const filteredPosts = POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = POSTS.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured || selectedCategory !== 'All' || searchQuery !== '');

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <AnimatePresence mode="wait">
        {readingPost ? (
          // FULL BLOG POST READ VIEW
          <motion.div
            key="read-post"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 max-w-4xl mx-auto px-4 sm:px-6"
          >
            <button
              onClick={() => setReadingPost(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#F3AF7B] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>

            <article className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <img
                src={readingPost.image}
                alt={readingPost.title}
                className="w-full h-[300px] sm:h-[400px] object-cover"
              />
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
                  <span className="text-xs font-bold text-[#F3AF7B] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">
                    {readingPost.category}
                  </span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {readingPost.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readingPost.readTime}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                  {readingPost.title}
                </h1>

                <p className="text-base sm:text-lg text-gray-500 font-medium italic border-l-4 border-[#F3AF7B] pl-4 py-1 leading-relaxed">
                  {readingPost.summary}
                </p>

                <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                  {readingPost.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          </motion.div>
        ) : (
          // BLOG DIRECTORY VIEW
          <motion.div
            key="directory"
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
                    Insight & Strategy
                  </span>
                  <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
                    The <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Deelbreaker Blog</span>
                  </h1>
                  <p className="text-base text-gray-600 sm:text-xl leading-relaxed max-w-2xl mx-auto">
                    Your essential guide to smart buying tactics, cooperative demand pooling, cashbacks, and wholesale merchant acquisition.
                  </p>
                </div>
              </div>
            </section>

            {/* Filter and Search Bar */}
            <section className="py-8 bg-white border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Category tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        selectedCategory === category
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 text-gray-800 text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Posts Grid */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* FEATURED POST */}
              {selectedCategory === 'All' && !searchQuery && featuredPost && (
                <div className="mb-12">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Article</h2>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 grid lg:grid-cols-12 cursor-pointer"
                    onClick={() => setReadingPost(featuredPost)}
                  >
                    <div className="lg:col-span-7">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-64 sm:h-96 object-cover"
                      />
                    </div>
                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-center space-y-4">
                      <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                        <span className="text-xs font-bold text-[#F3AF7B] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">
                          {featuredPost.category}
                        </span>
                        <span>{featuredPost.date}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {featuredPost.summary}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-sm font-bold text-[#F3AF7B]">
                        Read Full Post <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* POSTS GRID */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {selectedCategory !== 'All' || searchQuery ? 'Search Results' : 'Recent Articles'}
                </h2>
                
                {filteredPosts.length === 0 ? (
                  <div className="text-center bg-white border border-gray-100 rounded-3xl p-16 text-gray-500 font-medium">
                    No matching articles found. Try another search or filter!
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                        onClick={() => setReadingPost(post)}
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover shrink-0"
                        />
                        <div className="p-5 flex-1 flex flex-col space-y-3">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                            <span className="text-[10px] font-bold text-[#F3AF7B] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">
                              {post.category}
                            </span>
                            <span>{post.date}</span>
                          </div>
                          <h3 className="text-lg font-extrabold text-gray-900 leading-snug line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">
                            {post.summary}
                          </p>
                          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#F3AF7B] self-start">
                            Read Post <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
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
