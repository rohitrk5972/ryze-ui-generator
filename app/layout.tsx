import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ryze UI Generator - AI-Powered UI Creation',
  description: 'Generate deterministic UIs from natural language using a 3-step AI agent system',
  keywords: ['AI', 'UI Generator', 'React', 'Next.js', 'Component Library'],
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
