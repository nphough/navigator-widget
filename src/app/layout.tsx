import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Navigator Widget',
  description: 'AF beverage brand widget powered by Navigator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}