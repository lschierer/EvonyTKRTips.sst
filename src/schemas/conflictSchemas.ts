import * as z from "zod";

import * as b from './baseSchemas';

import {BookSchema, type Book} from './bookSchemas';

export const AllConflictSchema = z.object({
    "conflicts": z.record(z.string(), z.array(z.string())),
    "books": z.union([z.array(BookSchema), z.null()]).optional(),
});
export type AllConflict = z.infer<typeof AllConflictSchema>;
