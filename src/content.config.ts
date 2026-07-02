import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    lang: z.enum(['en', 'fr']),
    category: z.string(),
    relatedCalculator: z.string(),
    coverImage: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
