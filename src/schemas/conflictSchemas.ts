import * as z from "zod";


import { standardSkillBook } from "./bookSchemas";
import {Book, } from './bookSchemas';


export const bookConflicts = z.object({books: z.array(standardSkillBook)})
export type bookConflictsType = z.infer<typeof bookConflicts>;

const nameConflicts = z.record(z.string().ulid(), z.array(z.string()));
export type nameConflictsTypes = z.infer<typeof nameConflicts>;

const otherConflicts = z.object({other: z.array(z.string())});
export type otherConflictType = z.infer<typeof otherConflicts>;

export const generalConflicts = z.object({"conflicts":
    z.record(z.union([z.string().ulid(),z.literal('other')]), z.array(z.string())),
    books: z.array(standardSkillBook).nullish(),
});
export type generalConflictsType = z.infer<typeof generalConflicts>;

export const generalConflictCollection = z.array(generalConflicts);

export const ConflictDatum = z.object({
    "conflicts": z.record(z.string(), z.array(z.string())),
    "books": z.union([z.array(Book), z.null()]).optional(),
});
export type ConflictDatumType = z.infer<typeof ConflictDatum>;

export const ConflictArray = z.array(ConflictDatum);

export type ConflictArrayType = z.infer<typeof ConflictArray>;
