// JSON-LD structured data generators for SEO / GEO / AEO / AIO

const SITE_URL = "https://modulas.in";

export interface ProductSchemaInput {
  name: string;
  description: string;
  image: string[];
  price: number;
  currency: string;
  sku: string;
  brand: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  reviewCount?: number;
  ratingValue?: number;
  url: string;
}

export function generateProductSchema(product: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: product.url,
    },
    ...(product.reviewCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.ratingValue,
        reviewCount: product.reviewCount,
      },
    }),
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateCollectionSchema({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    provider: {
      "@type": "Organization",
      name: "Modulas",
      url: SITE_URL,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Modulas",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-full-dark.png`,
      width: 200,
      height: 60,
    },
    foundingDate: "2020",
    description:
      "A contemporary luxury furniture studio designing and crafting bespoke modular furniture for Indian homes. Specialists in modular kitchens, wardrobes, living and bedroom furniture.",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    sameAs: [
      "https://instagram.com/modulas.in",
      "https://pinterest.com/modulas_in",
      "https://linkedin.com/company/modulas-in",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@modulas.in",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@modulas.in",
      },
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FurnitureStore"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Modulas",
    image: `${SITE_URL}/og-homepage.jpg`,
    url: SITE_URL,
    telephone: "+91-124-000-0000",
    email: "hello@modulas.in",
    priceRange: "₹₹₹",
    description:
      "Luxury bespoke furniture studio in Gurgaon, India. Modular kitchens, wardrobes, and custom furniture designed for Indian homes. 850+ projects completed.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 44",
      addressLocality: "Gurgaon",
      addressRegion: "Haryana",
      postalCode: "122003",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.4595,
      longitude: 77.0266,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "850",
      bestRating: "5",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Modulas",
    url: SITE_URL,
    description:
      "Bespoke luxury furniture platform — modular kitchens, wardrobes, and custom furniture crafted in India.",
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateServiceSchema({
  name,
  description,
  url,
  category,
}: {
  name: string;
  description: string;
  url: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    category,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "India" },
    serviceType: "Interior Design & Furniture",
  };
}
