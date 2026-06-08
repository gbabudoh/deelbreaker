import ContactClient from './ContactClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Deelbreaker',
  description: 'Get in touch with the Deelbreaker team. Support, sales, or partnerships inquiries can be submitted directly here.',
};

export default function ContactPage() {
  return <ContactClient />;
}
