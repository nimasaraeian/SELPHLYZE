export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Selphlyze",
    "description": "AI-Powered Psychology & Self-Analysis Platform",
    "url": "https://selphlyze.com",
    "author": {
      "@type": "Person",
      "name": "Nima Saraeian",
      "jobTitle": "AI Psychology Researcher",
      "affiliation": {
        "@type": "Organization",
        "name": "Selphlyze"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Selphlyze",
      "logo": {
        "@type": "ImageObject",
        "url": "https://selphlyze.com/image/SELPHLYZE_LOGO.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://selphlyze.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://linkedin.com/in/nimasaraeian"
    ],
    "mainEntity": {
      "@type": "WebApplication",
      "name": "Selphlyze Psychology Tests",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
