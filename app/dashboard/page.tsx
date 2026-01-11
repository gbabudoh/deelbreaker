import { Metadata } from 'next';
import UserDashboard from '../components/dashboard/UserDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserDashboard />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Dashboard - Deelbreaker',
  description: 'Manage your deals, track savings, and view your cashback history.',
};