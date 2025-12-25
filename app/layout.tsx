import type { Metadata } from 'next'
import Script from 'next/script'
import { CurrencyProvider } from '@/components/CurrencyContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://riaddisiena.com"),
  title: {
    default: "Riad di Siena | A House in Marrakech Medina",
    template: "%s | Riad di Siena",
  },
  description: "A 300-year-old house in the heart of Marrakech medina. Not a hotel—a home with soul.",
  keywords: ["riad", "marrakech", "medina", "guesthouse", "morocco", "boutique accommodation", "traditional house"],
  authors: [{ name: "Riad di Siena" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://riaddisiena.com",
    siteName: "Riad di Siena",
    title: "Riad di Siena | A House in Marrakech Medina",
    description: "A 300-year-old house in the heart of Marrakech medina. Not a hotel—a home with soul.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Riad di Siena - Traditional Moroccan Guesthouse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riad di Siena | A House in Marrakech Medina",
    description: "A 300-year-old house in the heart of Marrakech medina. Not a hotel—a home with soul.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: "https://riaddisiena.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V48C7J04GJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V48C7J04GJ');
          `}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "name": "Riad di Siena",
            "description": "A 300-year-old traditional Moroccan guesthouse in the heart of Marrakech medina.",
            "url": "https://riaddisiena.com",
            "telephone": "+212-XXX-XXXXXX",
            "email": "happy@riaddisiena.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "35 Derb Fhal Zfriti, Kennaria",
              "addressLocality": "Marrakech",
              "postalCode": "40000",
              "addressCountry": "MA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "31.6295",
              "longitude": "-7.9811"
            },
            "priceRange": "€€",
            "starRating": {
              "@type": "Rating",
              "ratingValue": "4.5"
            },
            "amenityFeature": [
              { "@type": "LocationFeatureSpecification", "name": "Free WiFi" },
              { "@type": "LocationFeatureSpecification", "name": "Air Conditioning" },
              { "@type": "LocationFeatureSpecification", "name": "Rooftop Terrace" },
              { "@type": "LocationFeatureSpecification", "name": "Traditional Breakfast" }
            ]
          })}
        </Script>
      </head>
      <body>
        <CurrencyProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  )
}
