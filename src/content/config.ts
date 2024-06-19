import { defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { Covenant } from '@schemas/generalsSchema';
import { Speciality } from '@schemas/specialitySchema';
import { Book } from '@schemas/bookSchemas';
import { artTreasureSchema } from '@schemas/treasureSchemas';
import { BlazonSetSchema } from '@schemas/blazonSchemas';
import { GeneralElement } from '@schemas/generalsSchema';
import { ConflictDatum } from '@schemas/conflictSchemas';

export const collections = {
  art: defineCollection({ type: 'data', schema: artTreasureSchema }),
  blazons: defineCollection({ type: 'data', schema: BlazonSetSchema }),
  covenants: defineCollection({ type: 'data', schema: Covenant }),
  docs: defineCollection({ schema: docsSchema() }),
  generalConflictData: defineCollection({
    type: 'data',
    schema: ConflictDatum,
  }),
  generals: defineCollection({ type: 'data', schema: GeneralElement }),
  i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
  skillbooks: defineCollection({ type: 'data', schema: Book }),
  specialities: defineCollection({ type: 'data', schema: Speciality }),
  tools: defineCollection({ schema: docsSchema()})
};
