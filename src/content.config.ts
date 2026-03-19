import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['course', 'paper', 'project']).default('course'),
    tags: z.array(z.string()).default([]),
    link: z.string().url().optional(),
    featured: z.boolean().default(false)
  })
});

export const collections = { notes };
