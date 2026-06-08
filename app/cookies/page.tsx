import CookiesClient from './CookiesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Preferences - Deelbreaker',
  description: 'Manage cookie preferences and settings to control how Deelbreaker tracks and personalizes your e-commerce deals feed.',
};

export default function CookiesPage() {
  return <CookiesClient />;
}
