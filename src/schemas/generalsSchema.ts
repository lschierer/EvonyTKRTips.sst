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
  "summary",
]);
export type DisplayType = z.infer<typeof Display>;

export const Note = z.object({
    "text": z.string(),
    "severity": b.syslogSeverity,
});
export type NoteType = z.infer<typeof Note>;

export const Ascending = z.object({
    "level": z.string(),
    "buff": z.array(b.BuffSchema),
});
export type AscendingType = z.infer<typeof Ascending>;

export const GeneralClass = z.object({
    "name": z.string(),
    "display": Display,
    "leadership": z.number(),
    "leadership_increment": z.number(),
    "attack": z.number(),
    "attack_increment": z.number(),
    "defense": z.number(),
    "defense_increment": z.number(),
    "politics": z.number(),
    "politics_increment": z.number(),
    "level": b.levels,
    "stars": b.levels,
    "score_as": b.ClassEnum,
    "specialities": z.array(s.Speciality).nullish(),
    "books": z.array(Book).nullish(),
    "ascending": z.array(Ascending).nullish(),
    "note": z.array(Note).nullish(),
});
export type GeneralClassType = z.infer<typeof GeneralClass>;

export const GeneralElementSchema = z.object({
    "general": GeneralClass,
});
export type GeneralElement = z.infer<typeof GeneralElementSchema>;

export const GeneralArray = z.array(GeneralElementSchema);
export type GeneralArrayType = z.infer<typeof GeneralArray>;

export const GeneralPair = z.object({
    primary: GeneralClass,
    secondary: GeneralClass,
});

export type GeneralPairType = z.infer<typeof GeneralPair>;