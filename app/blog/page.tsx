import BlogClient from './BlogClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Deelbreaker',
  description: 'Read the latest from the Deelbreaker team about smart shopping tricks, group buying dynamics, and saving strategies.',
};

export default function BlogPage() {
  return <BlogClient />;
}
