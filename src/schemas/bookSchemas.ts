import * as z from "zod";

import * as b from './baseSchemas';


export const BookSchema = z.object({
  "name": z.string(),
  "buff": z.array(b.BuffSchema),
  "level": z.string(),
});
export type Book = z.infer<typeof BookSchema>;
