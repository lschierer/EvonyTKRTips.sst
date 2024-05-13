import {z} from "astro:content";


import { standardSkillBook } from "./bookSchemas";
import {Book, } from './bookSchemas';


export const bookConflicts = z.object({
    books: z.array(standardSkillBook)
})
export type bookConflictsType = z.infer<typeof bookConflicts>;

const nameConflictUlid = z.string().ulid();
type nameConflictUlidType = z.infer<typeof nameConflictUlid>;

const nameConflicts = z.object({
    nameConflictUlidType:  z.array(z.string())
});
export type nameConflictsTypes = z.infer<typeof nameConflicts>;

const otherConflicts = z.record(z.literal('other'), z.array(z.string()));
export type otherConflictType = z.infer<typeof otherConflicts>;

export const ConflictDatum = z.object({
    "conflicts": z.record(z.string(), z.array(z.string())),
    "books": z.array(standardSkillBook).optional(),
});
export type ConflictDatumType = z.infer<typeof ConflictDatum>;

export const ConflictArray = z.array(ConflictDatum);

export type ConflictArrayType = z.infer<typeof ConflictArray>;
