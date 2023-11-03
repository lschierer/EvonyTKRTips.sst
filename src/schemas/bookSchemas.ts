import * as z from "zod";

import * as b from './baseSchemas';


export const BookSchema = z.object({
  "name": z.string(),
  "buff": z.array(b.BuffSchema),
  "level": z.string().nullish(),
});
export type Book = z.infer<typeof BookSchema>;

export const standardSkillBook = BookSchema.required();
export type standardSkillBookType = z.infer<typeof standardSkillBook>;

