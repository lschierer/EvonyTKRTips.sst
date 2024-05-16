import {z} from "astro:content";

import * as b from './baseSchemas';


export const Book = z.object({
  "name": z.string(),
  "level": z.string().optional(),
  "buff": z.array(b.Buff).nonempty(),
});
export type BookType = z.infer<typeof Book>;

export const standardSkillBook = Book.required();
export type standardSkillBookType = z.infer<typeof standardSkillBook>;

export const specialSkillBook = Book.omit({"level": true});
export type specialSkillBookType = z.infer<typeof specialSkillBook>;

