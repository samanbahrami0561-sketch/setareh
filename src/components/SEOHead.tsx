import React, { useEffect } from 'react';
import { Product } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  product?: Product | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, product }) => {
  useEffect(() => {
    // 1. Dynamic Title
    if (product) {
      document.title = `خرید ${product.persianName} (اقساطی) | موبایل ستاره مبارکه`;
    } else if (title) {
      document.title = `${title} | موبایل ستاره مبارکه`;
    } else {
      document.title = 'موبایل ستاره | مرکز تخصصی خرید اقساطی و فروشگاه موبایل مبارکه';
    }

    // 2. Dynamic Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (product) {
        metaDesc.setAttribute(
          'content',
          `خرید آنلاین و اقساطی ${product.persianName} (${product.name}) با بهترین قیمت ${product.priceToman.toLocaleString('fa-IR')} تومان. مشخصات: ${product.specs.processor || ''}، ${product.specs.screen || ''}، گارانتی اصلی در موبایل ستاره مبارکه.`
        );
      } else if (description) {
        metaDesc.setAttribute('content', description);
      }
    }

    // 3. Dynamic Product JSON-LD Schema Insertion
    let scriptTag: HTMLScriptElement | null = document.getElementById('product-jsonld-schema') as HTMLScriptElement;

    if (product) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'product-jsonld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.persianName,
        'alternateName': product.name,
        'image': [product.image, ...(product.images360 || [])],
        'description': `خرید اقساطی ${product.persianName} با گارانتی معتبر در مبارکه اصفهان`,
        'sku': product.id,
        'mpn': product.id,
        'brand': {
          '@type': 'Brand',
          'name': product.brand
        },
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'IRR',
          'price': product.priceToman * 10, // Toman to Rial conversion
          'priceValidUntil': '2026-12-31',
          'itemCondition': (product.category as string) === 'used' ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
          'availability': (product.stock !== undefined && product.stock <= 0) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          'seller': {
            '@type': 'Organization',
            'name': 'موبایل ستاره مبارکه'
          }
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': product.rating || 4.8,
          'reviewCount': product.reviewsCount || 12,
          'bestRating': '5',
          'worstRating': '1'
        }
      };

      scriptTag.textContent = JSON.stringify(productSchema);
    } else {
      if (scriptTag) {
        scriptTag.remove();
      }
    }

    return () => {
      // Clean up dynamic title on unmount
      if (product) {
        document.title = 'موبایل ستاره | مرکز تخصصی خرید اقساطی و فروشگاه موبایل مبارکه';
      }
    };
  }, [title, description, product]);

  return null;
};
