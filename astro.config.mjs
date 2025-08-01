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
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx()
  ],
  output: 'static',
  adapter: netlify(),
});