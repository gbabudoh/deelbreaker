import { Metadata } from 'next';
import DealsDiscovery from '../components/deals/DealsDiscovery';

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DealsDiscovery />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Discover Deals - Deelbreaker',
  description: 'Browse exclusive deals, group buys, and instant cashback offers from top retailers.',
};