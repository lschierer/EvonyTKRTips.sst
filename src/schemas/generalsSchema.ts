import * as z from "zod";

import * as b from './baseSchemas';

import * as s from './specialitySchema'

export const DisplaySchema = z.enum([
  "summary",
]);
export type Display = z.infer<typeof DisplaySchema>;



export const NoteSchema = z.object({
    "text": z.string(),
    "severity": z.string(),
});
export type Note = z.infer<typeof NoteSchema>;

export const BookSchema = z.object({
    "name": z.string(),
    "buff": z.array(b.BuffSchema),
});
export type Book = z.infer<typeof BookSchema>;

export const ValueSchema = z.object({
    "number": z.number(),
    "unit": b.UnitSchema,
});
export type Value = z.infer<typeof ValueSchema>;


export const AscendingSchema = z.object({
    "level": z.string(),
    "buff": z.array(b.BuffSchema),
});
export type Ascending = z.infer<typeof AscendingSchema>;

export const GeneralSchema = z.object({
    "name": z.string(),
    "display": DisplaySchema,
    "note": z.union([z.array(NoteSchema), z.null()]).optional(),
    "leadership": z.number(),
    "leadership_increment": z.number(),
    "attack": z.number(),
    "attack_increment": z.number(),
    "defense": z.number(),
    "defense_increment": z.number(),
    "politics": z.number(),
    "politics_increment": z.number(),
    "level": z.string(),
    "specialities": z.array(s.SpecialitySchema),
    "ascending": z.array(AscendingSchema),
    "stars": z.string(),
    "books": z.array(BookSchema),
    "score_as": b.ClassEnumSchema,
});
export type General = z.infer<typeof GeneralSchema>;

export const AllGeneralSchema = z.object({
    "general": GeneralSchema,
});
export type AllGeneral = z.infer<typeof AllGeneralSchema>;
