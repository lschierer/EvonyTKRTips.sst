import { reference, z as zod } from 'astro:content';

import { GeneralClass } from './generalsSchema';
import { Speciality } from './specialitySchema';
import { Book, specialSkillBook, standardSkillBook } from './bookSchemas';

export const ExtendedGeneralStatus = zod.enum([
  'created',
  'fetching',
  'processing',
  'complete',
]);
export type ExtendedGeneralStatusType = zod.infer<typeof ExtendedGeneralStatus>;

export const RankInstance = zod.object({
  EvAnsRanking: zod.number(),
  AttackRanking: zod.number(),
  ToughnessRanking: zod.number(),
});
export type RankInstanceType = zod.infer<typeof RankInstance>;

export const ExtendedGeneral = GeneralClass.extend({
  specialities: zod.array(Speciality),
  books: zod.array(Book)
})

export type ExtendedGeneralType = zod.infer<typeof ExtendedGeneral>;

export const GeneralPair = zod.object({
  primary: ExtendedGeneral,
  secondary: ExtendedGeneral,
});

export type GeneralPairType = zod.infer<typeof GeneralPair>;
