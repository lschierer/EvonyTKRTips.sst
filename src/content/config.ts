import { defineCollection } from 'astro:content';
import {docsSchema} from '../schemas/docsSchema';

const docsCollection = defineCollection({
  schema: docsSchema,
});

export const collections = {
  docs: docsCollection,
};

