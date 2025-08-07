/**
 * Comprehensive structured data generator for NBS Supplements
 * Implements Schema.org markup for SEO optimization
 */

interface BaseSchema {
  '@context': string;
  '@type': string;
}

interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  description: string;
  founder?: {
    '@type': 'Person';
    name: string;
  };
  foundingDate?: string;
  address?: {
    '@type': 'PostalAddress';
    addressRegion: string;
    addressCountry: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    contactType: string;
  };
  sameAs?: string[];
}

interface ProductSchema extends BaseSchema {
  '@type': 'Product';
  name: string;
  image: string[];
  description: string;
  brand: {
    '@type': 'Brand';
    name: string;
  };
  manufacturer?: {
    '@type': 'Organization';
    name: string;
    description?: string;
  };
  offers: {
    '@type': 'Offer';
    url: string;
    priceCurrency: string;
    price: string;
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
  review?: Array<{
    '@type': 'Review';
    reviewRating: {
      '@type': 'Rating';
      ratingValue: string;
    };
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewBody: string;
  }>;
  nutrition?: {
    '@type': 'NutritionInformation';
    servingSize: string;
  };
}

interface ArticleSchema extends BaseSchema {
  '@type': 'Article';
  headline: string;
  image: string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  description: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

interface FAQSchema extends BaseSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

interface LocalBusinessSchema extends BaseSchema {
  '@type': 'LocalBusiness';
  name: string;
  image: string;
  description: string;
  url: string;
  telephone?: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  sameAs?: string[];
}

interface BreadcrumbSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export class StructuredDataGenerator {
  private static readonly BASE_URL = 'https://supplements-nbs.com';
  private static readonly SCHEMA_CONTEXT = 'https://schema.org';

  /**
   * Generate Organization schema for NBS Supplements
   */
  static generateOrganizationSchema(): OrganizationSchema {
    return {
      '@context': this.SCHEMA_CONTEXT,
      '@type': 'Organization',
      name: 'NBS Supplements',
      alternateName: 'No Bullsh*t Supplements',
      url: this.BASE_URL,
      logo: `${this.BASE_URL}/images/logo.png`,
      description: 'Clean, natural supplements formulated by pharmacists. Clinically dosed ingredients, third-party tested, and completely transparent.',
      founder: {
        '@type': 'Person',
        name: 'NBS Pharmacist Team'
      },
      foundingDate: '2023',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'NJ',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service'
      },
      sameAs: [
        'https://www.instagram.com/nbssupplements/',
        'https://www.facebook.com/nbssupplements/'
      ]
    };
  }

  /**
   * Generate Product schema for Catalyst pre-workout
   */
  static generateCatalystProductSchema(): ProductSchema {
    return {
      '@context': this.SCHEMA_CONTEXT,
      '@type': 'Product',
      name: 'Catalyst Pre-Workout',
      image: [
        `${this.BASE_URL}/images/catalyst-front.webp`,
        `${this.BASE_URL}/images/catalyst-stacked.png`
      ],
      description: 'Clean, pharmacist-formulated pre-workout with clinical doses of creatine, L-citrulline, and natural energy boosters. No artificial additives or fillers.',
      brand: {
        '@type': 'Brand',
        name: 'NBS Supplements'
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'NBS Supplements',
        description: 'Pharmacist-formulated natural supplements'
      },
      offers: {
        '@type': 'Offer',
        url: 'https://gumroad.com/l/nbs-catalyst',
        priceCurrency: 'USD',
        price: '39.99',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'NBS Supplements'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127'
      },
      nutrition: {
        '@type': 'NutritionInformation',
        servingSize: '1 scoop (15g)'
      },
      review: [
        {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5'
          },
          author: {
            '@type': 'Person',
            name: 'Sarah M.'
          },
          reviewBody: 'Finally, a pre-workout that doesn\'t make me crash. The pharmacist formulation really shows - clean energy without the jitters.'
        },
        {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5'
          },
          author: {
            '@type': 'Person',
            name: 'Marcus R.'
          },
          reviewBody: 'As a nurse, I appreciate the transparency in ingredients. No hidden blends, just clinical doses of proven compounds.'
        }
      ]
    };
  }

  /**
   * Generate Article schema for blog posts
   */
  static generateArticleSchema(article: {
    title: string;
    description: string;
    publishDate: string;
    author: string;
    slug: string;
    image?: string;
  }): ArticleSchema {
    return {
      '@context': this.SCHEMA_CONTEXT,
      '@type': 'Article',
      headline: article.title,
      image: [article.image || `${this.BASE_URL}/images/blog-default.jpg`],
      datePublished: article.publishDate,
      dateModified: article.publishDate,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'NBS Supplements',
        logo: {
          '@type': 'ImageObject',
          url: `${this.BASE_URL}/images/logo.png`
        }
      },
      description: article.description,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.BASE_URL}/blog/${article.slug}`
      }
    };
  }

  /**
   * Generate FAQ schema for contact and product pages
   */
  static generateContactFAQSchema(): FAQSchema {
    return {
      '@context': this.SCHEMA_CONTEXT,
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long does shipping take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We ship all orders within 1-2 business days. Standard shipping takes 3-5 business days, and expedited shipping options are available at checkout.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are your supplements third-party tested?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, all NBS supplements are third-party tested for purity, potency, and safety. We provide certificates of analysis for every batch.'
          }
        },
        {
          '@type': 'Question',
          name: 'What makes NBS supplements different?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our supplements are formulated by licensed pharmacists using clinically dosed ingredients. We use only natural flavors and sweeteners with complete transparency in our formulations.'
          }
        },
        {
          '@type': 'Question',
          name: 'Do you offer a money-back guarantee?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we offer a 30-day money-back guarantee on all products. If you\'re not satisfied, contact us for a full refund.'
          }
        }
      ]
    };
  }

  /**
   * Generate LocalBusiness schema for contact page
   */
  static generateLocalBusinessSchema(): LocalBusinessSchema {
    return {
      '@context': this.SCHEMA_CONTEXT,
      '@type': 'LocalBusiness',
      name: 'NBS Supplements',
      image: `${this.BASE_URL}/images/logo.png`,
      description: 'Pharmacist-formulated natural supplements with clinical dosing and third-party testing.',
      url: this.BASE_URL,
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'NJ',
        addressCountry: 'US'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00'
        }
      ],
      sameAs: [
        'https://www.instagram.com/nbssupplements/',
        'https://www.facebook.com/nbssupplements/'
      ]
    };
  }


  /**
   * Generate combined schema for homepage
   */
  static generateHomepageSchema() {
    return {
      '@context': this.SCHEMA_CONTEXT,
      '@graph': [
        this.generateOrganizationSchema(),
        this.generateCatalystProductSchema()
      ]
    };
  }
}