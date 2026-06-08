import CareersClient from './CareersClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - Deelbreaker',
  description: 'Join the team building the future of smart commerce. Explore remote job opportunities at Deelbreaker.',
};

export default function CareersPage() {
  return <CareersClient />;
}
