import * as z from "zod";

import * as b from './baseSchemas';


export const Book = z.object({
  "name": z.string(),
  "buff": z.array(b.BuffSchema),
  "level": z.string().nullish(),
});
export type BookType = z.infer<typeof Book>;

export const standardSkillBook = Book.required();
export type standardSkillBookType = z.infer<typeof standardSkillBook>;

