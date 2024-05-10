import {  defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import {
  Covenant,
  artTreasureSchema,
  BlazonSetSechma,
  GeneralElement,
  ConflictDatum,
  Speciality,
} from '../schemas/index';

export const collections = {
  covenants: defineCollection({type: 'data', schema: Covenant}),
  docs: defineCollection({ schema: docsSchema() }),
  specialities: defineCollection({type: 'data', schema: Speciality}),
  i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
  art: defineCollection({type: 'data', schema: artTreasureSchema}),
  blazons: defineCollection({type: 'data', schema: BlazonSetSechma}),
  generals: defineCollection({type: 'data', schema: GeneralElement}),
  generalConflictData: defineCollection(({type: 'data', schema: ConflictDatum})),
};
