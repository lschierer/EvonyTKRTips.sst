import * as z from "zod";

import * as b from './baseSchemas';

import {Book, type BookType} from './bookSchemas';

export const ConflictDatum = z.object({
    "conflicts": z.record(z.string(), z.array(z.string())),
    "books": z.union([z.array(Book), z.null()]).optional(),
});
export type ConflictDatumType = z.infer<typeof ConflictDatum>;

export const ConflictArray = z.array(ConflictDatum);

export type ConflictArrayType = z.infer<typeof ConflictArray>;
