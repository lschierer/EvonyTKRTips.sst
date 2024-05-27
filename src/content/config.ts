import {  defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { Covenant } from '@schemas/generalsSchema';
import { Speciality } from '@schemas/specialitySchema';
import { artTreasureSchema } from '@schemas/treasureSchemas';
import { BlazonSetSechma } from '@schemas/blazonSchemas';
import { GeneralElement } from '@schemas/generalsSchema';
import { ConflictDatum } from '@schemas/conflictSchemas';

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
