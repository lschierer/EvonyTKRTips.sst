import {  defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import {
  artTreasureSchema,
  BlazonSetSechma,
  GeneralElement,
  generalConflicts,
  Speciality,
} from '../schemas/index.js';

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  specialities: defineCollection({type: 'data', schema: Speciality}),
  i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
  art: defineCollection({type: 'data', schema: artTreasureSchema}),
  blazons: defineCollection({type: 'data', schema: BlazonSetSechma}),
  generals: defineCollection({type: 'data', schema: GeneralElement}),
  generalConflictData: defineCollection(({type: 'data', schema: generalConflicts})),
};
