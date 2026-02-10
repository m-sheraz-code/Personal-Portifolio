import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Muhammad Sheraz | Full-Stack Developer & AI Expert',
    template: '%s | Muhammad Sheraz',
  },
  description: 'Muhammad Sheraz is a Full-Stack Developer specializing in MERN, Next.js, AI Automation, and CRM solutions.',
  keywords: ['Muhammad Sheraz', 'web developer', 'full-stack', 'AI automation', 'CRM expert', 'Next.js', 'MERN'],
  authors: [{ name: 'Muhammad Sheraz' }],
  creator: 'Muhammad Sheraz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Developer Portfolio',
    title: 'Portfolio | Full-Stack Developer',
    description: 'A passionate full-stack developer creating modern, performant web applications.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Full-Stack Developer',
    description: 'A passionate full-stack developer creating modern, performant web applications.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import ClientLayout from '@/components/public/ClientLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
