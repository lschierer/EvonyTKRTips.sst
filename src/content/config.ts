import { z, defineCollection } from 'astro:content';
import {docsSchema, monsterSchema} from '../schemas/evonySchemas';

const docsCollection = defineCollection({
  schema: docsSchema,
});

const monsterReports = defineCollection({
  schema: monsterSchema,
});

const legacyReports = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    sortOrder: z.number().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
  legacyReports: legacyReports,
};

