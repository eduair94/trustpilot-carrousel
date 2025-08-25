import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Trustpilot Reviews Carousel | Open Source iframe Widget',
  description: 'An elegant, embeddable iframe widget for displaying Trustpilot customer reviews in carousel format. Open source NPM package with React and vanilla JS support.',
  keywords: ['trustpilot', 'reviews', 'carousel', 'iframe', 'widget', 'npm', 'react', 'open source'],
  authors: [{ name: 'Eduardo Airaldi', url: 'https://linkedin.com/in/eduardo-airaudo' }],
  creator: 'Eduardo Airaldi',
  publisher: 'Eduardo Airaldi',
  openGraph: {
    title: 'Trustpilot Reviews Carousel | Open Source iframe Widget',
    description: 'An elegant, embeddable iframe widget for displaying Trustpilot customer reviews in carousel format.',
    url: 'https://trustpilot.checkleaked.com',
    siteName: 'Trustpilot Reviews Carousel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trustpilot Reviews Carousel',
    description: 'Open source iframe widget for Trustpilot reviews',
    creator: '@eduair94',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
