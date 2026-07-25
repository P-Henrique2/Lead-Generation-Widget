import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: 'Widget Lead Platform',
  description: 'A Next.js starter for a widget lead capture experience.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <Navigation />
          <main className="flex-1 py-6 sm:py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
