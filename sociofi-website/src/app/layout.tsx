import type { Metadata } from 'next';
import { Syne, Outfit, Fira_Code } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import '../styles/animations.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-fira',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SocioFi Technology — AI-Agent-Native Software Development',
  description: 'SocioFi Technology builds production-ready software using AI agents, expert human engineers, and a proven process. From prototype to product in weeks.',
  openGraph: {
    title: 'SocioFi Technology — AI-Agent-Native Software Development',
    description: 'SocioFi Technology builds production-ready software using AI agents, expert human engineers, and a proven process.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${outfit.variable} ${firaCode.variable}`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          <main id="main-content">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
