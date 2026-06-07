import { redirect } from 'next/navigation';

interface GroupBuyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroupBuyPage({ params }: GroupBuyPageProps) {
  const resolvedParams = await params;
  redirect(`/deal/${resolvedParams.id}`);
}