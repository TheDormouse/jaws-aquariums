import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.jawsaquariums.com'),
  title: {
    default: 'JAWS Aquariums | Custom Luxury Aquarium Design & Installation | Atlanta',
    template: '%s | JAWS Aquariums'
  },
  description: 'Atlanta\'s premier custom aquarium design and installation since 1989. Bespoke aquatic ecosystems for corporate offices, healthcare facilities, and luxury residences. Expert craftsmanship meets artistic vision.',
  keywords: [
    'custom aquariums',
    'luxury aquarium design',
    'aquarium installation Atlanta',
    'corporate aquarium',
    'hospital aquarium',
    'dental office aquarium',
    'custom fish tank',
    'aquarium maintenance',
    'aquatic ecosystems',
    'Just Add Water',
    'JAWS Aquariums',
    'Atlanta aquarium company',
    'bespoke aquariums',
    'water features',
    'artistic ponds'
  ],
  authors: [{ name: 'Just Add Water Services' }],
  creator: 'Just Add Water Services',
  publisher: 'Just Add Water Services',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jawsaquariums.com',
    siteName: 'JAWS Aquariums',
    title: 'JAWS Aquariums | Custom Luxury Aquarium Design & Installation',
    description: 'Transform your space with bespoke aquatic ecosystems. Atlanta\'s premier custom aquarium design and installation since 1989.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JAWS Aquariums | Custom Luxury Aquarium Design',
    description: 'Transform your space with bespoke aquatic ecosystems. Atlanta\'s premier custom aquarium design since 1989.',
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
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://www.jawsaquariums.com',
  },
  category: 'business',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a1628' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1628' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  // JSON-LD structured data for local business SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.jawsaquariums.com',
    name: 'Just Add Water - JAWS Aquariums',
    image: 'https://www.jawsaquariums.com/opengraph-image',
    description: 'Atlanta\'s premier custom aquarium design and installation company since 1989. Specializing in bespoke aquatic ecosystems for corporate offices, healthcare facilities, and luxury residences.',
    url: 'https://www.jawsaquariums.com',
    telephone: '+1-770-380-1020',
    email: 'jawservice@earthlink.net',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.749,
      longitude: -84.388,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 33.749,
        longitude: -84.388,
      },
      geoRadius: '100000',
    },
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    sameAs: [],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Aquarium Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Aquarium Design',
            description: 'Bespoke aquarium design tailored to your space and vision',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Aquarium Installation',
            description: 'Professional installation using state-of-the-art equipment',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Aquarium Maintenance',
            description: 'Ongoing maintenance including water changes and feeding',
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Playfair Display for headings, Raleway for body */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
