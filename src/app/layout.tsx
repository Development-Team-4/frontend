import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { MainProvider } from './providers';

const _inter = Inter({ subsets: ['latin', 'cyrillic'] });
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TicketFlow - Ticket Management System',
  description:
    'Enterprise ticket management with SLA tracking, escalations, and audit logging',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <MainProvider>
          <AppShell>{children}</AppShell>
          <Analytics />
        </MainProvider>
      </body>
    </html>
  );
}
