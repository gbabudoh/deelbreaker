import { Metadata } from 'next';
import DealsDiscovery from '../../components/deals/DealsDiscovery';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DealsDiscovery initialCategory={category} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    title: `${title} Deals - Deelbreaker`,
    description: `Browse exclusive ${category} deals, group buys, and instant cashback offers.`,
  };
}
