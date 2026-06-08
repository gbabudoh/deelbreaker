import HelpClient from './HelpClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center - Deelbreaker',
  description: 'Search frequently asked questions and get guides about Deelbreaker buying and selling features.',
};

export default function HelpPage() {
  return <HelpClient />;
}
