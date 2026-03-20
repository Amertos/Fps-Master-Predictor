import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' });

export const viewport: Viewport = {
  themeColor: '#00FF41',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: 'FPS Master Predictor | Izračunaj FPS za svaki PC i Igru',
    template: '%s | FPS Master Predictor'
  },
  description: 'Saznaj i predvidi kako će igrice raditi na tvom kompjuteru. Izračunaj FPS (sličice u sekundi), prepoznaj CPU i GPU bottleneck i optimizuj svoj računar za gaming.',
  keywords: ['fps', 'kalkulator', 'igrice', 'gaming', 'pc komponente', 'pc build', 'bottleneck kalkulator', 'racunari', 'predvidjanje fps', 'frame rate', 'rtx', 'amd', 'ryzen'],
  authors: [{ name: 'FPS Master' }],
  creator: 'FPS Master',
  publisher: 'FPS Master',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'FPS Master Predictor - Kalkulator za PC preformanse',
    description: 'Besplatan alat za testiranje kako će tvoj PC pokretati najnovije video igre. Proveri FPS i pronađi usko grlo (bottleneck).',
    url: 'https://fps-master-predictor.com', // Napomena: zamenite domen ako imate pravi
    siteName: 'FPS Master Predictor',
    images: [
      {
        url: 'https://i.ibb.co/1n5b0ZQ/fps-og-image.webp', // Placeholder/Stock slika
        width: 1200,
        height: 630,
        alt: 'FPS Master Predictor Prikaz',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FPS Master Predictor',
    description: 'Proveri FPS i pronađi usko grlo (bottleneck) na tvom računaru za odabranu igru.',
    images: ['https://i.ibb.co/1n5b0ZQ/fps-og-image.webp'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://fps-master-predictor.com',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FPS Master Predictor',
    url: 'https://fps-master-predictor.com',
    description: 'Saznaj i predvidi kako će igrice raditi na tvom kompjuteru. Izračunaj FPS i detektuj bottleneck.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Windows, macOS, Linux, Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'FPS Master',
    },
  };

  return (
    <html lang="sr" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
