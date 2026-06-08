import PressClient from './PressClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press - Deelbreaker',
  description: 'Read official press releases, news updates, and download media assets from Deelbreaker.',
};

export default function PressPage() {
  return <PressClient />;
}
