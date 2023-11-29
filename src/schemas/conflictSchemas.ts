import * as z from "zod";

import * as b from './baseSchemas';
import { standardSkillBook } from "./bookSchemas";
import {Book, type BookType} from './bookSchemas';


export const bookConflicts = z.object({books: z.array(standardSkillBook)})
export type bookConflictsType = z.infer<typeof bookConflicts>;

const nameConflicts = z.record(z.string(), z.array(z.string()));
export type nameConflictsTypes = z.infer<typeof nameConflicts>;

const otherConflicts = z.object({other: z.array(z.string())});
export type otherConflictType = z.infer<typeof otherConflicts>;

export const generalConflicts = z.object({"conflicts":
    z.union([
        nameConflicts,
            otherConflicts,
        ]),
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
