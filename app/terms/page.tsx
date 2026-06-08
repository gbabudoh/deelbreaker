import TermsClient from './TermsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Deelbreaker',
  description: 'Review the Terms of Service for using the Deelbreaker group-buying and cashback platform.',
};

export default function TermsPage() {
  return <TermsClient />;
}
