import {z as zod} from 'zod';

import * as b from './baseSchemas';


export const generalRole = zod.enum(['primary','secondary']);
export type generalRoleType = zod.infer<typeof generalRole>;
export  const generalSpecialists = zod.enum([
  ...b.ClassEnum.options,
  "Wall",
  "Mayor"
]);
export type generalSpecialistsType = zod.infer<typeof generalSpecialists>;

export const generalUseCase = zod.enum([
  "all",
  "Monsters",
  "Attack",
  "Defense",
  "Overall",
  "Wall",
  "Mayor"
  ]);

export type generalUseCaseType = zod.infer<typeof generalUseCase>;

export const Display = zod.enum([
  "primary",
  "assistant",
  "summary",
]);
export type DisplayType = zod.infer<typeof Display>;

export const Note = zod.object({
  "text": zod.string(),
  "severity": b.syslogSeverity,
});
export type NoteType = zod.infer<typeof Note>;

export const Ascending = zod.object({
  "level": b.AscendingLevels,
  "buff": zod.array(b.Buff),
});
export type AscendingType = zod.infer<typeof Ascending>;

export const totalBuffs = zod.object({
  attack: zod.number(),
  defense: zod.number(),
  hp: zod.number(),
  march: zod.number(),
});
export type totalBuffsType = zod.infer<typeof totalBuffs>;

export const GeneralClass = zod.object({
  name: zod.string(),
  display: Display.optional(),
  leadership: zod.number(),
  leadership_increment: zod.number(),
  attack: zod.number(),
  attack_increment: zod.number(),
  defense: zod.number(),
  defense_increment: zod.number(),
  politics: zod.number(),
  politics_increment: zod.number(),
  level: b.levels,
  stars: b.levels.refine((l) => {
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
  score_as: generalSpecialists,
  specialities: zod.array(zod.string()).nullish(),
  books: zod.array(zod.string()).nullish(),
  ascending: zod.array(Ascending).nullish(),
  note: zod.array(Note).nullish(),
  totalBuffs: totalBuffs.nullish(),
});
export type GeneralClassType = zod.infer<typeof GeneralClass>;

export const GeneralElement = zod.object({
  general: GeneralClass,
});
export type GeneralElementType = zod.infer<typeof GeneralElement>;

export const GeneralArray = zod.array(GeneralElement);
export type GeneralArrayType = zod.infer<typeof GeneralArray>;

export const CovenantAttributeCategory = zod.enum([
  "War Covenant",
  "Cooperation Covenant",
  "Peace Covenant",
  "Faith Covenant",
  "Honor Covenant",
  "Civilization Covenant",
])

export type CovenantAttributeCategoryType = zod.infer<typeof CovenantAttributeCategory>;

export const CovenantAttribute = zod.object({
  "category": CovenantAttributeCategory,
  "type": zod.enum(['personal','passive']),
  "buff": zod.array(b.Buff),
});

export type CovenantAttributeType = zod.infer<typeof CovenantAttribute>;

export const Covenant = zod.object({
  "name": zod.string(),
  "generals": zod.string().array(),
  "attributes": zod.array(CovenantAttribute).optional(),
})

