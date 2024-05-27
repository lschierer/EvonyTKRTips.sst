import {z} from 'zod';

import { GeneralClass } from "./generalsSchema";
import { Speciality } from "./specialitySchema";
import { Book, specialSkillBook, standardSkillBook } from "./bookSchemas";

export const ExtendedGeneralStatus = z.enum([
  'created',
  'fetching',
  'processing',
  'complete'
])
export type ExtendedGeneralStatusType = z.infer<typeof ExtendedGeneralStatus>;

export const ExtendedGeneral = z.object({
  general: GeneralClass,
  specialities: z.array(Speciality),
  books: z.array(z.union([Book, specialSkillBook,standardSkillBook])),
  computedBuffs: z.map(z.string(),z.object({
    EvAns: z.number(),
    AttackRank: z.number(),
    DefenseRank: z.number(),
  })),
  status: ExtendedGeneralStatus.default(ExtendedGeneralStatus.enum.created),
})

export type ExtendedGeneralType = z.infer<typeof ExtendedGeneral>;

export const ExtendedGeneralSet = z.set(ExtendedGeneral);
export type ExtendedGeneralSetType = z.infer<typeof ExtendedGeneralSet>;

export const GeneralPair = z.object({
  primary: z.string(),
  secondary: z.string(),
  EvAnsRanking: z.number(),
  AttackRanking: z.number(),
  DefenseRanking: z.number(),
});

export type GeneralPairType = z.infer<typeof GeneralPair>;
