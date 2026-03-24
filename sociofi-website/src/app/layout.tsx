import type { Metadata } from 'next';
// Only load fonts that are actually referenced by CSS variables.
// Plus_Jakarta_Sans, Inter, and Space_Grotesk were loaded but never used —
// removing them saves 3 network requests + parse time on every page load.
import { Fira_Code, Manrope, DM_Sans, JetBrains_Mono, Syne, Outfit } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/shared/JsonLd';
import LoadingScreen from '@/components/shared/LoadingScreen';
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

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jb-mono',
  display: 'swap',
  preload: false, // mono font — not on critical path
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
  description: 'SocioFi Technology builds production-ready software using AI agents, expert human engineers, and a proven process. From prototype to product in weeks.',
  openGraph: {
    title: 'SocioFi Technology — AI-Agent-Native Software Development',
    description: 'SocioFi Technology builds production-ready software using AI agents, expert human engineers, and a proven process.',
    type: 'website',
    url: 'https://sociofitechnology.com',
    siteName: 'SocioFi Technology',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Technology' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://sociofitechnology.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaCode.variable} ${manrope.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${syne.variable} ${outfit.variable}`}>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LoadingScreen />
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          <main id="main-content">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
