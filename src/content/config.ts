import { defineCollection } from 'astro:content';
import {docsSchema, monsterSchema} from '../schemas/evonySchemas';

const docsCollection = defineCollection({
  schema: docsSchema,
});

const monsterReports = defineCollection({
  schema: monsterSchema,
});

export const collections = {
  docs: docsCollection,
  killing: monsterReports,
};

