import { Metadata } from 'next';
import GroupBuyDetails from '../../components/group-buy/GroupBuyDetails';

interface GroupBuyPageProps {
  params: {
    id: string;
  };
}

export default function GroupBuyPage({ params }: GroupBuyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <GroupBuyDetails dealId={params.id} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Group Buy Details - Deelbreaker',
  description: 'Join the group buy and save more with community power.',
};