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
    default: 'Portfolio | Full-Stack Developer',
    template: '%s | Portfolio',
  },
  description: 'A passionate full-stack developer creating modern, performant web applications with cutting-edge technologies.',
  keywords: ['web developer', 'full-stack', 'portfolio', 'react', 'next.js', 'typescript'],
  authors: [{ name: 'Developer' }],
  creator: 'Developer',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
