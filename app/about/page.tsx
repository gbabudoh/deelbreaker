import AboutClient from './AboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Deelbreaker',
  description: 'Learn about Deelbreaker - the AI-powered smart shopping platform that leverages group buying power and instant cashback to deliver unbeatable prices.',
};

export default function AboutPage() {
  return <AboutClient />;
}
