import ResolutionCentreClient from './ResolutionCentreClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resolution Centre - Deelbreaker',
  description: 'Open a dispute, track active claims, and get resolutions for your order issues at Deelbreaker.',
};

export default function ResolutionCentrePage() {
  return <ResolutionCentreClient />;
}
