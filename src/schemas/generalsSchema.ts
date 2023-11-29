import * as z from "zod";

import * as b from './baseSchemas';

import * as s from './specialitySchema'

import {Book, type BookType} from './bookSchemas';

export const generalUseCase = z.enum([
    "all",
    "Monsters",
    "Attack",
    "Defense",
    "Overall",
    "Wall",
    "Mayors"
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
    "level": b.levels.refine((l) => {
        switch (l) {
          case '0':
          case '6':
          case '7':
          case '8':
          case '9':
          case '10':
            return true;
          default:
            return false;
          }
      }),
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
    "score_as": b.ClassEnum.optional(),
    "specialities": z.array(s.Speciality).nullish(),
    "books": z.array(Book).nullish(),
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
    primary: GeneralClass,
    secondary: GeneralClass,
});

export type GeneralPairType = z.infer<typeof GeneralPair>;