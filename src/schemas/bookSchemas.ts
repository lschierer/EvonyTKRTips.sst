import * as z from "zod";

import * as b from './baseSchemas';


export const Book = z.object({
  "name": z.string(),
  "buff": z.array(b.Buff),
  "level": z.string().nullish(),
});
export type BookType = z.infer<typeof Book>;

export const standardSkillBook = Book.required();
export type standardSkillBookType = z.infer<typeof standardSkillBook>;

export const specialSkillBook = Book.omit({"level": true});
export type specialSkillBookType = z.infer<typeof specialSkillBook>;

