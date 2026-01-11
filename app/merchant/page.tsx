import { Metadata } from 'next';
import MerchantPortal from '../components/merchant/MerchantPortal';

export default function MerchantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantPortal />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Merchant Portal - Deelbreaker',
  description: 'Manage your deals, track performance, and connect with customers.',
};