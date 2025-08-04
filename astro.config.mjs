// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://supplements-nbs.com',
  image: {
    // Enable image optimization for better performance
    service: {
      // Use Sharp for image processing (requires sharp dependency)
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['supplements-nbs.com'],
    formats: ['avif', 'webp', 'jpeg'],
    // Cache for 1 year in production
    cacheDir: './.astro/assets',
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      customPages: [
        'https://supplements-nbs.com/products/catalyst',
        'https://supplements-nbs.com/about',
        'https://supplements-nbs.com/contact',
        'https://supplements-nbs.com/blog'
      ],
      filter: (page) => {
        // Exclude admin pages and development files
        return !page.includes('/admin/') && 
               !page.includes('/.netlify/') &&
               !page.includes('/dist/') &&
               !page.includes('/_astro/');
      },
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Custom function to set priorities for different page types
      serialize(item) {
        // Set custom priorities based on page importance
        if (item.url.endsWith('/')) {
          // Homepage
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/products/')) {
          // Product pages
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          // Blog posts
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/about') || item.url.includes('/contact')) {
          // Static pages
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        return item;
      }
    }),
    mdx()
  ],
  output: 'static',
  adapter: netlify(),
});