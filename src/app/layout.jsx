import Script from "next/script";
import { Fira_Sans, BBH_Bogle } from 'next/font/google';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CrisisBanner from "@/components/CrisisBanner";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import "./globals.css";

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fira-sans',
  display: 'swap',
  preload: true,
});

const bbhBogle = BBH_Bogle({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bbh-bogle',
  display: 'swap',
  preload: true,
});

export const metadata = {
  metadataBase: new URL('https://flareinitiative.org'),
  title: {
    default: 'The Flare Initiative | First Responder Suicide Prevention',
    template: '%s | The Flare Initiative'
  },
  description: 'Breaking the silence on first responder suicide through data-driven prevention and national visibility in Canada.',
  keywords: ['first responder', 'suicide prevention', 'mental health', 'Canada', 'firefighter', 'police', 'EMS', 'paramedic', 'dispatcher'],
  openGraph: {
    title: 'The Flare Initiative | National First Responder Suicide Data Initiative',
    description: 'Creating the visibility needed to drive evidence-based prevention and reduce stigma around mental health.',
    url: 'https://flareinitiative.org',
    siteName: 'The Flare Initiative',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Flare Initiative',
    description: 'National First Responder Suicide Data Initiative - Breaking the silence through data-driven prevention.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${firaSans.variable} ${bbhBogle.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        )}
      </head>
      <body className="min-h-dvh flex flex-col">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="lazyOnload" />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <Script id="visit-tracker" strategy="afterInteractive">
          {`fetch('/api/visit').catch(()=>{})`}
        </Script>
        <CrisisBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}