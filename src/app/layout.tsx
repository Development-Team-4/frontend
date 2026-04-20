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
        url: '/logo.png',
        type: 'image/svg+xml',
      },
      '/favicon.ico',
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.png',
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
