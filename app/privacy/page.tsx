import PrivacyClient from './PrivacyClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Deelbreaker',
  description: 'Review the Privacy Policy to understand how Deelbreaker collects, uses, and safeguards your personal details.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
