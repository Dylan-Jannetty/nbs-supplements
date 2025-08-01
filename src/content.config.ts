import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.object({
      name: z.string(),
      title: z.string(),
      bio: z.string(),
      avatar: z.string().optional(),
    }),
    category: z.enum([
      'Supplements',
      'Nutrition',
      'Fitness',
      'Research',
      'Industry Insights',
      'Product Education'
    ]),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    featuredImage: z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    }),
    excerpt: z.string(),
    readingTime: z.number().optional(), // in minutes
    seoKeywords: z.array(z.string()).optional(),
    relatedProducts: z.array(z.string()).optional(), // Product slugs
    tableOfContents: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
};