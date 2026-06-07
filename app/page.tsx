import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import MarketplaceHero from './components/MarketplaceHero';
import DealsGrid from './components/deals/DealsGrid';
import Footer from './components/Footer';

// Mock data for the marketplace using new DealTypes
const featuredDeals: any[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max - 256GB Titanium',
    merchant: 'TechWorld',
    originalPrice: 1199,
    currentPrice: 999,
    discount: 17,
    type: 'PHYSICAL_PRODUCT',
    image: 'https://picsum.photos/seed/iphone-pro/400/300',
    category: 'Electronics',
    rating: 4.8,
    verified: true
  },
  {
    id: 2,
    title: 'Luxury Spa Day for Two with Afternoon Tea',
    merchant: 'Relaxation Co.',
    originalPrice: 240,
    currentPrice: 89,
    discount: 63,
    type: 'LOCAL_SERVICE',
    image: 'https://picsum.photos/seed/spa-luxury/400/300',
    category: 'Local',
    rating: 4.9,
    verified: true
  },
  {
    id: 3,
    title: 'Wireless Noise Cancelling Headphones',
    merchant: 'AudioPro',
    originalPrice: 349,
    currentPrice: 199,
    discount: 43,
    type: 'PHYSICAL_PRODUCT',
    image: 'https://picsum.photos/seed/headphones-audio/400/300',
    category: 'Electronics',
    rating: 4.7,
    verified: true
  },
  {
    id: 4,
    title: 'Gourmet 3-Course Dinner for Two',
    merchant: 'The Kitchen',
    originalPrice: 120,
    currentPrice: 55,
    discount: 54,
    type: 'LOCAL_SERVICE',
    image: 'https://picsum.photos/seed/gourmet-dining/400/300',
    category: 'Dining',
    rating: 4.6,
    verified: true
  }
];

const trendingDeals: any[] = [
  {
    id: 101,
    title: 'Premium Yoga Mat + Carrier Bag',
    merchant: 'ZenLife',
    originalPrice: 65,
    currentPrice: 29,
    discount: 55,
    type: 'PHYSICAL_PRODUCT',
    image: 'https://picsum.photos/seed/yoga-fitness/400/300',
    category: 'Goods',
    rating: 4.5,
    verified: true
  },
  {
    id: 102,
    title: '4K Ultra HD Dash Cam with GPS',
    merchant: 'DriveSafe',
    originalPrice: 199,
    currentPrice: 89,
    discount: 55,
    type: 'PHYSICAL_PRODUCT',
    image: 'https://picsum.photos/seed/dashcam-auto/400/300',
    category: 'Electronics',
    rating: 4.4,
    verified: true
  },
  {
    id: 103,
    title: 'Bamboo Bed Sheets - 1000 Thread Count',
    merchant: 'SoftSleep',
    originalPrice: 120,
    currentPrice: 39,
    discount: 67,
    type: 'PHYSICAL_PRODUCT',
    image: 'https://picsum.photos/seed/bamboo-bedding/400/300',
    category: 'Goods',
    rating: 4.8,
    verified: true
  },
  {
    id: 104,
    title: 'Professional Teeth Whitening Kit',
    merchant: 'SmileBright',
    originalPrice: 89,
    currentPrice: 34,
    discount: 62,
    type: 'PHYSICAL_PRODUCT',
    image: 'https://picsum.photos/seed/beauty-smile/400/300',
    category: 'Beauty',
    rating: 4.3,
    verified: true
  }
];

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <CategoryBar />
      <MarketplaceHero />
      <DealsGrid
        title="Featured Deals"
        subtitle="Hand-picked deals from our top verified merchants"
        deals={featuredDeals}
        viewAllHref="/deals/featured"
      />
      <DealsGrid
        title="Trending Today"
        subtitle="The most popular deals our community is loving right now"
        deals={trendingDeals}
        viewAllHref="/deals/trending"
      />
      <Footer />
    </main>
  );
}
