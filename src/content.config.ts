import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const storiesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/stories" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    pubDate: z.date(),
    theme: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

export const collections = {
  'stories': storiesCollection,
};
