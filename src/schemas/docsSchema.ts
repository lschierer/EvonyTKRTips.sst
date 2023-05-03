import { z, defineCollection } from 'astro:content';

export const docsSchema = z.object({
  title: z.string(),
  author: z.string().default('Anonymous'),
  sortOrder: z.number().optional(),
  date: z.date().optional(),
});