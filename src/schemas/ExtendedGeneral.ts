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

export const ExtendedGeneral = zod.object({
  general: GeneralClass,
  specialities: zod.array(Speciality),
  books: zod.array(zod.union([Book, specialSkillBook,standardSkillBook])),
  computedBuffs: zod.map(zod.string(),zod.object({
    EvAns: zod.number(),
    AttackRank: zod.number(),
    DefenseRank: zod.number(),
  })),
  status: ExtendedGeneralStatus.default(ExtendedGeneralStatus.enum.created),
})

export type ExtendedGeneralType = zod.infer<typeof ExtendedGeneral>;

export const ExtendedGeneralSet = zod.set(ExtendedGeneral);
export type ExtendedGeneralSetType = zod.infer<typeof ExtendedGeneralSet>;

export const GeneralPair = zod.object({
  primary: zod.string(),
  secondary: zod.string(),
  EvAnsRanking: zod.number(),
  AttackRanking: zod.number(),
  DefenseRanking: zod.number(),
});

export type GeneralPairType = zod.infer<typeof GeneralPair>;
