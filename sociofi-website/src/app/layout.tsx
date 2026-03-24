import type { Metadata } from 'next';
// Only load fonts that are actually referenced by CSS variables.
// Plus_Jakarta_Sans, Inter, and Space_Grotesk were loaded but never used —
// removing them saves 3 network requests + parse time on every page load.
import { Fira_Code, Syne, Outfit } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/shared/JsonLd';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { ToastProvider } from '@/components/shared/Toast';
import ScrollToTop from '@/components/shared/ScrollToTop';
import '../styles/globals.css';
import '../styles/animations.css';
import '../styles/responsive.css';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-fira',
  display: 'swap',
  preload: false, // mono font — not on critical path; load after main fonts
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sociofitechnology.com'),
  title: {
    default: 'SocioFi Technology — AI-Agent-Native Software Development',
    template: '%s — SocioFi Technology',
  },
  description: 'SocioFi Technology builds production-ready software using AI agents and expert engineers. From prototype to product in weeks — not months. Studio, Agents, Academy, Cloud, Ventures, Labs, Services.',
  keywords: [
    'AI software development',
    'AI agent development company',
    'custom software development',
    'software development company Bangladesh',
    'AI-native development',
    'prototype to production',
    'SocioFi Technology',
    'AI engineering team',
    'software development for founders',
    'no-code to production',
  ],
  authors: [
    { name: 'Arifur Rahman', url: 'https://sociofitechnology.com/about' },
    { name: 'Kamrul Hasan', url: 'https://sociofitechnology.com/about' },
  ],
  creator: 'SocioFi Technology',
  publisher: 'SocioFi Technology',
  category: 'Software Development',
  openGraph: {
    title: 'SocioFi Technology — AI-Agent-Native Software Development',
    description: 'SocioFi Technology builds production-ready software using AI agents and expert engineers. From prototype to product in weeks.',
    type: 'website',
    url: 'https://sociofitechnology.com',
    siteName: 'SocioFi Technology',
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Technology — AI-Agent-Native Software Development' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Technology — AI-Agent-Native Software Development',
    description: 'From prototype to product in weeks. AI agents build. Human engineers architect. You scale.',
  },
  // favicon handled by src/app/icon.svg (Next.js App Router file convention)
  // apple-touch icon handled by src/app/apple-icon.svg if added later
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
  alternates: {
    canonical: 'https://sociofitechnology.com',
  },
  other: {
    // iOS Safari address bar tint + Android Chrome toolbar color
    'theme-color': '#0C0C1D',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaCode.variable} ${syne.variable} ${outfit.variable}`}>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LoadingScreen />
          <ToastProvider>
            <a href="#main-content" className="skip-to-content">Skip to content</a>
            <main id="main-content">
              {children}
            </main>
            <ScrollToTop />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
