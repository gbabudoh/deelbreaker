import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DealDetailsClient from './DealDetailsClient'

interface DealPageProps {
  params: Promise<{
    id: string
  }>
}

const MOCK_DEALS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Latest iPhone with advanced camera system, titanium design, and A17 Pro chip. Includes 1-year warranty and free shipping.',
    category: 'Electronics',
    originalPrice: 1199.00,
    currentPrice: 999.00,
    discount: 17,
    type: 'PHYSICAL_PRODUCT',
    images: [
      'https://picsum.photos/seed/iphone-1/600/400',
      'https://picsum.photos/seed/iphone-2/600/400',
      'https://picsum.photos/seed/iphone-3/600/400',
      'https://picsum.photos/seed/iphone-4/600/400',
      'https://picsum.photos/seed/iphone-5/600/400',
    ],
    features: [
      'A17 Pro chip with 6-core GPU',
      'Pro camera system with 5x Telephoto',
      'Titanium design',
      'Action Button',
      'USB-C connector'
    ],
    terms: 'Limit 1 per customer. Subject to availability.',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-techworld',
    merchant: {
      id: 'm-techworld',
      name: 'TechWorld Electronics',
      logo: null,
      verified: true,
      avgRating: 4.8,
      description: 'Leading electronics retailer with cutting-edge technology'
    },
    reviews: [
      {
        id: 'r1',
        rating: 5,
        title: 'Incredible speed',
        content: 'The A17 Pro chip is amazing for gaming and photography. Highly recommend!',
        createdAt: new Date().toISOString(),
        user: { name: 'Sarah J.', avatar: null }
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning and breathable mesh upper.',
    category: 'Fashion',
    originalPrice: 150.00,
    currentPrice: 89.00,
    discount: 41,
    type: 'PHYSICAL_PRODUCT',
    images: [
      'https://picsum.photos/seed/nike-1/600/400',
      'https://picsum.photos/seed/nike-2/600/400',
      'https://picsum.photos/seed/nike-3/600/400',
      'https://picsum.photos/seed/nike-4/600/400',
      'https://picsum.photos/seed/nike-5/600/400',
    ],
    features: [
      'Max Air cushioning',
      'Breathable mesh upper',
      'Durable rubber outsole',
      'Comfortable fit'
    ],
    terms: 'Available in standard sizes. Exchanges allowed within 14 days.',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-sportzone',
    merchant: {
      id: 'm-sportzone',
      name: 'SportZone',
      logo: null,
      verified: true,
      avgRating: 4.6,
      description: 'Your one-stop shop for sports and fitness equipment'
    },
    reviews: [
      {
        id: 'r2',
        rating: 4,
        title: 'Very comfortable',
        content: 'Walked in them all day, no pain. Great cushioning!',
        createdAt: new Date().toISOString(),
        user: { name: 'Mike R.', avatar: null }
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Deep Tissue Massage Package',
    description: 'Relax and unwind with a premium 60-minute deep tissue massage at SpaRetreat.',
    category: 'Beauty & Spa',
    originalPrice: 150.00,
    currentPrice: 90.00,
    discount: 40,
    type: 'LOCAL_SERVICE',
    images: [
      'https://picsum.photos/seed/spa-1/600/400',
      'https://picsum.photos/seed/spa-2/600/400',
      'https://picsum.photos/seed/spa-3/600/400',
      'https://picsum.photos/seed/spa-4/600/400',
      'https://picsum.photos/seed/spa-5/600/400',
    ],
    features: [
      '60-minute session',
      'Licensed therapists',
      'Aromatherapy oils included',
      'Shower facility access'
    ],
    terms: 'Voucher valid for 90 days from purchase. Appointment required.',
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-sparetreat',
    merchant: {
      id: 'm-sparetreat',
      name: 'SpaRetreat',
      logo: null,
      verified: true,
      avgRating: 4.7,
      description: 'Luxury day spa and wellness center'
    },
    reviews: [
      {
        id: 'r3',
        rating: 5,
        title: 'Fantastic massage',
        content: 'Highly professional staff. Felt completely relaxed afterwards.',
        createdAt: new Date().toISOString(),
        user: { name: 'Lisa K.', avatar: null }
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Gourmet 3-Course Dinner for Two',
    description: 'Enjoy an unforgettable gourmet dining experience for two at The Kitchen — a chef-crafted 3-course meal with wine pairing.',
    category: 'Dining',
    originalPrice: 120.00,
    currentPrice: 55.00,
    discount: 54,
    type: 'LOCAL_SERVICE',
    images: [
      'https://picsum.photos/seed/dining-1/600/400',
      'https://picsum.photos/seed/dining-2/600/400',
      'https://picsum.photos/seed/dining-3/600/400',
      'https://picsum.photos/seed/dining-4/600/400',
      'https://picsum.photos/seed/dining-5/600/400',
    ],
    features: [
      '3-course chef-crafted menu',
      'Wine pairing included',
      'Valid any day of the week',
      'Romantic ambiance'
    ],
    terms: 'Reservation required. Voucher valid for 6 months from purchase.',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-thekitchen',
    merchant: {
      id: 'm-thekitchen',
      name: 'The Kitchen',
      logo: null,
      verified: true,
      avgRating: 4.6,
      description: 'Award-winning restaurant specialising in contemporary cuisine'
    },
    reviews: [
      {
        id: 'r4',
        rating: 5,
        title: 'Absolutely stunning meal',
        content: 'Every course was perfectly executed. The wine pairing was excellent. Will be back!',
        createdAt: new Date().toISOString(),
        user: { name: 'Emma T.', avatar: null }
      }
    ]
  },
  '101': {
    id: '101',
    title: 'Premium Yoga Mat + Carrier Bag',
    description: 'High-density non-slip yoga mat with alignment lines, includes a matching carrier bag.',
    category: 'Goods',
    originalPrice: 65.00,
    currentPrice: 29.00,
    discount: 55,
    type: 'PHYSICAL_PRODUCT',
    images: [
      'https://picsum.photos/seed/yoga-1/600/400',
      'https://picsum.photos/seed/yoga-2/600/400',
      'https://picsum.photos/seed/yoga-3/600/400',
      'https://picsum.photos/seed/yoga-4/600/400',
      'https://picsum.photos/seed/yoga-5/600/400',
    ],
    features: [
      'High-density non-slip surface',
      'Alignment guide lines',
      'Eco-friendly TPE material',
      'Includes carrier bag'
    ],
    terms: 'Free shipping on all orders. Returns accepted within 30 days.',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-zenlife',
    merchant: {
      id: 'm-zenlife',
      name: 'ZenLife',
      logo: null,
      verified: true,
      avgRating: 4.5,
      description: 'Premium yoga and wellness accessories'
    },
    reviews: [
      {
        id: 'r101',
        rating: 5,
        title: 'Great quality',
        content: 'Very grippy and comfortable. The carrier bag is a nice bonus.',
        createdAt: new Date().toISOString(),
        user: { name: 'Priya M.', avatar: null }
      }
    ]
  },
  '102': {
    id: '102',
    title: '4K Ultra HD Dash Cam with GPS',
    description: 'Front and rear 4K dash cam with built-in GPS, night vision, and loop recording.',
    category: 'Electronics',
    originalPrice: 199.00,
    currentPrice: 89.00,
    discount: 55,
    type: 'PHYSICAL_PRODUCT',
    images: [
      'https://picsum.photos/seed/dashcam-1/600/400',
      'https://picsum.photos/seed/dashcam-2/600/400',
      'https://picsum.photos/seed/dashcam-3/600/400',
      'https://picsum.photos/seed/dashcam-4/600/400',
      'https://picsum.photos/seed/dashcam-5/600/400',
    ],
    features: [
      '4K front + 1080p rear camera',
      'Built-in GPS tracking',
      'Night vision mode',
      'Loop recording with G-sensor'
    ],
    terms: '2-year manufacturer warranty. Free shipping.',
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-drivesafe',
    merchant: {
      id: 'm-drivesafe',
      name: 'DriveSafe',
      logo: null,
      verified: true,
      avgRating: 4.4,
      description: 'Automotive safety technology specialists'
    },
    reviews: [
      {
        id: 'r102',
        rating: 4,
        title: 'Crystal clear footage',
        content: 'Incredibly sharp video even at night. Setup was straightforward.',
        createdAt: new Date().toISOString(),
        user: { name: 'James L.', avatar: null }
      }
    ]
  },
  '103': {
    id: '103',
    title: 'Bamboo Bed Sheets - 1000 Thread Count',
    description: 'Luxuriously soft bamboo bed sheets with a 1000 thread count. Available in King, Queen, and Double sizes.',
    category: 'Goods',
    originalPrice: 120.00,
    currentPrice: 39.00,
    discount: 67,
    type: 'PHYSICAL_PRODUCT',
    images: [
      'https://picsum.photos/seed/bedding-1/600/400',
      'https://picsum.photos/seed/bedding-2/600/400',
      'https://picsum.photos/seed/bedding-3/600/400',
      'https://picsum.photos/seed/bedding-4/600/400',
      'https://picsum.photos/seed/bedding-5/600/400',
    ],
    features: [
      '1000 thread count bamboo fabric',
      'Temperature regulating',
      'Hypoallergenic',
      'Available in 3 sizes'
    ],
    terms: 'Free shipping. 60-day returns if unused.',
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-softsleep',
    merchant: {
      id: 'm-softsleep',
      name: 'SoftSleep',
      logo: null,
      verified: true,
      avgRating: 4.8,
      description: 'Premium bedding and sleep accessories'
    },
    reviews: [
      {
        id: 'r103',
        rating: 5,
        title: 'Best sheets I\'ve ever owned',
        content: 'So incredibly soft. I sleep so much better now. Worth every penny.',
        createdAt: new Date().toISOString(),
        user: { name: 'Hannah B.', avatar: null }
      }
    ]
  },
  '104': {
    id: '104',
    title: 'Professional Teeth Whitening Kit',
    description: 'Dentist-approved LED teeth whitening kit with 10 whitening gel syringes for up to 8 shades whiter teeth.',
    category: 'Beauty',
    originalPrice: 89.00,
    currentPrice: 34.00,
    discount: 62,
    type: 'PHYSICAL_PRODUCT',
    images: [
      'https://picsum.photos/seed/teeth-1/600/400',
      'https://picsum.photos/seed/teeth-2/600/400',
      'https://picsum.photos/seed/teeth-3/600/400',
      'https://picsum.photos/seed/teeth-4/600/400',
      'https://picsum.photos/seed/teeth-5/600/400',
    ],
    features: [
      'LED accelerator light',
      '10 whitening gel syringes',
      'Up to 8 shades whiter',
      'Dentist approved formula'
    ],
    terms: 'Not suitable for children under 16. Results may vary.',
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    merchantId: 'm-smilebright',
    merchant: {
      id: 'm-smilebright',
      name: 'SmileBright',
      logo: null,
      verified: true,
      avgRating: 4.3,
      description: 'Professional teeth whitening and oral care products'
    },
    reviews: [
      {
        id: 'r104',
        rating: 4,
        title: 'Noticeably whiter in a week',
        content: 'Used for 7 days and my teeth are visibly whiter. Easy to use.',
        createdAt: new Date().toISOString(),
        user: { name: 'Carlos D.', avatar: null }
      }
    ]
  }
}

export default async function DealPage({ params }: DealPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  if (MOCK_DEALS[id]) {
    return <DealDetailsClient deal={MOCK_DEALS[id]} />
  }

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      merchant: {
        select: {
          id: true,
          name: true,
          logo: true,
          verified: true,
          avgRating: true,
          description: true
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }
    }
  })

  if (!deal) {
    notFound()
  }

  // Serialize date types to keep client bundle clean
  const serializedDeal = JSON.parse(JSON.stringify(deal))

  return <DealDetailsClient deal={serializedDeal} />
}
