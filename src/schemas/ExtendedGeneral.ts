import {z as zod} from 'zod';

import { GeneralClass } from "./generalsSchema";
import { Speciality } from "./specialitySchema";
import { Book, specialSkillBook, standardSkillBook } from "./bookSchemas";

export const ExtendedGeneralStatus = zod.enum([
  'created',
  'fetching',
  'processing',
  'complete'
])
export type ExtendedGeneralStatusType = zod.infer<typeof ExtendedGeneralStatus>;

export const RankInstance = zod.object({
  EvAnsRanking: zod.number(),
  AttackRanking: zod.number(),
  ToughnessRanking: zod.number(),
})
export type RankInstanceType = zod.infer<typeof RankInstance>;

export const ExtendedGeneral = zod.object({
  general: GeneralClass,
  specialities: zod.array(Speciality),
  books: zod.array(zod.union([Book, specialSkillBook,standardSkillBook])),
})

export type ExtendedGeneralType = zod.infer<typeof ExtendedGeneral>;

export const GeneralPair = zod.object({
  primary: zod.string(),
  secondary: zod.string(),
  rankings: RankInstance,
});

export type GeneralPairType = zod.infer<typeof GeneralPair>;
