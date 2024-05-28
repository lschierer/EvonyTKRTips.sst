import {z as zod} from 'zod';

import * as b from './baseSchemas';


export const Book = zod.object({
  "name": zod.string(),
  "level": zod.string().optional(),
  "buff": zod.array(b.Buff).nonempty(),
});
export type BookType = zod.infer<typeof Book>;

export const standardSkillBook = Book.required();
export type standardSkillBookType = zod.infer<typeof standardSkillBook>;

export const specialSkillBook = Book.omit({"level": true});
export type specialSkillBookType = zod.infer<typeof specialSkillBook>;

