import {  defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import {artTreasureSchema,BlazonSetSechma, generalSchema} from '../schemas/evonySchemas.js';

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
  art: defineCollection({type: 'data', schema: artTreasureSchema}),
  blazons: defineCollection({type: 'data', schema: BlazonSetSechma}),
  generals: defineCollection({type: 'data', schema: generalSchema}),
};
