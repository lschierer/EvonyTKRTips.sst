import {z} from "astro:content";

import * as b from './baseSchemas';

import {Book, specialSkillBook, standardSkillBook, } from './bookSchemas';
import { Speciality } from "./specialitySchema";

export const generalRole = z.enum(['primary','secondary']);
export type generalRoleType = z.infer<typeof generalRole>;
export  const generalSpecialists = z.enum([
  ...b.ClassEnum.options,
  "Wall",
  "Mayor"
]);
export type generalSpecialistsType = z.infer<typeof generalSpecialists>;

export const generalUseCase = z.enum([
    "all",
    "Monsters",
    "Attack",
    "Defense",
    "Overall",
    "Wall",
    "Mayor"
  ]);

export type generalUseCaseType = z.infer<typeof generalUseCase>;

export const Display = z.enum([
  "primary",
  "assistant",
  "summary",
]);
export type DisplayType = z.infer<typeof Display>;

export const Note = z.object({
    "text": z.string(),
    "severity": b.syslogSeverity,
});
export type NoteType = z.infer<typeof Note>;

export const Ascending = z.object({
    "level": b.AscendingLevels,
    "buff": z.array(b.Buff),
});
export type AscendingType = z.infer<typeof Ascending>;

export const totalBuffs = z.object({
    attack: z.number(),
    defense: z.number(),
    hp: z.number(),
    march: z.number(),
});
export type totalBuffsType = z.infer<typeof totalBuffs>;

export const GeneralClass = z.object({
    "name": z.string(),
    "display": Display.optional(),
    "leadership": z.number(),
    "leadership_increment": z.number(),
    "attack": z.number(),
    "attack_increment": z.number(),
    "defense": z.number(),
    "defense_increment": z.number(),
    "politics": z.number(),
    "politics_increment": z.number(),
    "level": b.levels,
    "stars": b.levels.refine((l) => {
        if(l !== null && l !== undefined ) {
          switch (l) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '10':
              return true;
            default:
              return false;
          }
        }
        return false;
      }).nullish(),
    "score_as": generalSpecialists.optional(),
    "specialities": z.array(z.string()).nullish(),
    "books": z.array(z.string()).nullish(),
    "ascending": z.array(Ascending).nullish(),
    "note": z.array(Note).nullish(),
    "totalBuffs": totalBuffs.nullish(),
});
export type GeneralClassType = z.infer<typeof GeneralClass>;

export const GeneralElement = z.object({
    "general": GeneralClass,
});
export type GeneralElementType = z.infer<typeof GeneralElement>;

export const GeneralArray = z.array(GeneralElement);
export type GeneralArrayType = z.infer<typeof GeneralArray>;

export const GeneralPair = z.object({
    primary: z.string(),
    secondary: z.string(),
});

export type GeneralPairType = z.infer<typeof GeneralPair>;

export const CovenantAttributeCategory = z.enum([
  "War Covenant",
  "Cooperation Covenant",
  "Peace Covenant",
  "Faith Covenant",
  "Honor Covenant",
  "Civilization Covenant",
])

export type CovenantAttributeCategoryType = z.infer<typeof CovenantAttributeCategory>;

export const CovenantAttribute = z.object({
  "category": CovenantAttributeCategory,
  "type": z.enum(['personal','passive']),
  "buff": z.array(b.Buff),
});

export type CovenantAttributeType = z.infer<typeof CovenantAttribute>;

export const Covenant = z.object({
  "name": z.string(),
  "generals": z.string().array(),
  "attributes": z.array(CovenantAttribute).optional(),
})

export const ExtendedGeneral = z.object({
  general: GeneralClass,
  specialities: z.array(Speciality),
  books: z.array(z.union([Book, specialSkillBook,standardSkillBook])),
  computedBuffs: z.array(b.BuffParams),
  complete: z.boolean().default(false),
})

export type ExtendedGeneralType = z.infer<typeof ExtendedGeneral>;

export const ExtendedGeneralSet = z.set(ExtendedGeneral);
export type ExtendedGeneralSetType = z.infer<typeof ExtendedGeneralSet>;
